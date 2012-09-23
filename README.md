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

The objects to post through these methods follow the spec from the Capsule CRM
developer API. See test/add.js for full examples on how to use them

    var organisation = {
      "organisation": {
        "name": "Capsule-CRM Node.js module, test organisation"
      }
    };
    capsule.addOrganisation(organisation, function(err, data) { });
    capsule.addPerson ...
    capsule.addTask ...

Methods to create entries related to other entries (ex: an opportunity for a
person):

    capsule.addOpportunityFor('party', personId, opportunity, 
        function(err, data) { });
    capsule.addTaskFor('opportunity', opportunityId, task, 
        function(err, data) { });
    capsule.addTagFor('organisation', organisationId, 'This is a tag',
        function(err, data) { }); 

Methods to delete entries:
    
    capsule.deleteParty(partyId, function(err, data)) { });
    capsule.deleteOpportunity ...
    capsule.deleteKase ...
    capsule.deleteHistory ...
    capsule.deleteTask ...
