/*
 * Copyright (C) 2012, Bug Buster Sàrl, Switzerland
 * Author(s): Olivier Crameri
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var assert = require('assert');
var capsuleCRM = require('..');

describe('capsule-crm', function() {
  var USER = process.env.CAPSULE_USER;
  var TOKEN = process.env.CAPSULE_TOKEN;

  var results = {};
  var capsule = capsuleCRM.createConnection(USER, TOKEN);

  function handler(_type, next, expectEmpty) {
    return function(err, result) {
      assert.ifError(err);
      if (expectEmpty)
        assert.strictEqual(result, null, 'unexpected result');
      else
        assert(result, 'missing result');
      results[_type] = result;
      next();
    };
  }

  it('should add organisation', function(done) {
    var organisation = {
      "organisation": {
        "name": "Capsule-CRM Node.js module, test organisation"
      }
    };
    capsule.addOrganisation(organisation, handler('organisation', done));
  });

  it('should add person', function(done) {
    var person = {
      "person": {
        "firstName": 'Capsule-CRM Node.js module',
        "lastName": 'Test Person',
        "organisationId": results.organisation,
        "contacts": {
          "email": {
            "emailAddress": 'capsule-crm-node-js@test.com'
          }
        }
      }
    };
    capsule.addPerson(person, handler('person', done));
  });

  it('should add opportunity', function(done) {
    var opportunity = {
      "opportunity": {
        "name": "Capsule-CRM Node.js module, test opportunity",
        "milestone": "Lead"
      }
    };
    var partyId = results.organisation;
    capsule.addOpportunityFor('party', partyId, opportunity, handler('opportunity', done));
  });

  it('should add tag for opportunity', function(done) {
    capsule.addOpportunityTag(results.opportunity, "Capsule-CRM Node.js, Test Tag", handler('tag', done));
  });

  it('should add custom fields for organisation (party)', function(done) {
    var customField = {
      'customFields': {
        'customField': [{
          "label": "Capsule Date Field",
          "date": capsuleCRM.formatDate(new Date())
        }]
      }
    };
    capsule.setPartyCustomFields(results.organisation, customField, handler('customfield', done, true));
  });

  it('should delete opportunity', function(done) {
    capsule.deleteOpportunity(results.opportunity, handler('del_opportunity', done, true));
  });

  it('should delete person', function(done) {
    capsule.deleteParty(results.person, handler('del_person', done, true));
  });

  it('should delete organisation', function(done) {
    capsule.deleteParty(results.organisation, handler('del_organisation', done, true));
  });

});
