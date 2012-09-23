### Node Capsule CRM

This module is a thin wrapper for the Capsule CRM Rest API.
The official Capsule CRM API documentation can be found [here](http://developer.capsulecrm.com/v1/).

#### Usage

Create a connection and issue requests:

    var capsule = require('capsule-crm').createConnection('bugbuster', '<authentication token>');
    capsule.request({ path: '/party' }, function(err, data) {
      console.log(data);
    });


```capsule.request()``` accepts the following parameters:

    {
      method: '', // GET, POST, PUT, DELETE ...
      path: '', // '/party'
      search: '', // querystring, 'foo=bar'
      data: {} // object to be passed as JSON in body
    }

### Helper methods to list objects

    capsule.countries(function(err, data) { });
    capsule.person ...
    capsule.tasks ...

### Helper methods to create objects
See test/add.js for examples on how to use these methods.
    capsule.addOrganisation(organisation, function(err, data) { });
    capsule.addPerson ...
    capsule.addOpportunityFor('party', partyId, opportunity, 
        function(err, data) { });
