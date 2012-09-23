var async = require('async');

var user = process.argv[2];
var token = process.argv[3];

var capsule = require('capsule-crm').createConnection(user, token);

var appendResult = function(result, name, parameter) {
  if (!result)
    result = {};
  result[name] = parameter;
  return result;
}

var first = function(f) {
  return function(cb) { f(null, cb); };
}

var testAddOrganisation = function(parameter, cb) {
  console.log("Adding organisation");
  console.log(parameter);
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

var testAddPerson = function(parameter, cb) {
  console.log("Adding person");
  var person = {
    "person": {
      "firstName": 'Test',
      "lastName": 'Test',
      "organisationId": parameter['organisation'],
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

var testAddOpportunity = function(parameter, cb) {
  var opportunity = {
    "opportunity": {
      "name": "Test Opportunity",
      "milestone": "Lead"
    }
  };
  var partyId = parameter['organisation'];
  console.log("Adding opportunity for party: "+partyId);
  capsule.addOpportunityFor('party', partyId, opportunity, function(err, result) {
    if (!err)
      console.log('Added opportunity with id: '+result);
    cb(err, appendResult(parameter, 'opportunity', result));
  });
}

var testAddTag = function(parameter, cb) {
  console.log("Adding tag for opportunity: "+parameter['opportunity']);
  capsule.addTagFor('opportunity', parameter['opportunity'], "Test Tag", function(err, result) {
    if (!err)
      console.log('Added tag: '+result);
    cb(err, appendResult(parameter, 'tag', result));
  });
}

/*
 * XXX Warning: for this method to work, the custom fields
 * must already exist in Capsule. They are not created automatically.
 */
var testAddCustomField = function(parameter, cb) {
  var partyId = parameter['organisation'];
  console.log("Adding custom field for party: "+partyId);
  var now = capsule.formatDate(new Date());
  console.log('Now: '+now);
  var customField = {
    'customFields': {
      'customField': [
        { 
          "label": "TestLabel",
          "text": "TestText"
        },
        { 
          "label": "TestDateField",
          "date": now
        }
       ]
    }
  };
  capsule.setCustomFieldFor('party', partyId, customField, function(err, result) {
    if (!err)
      console.log('Added custom field');
    cb(err, appendResult(parameter, 'customfield', result));
  });
}

var testDeleteOpportunity = function(parameter, cb) {
  var opportunityId = parameter['opportunity'];
  console.log("Deleting opportunity with id:"+opportunityId);
  capsule.deleteOpportunity(opportunityId, function(err, result) {
    if (!err)
      console.log('Deleted opportunity');
    cb(err, parameter);
  });
}

var testDeleteOrganisation = function(parameter, cb) {
  var organisationId = parameter['organisation'];
  console.log("Deleting organisation with id:"+organisationId);
  capsule.deleteParty(organisationId, function(err, result) {
    if (!err)
      console.log('Deleted organisation');
    cb(err, parameter);
  });
}

var testDeletePerson = function(parameter, cb) {
  var personId = parameter['person'];
  console.log("Deleting person with id:"+personId);
  capsule.deleteParty(personId, function(err, result) {
    if (!err)
      console.log('Deleted person');
    cb(err, parameter);
  });
}

async.waterfall([
    first(testAddOrganisation),
    testAddPerson,
    testAddOpportunity,
    testAddTag,
    testAddCustomField,
    testDeleteOpportunity,
    testDeletePerson,
    testDeleteOrganisation
] , function (err, result) {
  if (err)
    console.log('Tests failed with error: '+err);
  else
    console.log('All tests passed');
});
