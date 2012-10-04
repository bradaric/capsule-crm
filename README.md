### Node Capsule CRM

This module is a thin wrapper for the Capsule CRM Rest API.
The official Capsule CRM API documentation can be found [here](http://developer.capsulecrm.com/v1/).

#### Running the tests

**Attention!** A valid Capsule CRM account is required to perform the tests.

Set the following environment variables with your Capsule credentials:

    CAPSULE_USER
    CAPSULE_TOKEN

Run all tests:

    npm test

Note that before running the tests, you should create in Capsule a custom field
whit label 'Capsule Date Field' and type 'Date'. Otherwise some tests will fail.

#### Usage

Create a connection and issue requests:

```js
var capsule = require('capsule-crm').createConnection('bugbuster', '<authentication token>');
capsule.request({ path: '/party' }, function(err, data) {
  console.log(data);
});
```

```capsule.request()``` accepts the following parameters:

```js
{
  method: '', // GET, POST, PUT, DELETE ...
  path: '', // '/party'
  search: '', // querystring, 'foo=bar'
  data: {} // object to be passed as JSON in body
}
```

### Helper methods to list objects

```js
capsule.countries(function(err, data) { });
capsule.person ...
capsule.tasks ...
```

### Helper methods to create objects

The objects to post through these methods follow the spec from the Capsule CRM
developer API. See test/add.js for full examples on how to use them

```js
var organisation = {
  "organisation": {
    "name": "Capsule-CRM Node.js module, test organisation"
  }
};
capsule.addOrganisation(organisation, function(err, data) { });
capsule.addPerson ...
capsule.addTask ...
```

Methods to create entries related to other entries (ex: an opportunity for a
person):

```js
capsule.addOpportunityFor('party', personId, opportunity, function(err, data) { });
capsule.addTaskFor('opportunity', opportunityId, task, function(err, data) { });
capsule.addTagFor('party', organisationId, 'This is a tag', function(err, data) { });
```

### Helper methods to delete entries:

```js
capsule.deleteParty(partyId, function(err, data)) { });
capsule.deleteOpportunity ...
capsule.deleteKase ...
capsule.deleteHistory ...
capsule.deleteTask ...
```

### LICENSE (MIT)

    Copyright (C) 2012, Bug Buster Sàrl, Switzerland
    Authors(s): Daniel Tralamazza, Olivier Crameri

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
