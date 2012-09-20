var async = require('async');

var user = process.argv[2];
var token = process.argv[3];

var capsule = require('capsule-crm').createConnection(user, token);

var testAddPerson = function(cb) {
  console.log("Adding person");
  var person = {
    "person": {
      "firstName": 'Test',
      "lastName": 'Test',
      "organisationName": 'NewTestCompany',
      "contacts": {
        "email": {
          "emailAddress": 'test@test.com'
        }
      }
    }
  };
  capsule.addperson(person, function(err, result) {
    if (!err) 
      console.log("Added person with id: "+result);
    cb(err);
  });
};

var testAddOrganisation = function(cb) {
  console.log("Adding organisation");
  var organisation = {
    "organisation": {
      "name": "Test add organisation"
    }
  };
  capsule.addorganisation(organisation, function(err, result) {
    if (!err) 
      console.log("Added organisation with id: "+result);
    cb(err);
  });
};

async.waterfall([
    testAddPerson,
    testAddOrganisation
] , function (err, result) {
  if (err)
    console.log('Tests failed with error: '+err);
  else
    console.log('All tests passed');
});
