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
   * Helpers for APIs to create new entries
   */
  var adders = [
    'person',
    'organisation',
    'task'
  ];
  adders.forEach(function(li) {
    self['add'+capitalize(li)] = function(object, cb) {
      self.request({ path: '/' + li, method: 'POST', data: object}, function(error, headers, body) {
        var result = null;
        if (!error && headers && headers.location) {
          var urlArray = headers.location.split('/');
          result = urlArray[urlArray.length - 1]
        }
        cb(error, result);
      });
    };
  });

  /*
   * Helpers for APIs to add entries related
   * to other entries
   * E.g.: opportunity for an organization
   */
  var addersFor = [
    'opportunity',
    'tag',
    'task'
  ]
  
  addersFor.forEach(function(li) {
    self['add'+capitalize(li)+'For'] = function(type, id, object, cb) {
      self.request({ path: '/' + type + '/' + id + '/' + li, method: 'POST', data: object}, function(error, headers, body) {
        var result = null;
        if (!error && headers && headers.location) {
          var urlArray = headers.location.split('/');
          result = urlArray[urlArray.length - 1]
        }
        cb(error, result);
      });
    };
  });
};

exports.createConnection = function(account, key) {
  return new Capsule(account, key);
};
