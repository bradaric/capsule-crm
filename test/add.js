var async = require('async');

var user = process.argv[2];
var token = process.argv[3];

var capsule = require('capsule-crm').createConnection(user, token);

var appendResult = function(result, name, parameter) {
  if (result) {
    result[name] = parameter;
    return result;
  }
  else {
    return { name: parameter};
  }
}

var first = function(f) {
  return function(cb) { f(null, cb); };
}

var testAddPerson = function(parameter, cb) {
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
  capsule.addPerson(person, function(err, result) {
    if (!err) 
      console.log("Added person with id: "+result);
    cb(err, appendResult(parameter, 'person', result));
  });
};

var testAddOrganisation = function(parameter, cb) {
  console.log("Adding organisation");
  var organisation = {
    "organisation": {
      "name": "Test add organisation"
    }
  };
  capsule.addOrganisation(organisation, function(err, result) {
    if (!err) 
      console.log("Added organisation with id: "+result);
    cb(err, appendResult(parameter, 'organisation', result));
  });
};

var testAddOpportunity = function(parameter, cb) {
  var opportunity = {
    "opportunity": {
      "name": "Test Opportunity",
      "milestone": "Lead"
    }
  };
  capsule.addOpportunityFor('organisation', parameter['organisation'], opportunity, function(err, result) {
    cb(err, appendResult(parameter, 'opportunity', result));
  });
}

async.waterfall([
    first(testAddPerson),
    testAddOrganisation,
    testAddOpportunity
] , function (err, result) {
  if (err)
    console.log('Tests failed with error: '+err);
  else
    console.log('All tests passed');
});
