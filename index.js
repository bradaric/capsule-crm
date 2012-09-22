var request = require('request');
var url = require('url');

var Capsule = function(account, key) {
  var self = this;

  /**
   * options = {
   *   method (GET, PUT ...)
   *   path (/party)
   *   search (foo=bar)
   *   data (object to be JSONinified)
   * }
   *
   * cb = function(err, data)
   */
  self.request = function(options, cb) {
    var opt = {
      url: url.format({
        protocol: 'https',
        auth: key + ':x',
        host: account + '.capsulecrm.com',
        pathname: '/api' + options.path,
        search: options.search || ''
      }),
      headers: {
        Accept: 'application/json'
      },
      method: options.method || 'GET',
      jar: false
    };
    if (options.data) {
      opt.headers['Content-Type'] = 'application/json';
      opt.body = JSON.stringify(options.data);
    }
    request(opt, function(err, res, body) {
      if (err) cb(err);
      else if (res.statusCode !== 200 && res.statusCode !== 201) {
        var err = 'Request returned with an invalid status code of: '+res.statusCode;
        err += "\n\n" + body;
        cb(err);
      }
      else {
        // For POST requests, the body is null
        var bodyVal = body ? JSON.parse(body) : null;
        cb(null, res.headers, bodyVal);
      }
    });
  };

  /*
   * Capsule accepts date using the ISO format but without the milliseconds.
   * This function accordingly converts a date object to a string.
   */
  self.formatDate = function(d) {
    function pad(number) {
      var r = String(number);
      if ( r.length === 1 ) {
        r = '0' + r;
      }
      return r;
    }
    return d.getUTCFullYear()
      + '-' + pad( d.getUTCMonth() + 1 )
      + '-' + pad( d.getUTCDate() )
      + 'T' + pad( d.getUTCHours() )
      + ':' + pad( d.getUTCMinutes() )
      + ':' + pad( d.getUTCSeconds() )
      + 'Z';
  };

  // create simple listing calls
  var listers = [
    'countries',
    'currencies',
    'organisation',
    'person',
    'party',
    'opportunity',
    'kase',
    'tasks',
    'users'
  ];
  listers.forEach(function(li) {
    self[li] = function(cb) {
      self.request({ path: '/' + li }, function(error, headers, body) {
        cb(error, body);
      });
    };
  });


  var capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1, string.length);
 }

  /*
   * Utility to process the result of a query in the location header,
   * or return an error
   */
  var resultInLocationHeader = function(cb) {
    return function(error, headers, body) {
      var lastUrlElement = function(url) {
        var urlArray = url.split('/');
        return urlArray[urlArray.length - 1];
      }
      if (!error && headers && headers.location) {
        cb(error, lastUrlElement(headers.location));
      }
      else if (error) cb(error, null);
      else cb('Unexpected query result', result);
    }
  }

  /*
   * Helpers for APIs to create new entries
   */
  var adders = [
    'person',
    'organisation',
    'task'
  ];
  adders.forEach(function(li) {
    self['add'+capitalize(li)] = function(object, cb) {
      self.request({ path: '/' + li, method: 'POST', data: object}, resultInLocationHeader(cb));
    };
  });

  /*
   * Helpers for APIs to create entries related
   * to other entries
   * E.g.: opportunity for a party
   */
  var addersFor = [
    'opportunity',
    'task'
  ]
  addersFor.forEach(function(li) {
    self['add'+capitalize(li)+'For'] = function(forType, forId, object, cb) {
      self.request({ path: '/' + forType + '/' + forId + '/' + li, method: 'POST', data: object}, 
        resultInLocationHeader(cb));
    };
  });

  self.addTagFor = function(forType, forId, tagName, cb) {
    self.request({ path: '/' + forType + '/' + forId + '/tag/' + tagName, method: 'POST'}, 
        resultInLocationHeader(cb));
  };

  /*
   * Set a custom field for an object type.
   * XXX the custom field must already exist in Capsule,
   * it is not automatically created.
   */
  self.setCustomFieldFor = function(forType, forId, object, cb) {
    self.request({ path: '/' + forType + '/' + forId + '/customfields', method: 'PUT', data: object}, function(errors, headers, body) {
      cb(errors, null);
    });
  }
};

exports.createConnection = function(account, key) {
  return new Capsule(account, key);
};
