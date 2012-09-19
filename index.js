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
      opt.json = JSON.stringify(options.data);
    }
    request(opt, function(err, res, body) {
      if (!err && res.statusCode === 200)
        cb(null, JSON.parse(body));
      else
        cb(err);
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
      self.request({ path: '/' + li }, cb);
    };
  });
};

exports.createConnection = function(account, key) {
  return new Capsule(account, key);
};
