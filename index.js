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
      method: options.method || 'GET'
    };
    if (options.data) {
      opt.headers['Content-Type'] = 'application/json';
      opt.body = JSON.stringify(options.data);
    }
    request(opt, function(err, res, body) {
      if (err) cb(err);
      else if (res.statusCode !== 200 && res.statusCode !== 201)
        cb('Request returned with an invalid status code of: '+res.statusCode);
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

  var adders = [
    'person',
    'organisation'
  ];
  adders.forEach(function(li) {
    self['add'+li] = function(object, cb) {
      self.request({ path: '/' + li, method: 'POST', data: object}, function(error, headers, body) {
        var urlArray = headers.location.split('/');
        cb(error, urlArray[urlArray.length - 1]);
      });
    };
  });
};

exports.createConnection = function(account, key) {
  return new Capsule(account, key);
};
