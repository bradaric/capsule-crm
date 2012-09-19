### Node Capsule CRM

The official Capsule CRM API documentation can be found [here](http://developer.capsulecrm.com/v1/).

#### Usage

Create a connection and issue requests:

    var capsule = require('capsule-crm').createConnection('bugbuster', '<authentication token>');
    capsule.request({ path: '/party' }, function(err, data) {
      console.log(data);
    });

Some helper methods:

    capsule.countries(function(err, data) { });
    capsule.person ...
    capsule.tasks ...

```capsule.request()``` accepts the following parameters:

    {
      method: '', // GET, POST, PUT, DELETE ...
      path: '', // '/party'
      search: '', // querystring, 'foo=bar'
      data: {} // object to be passed as JSON in body
    }
