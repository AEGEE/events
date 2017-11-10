const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const path = require('path');

const server = require('../../lib/server.js');
const db = require('../scripts/populate-db.js');
const config = require('../../lib/config/config.js');

const should = chai.should();
chai.use(chaiHttp);

let accessObject = {
  users: [],
  roles: [],
  bodies: [],
  special: [],
};

describe('Lifecycles deletion', () => {
  let statuses;
  let lifecycles;
  let eventTypes;

  let newLifecycle;
  let omscoreStub;
  let omsserviceregistryStub;

  /* beforeEach(async () => {
    newLifecycle = {
      eventType: 'non-statutory',
      statuses: [{
        name: 'Status 1',
        visibility: accessObject,
        applicable: accessObject,
        edit_organizers: accessObject,
        edit_details: accessObject
      }, {
        name: 'Status 2',
        visibility: accessObject,
        applicable: accessObject,
        edit_organizers: accessObject,
        edit_details: accessObject
      }, {
        name: 'Status 3',
        visibility: accessObject,
        applicable: accessObject,
        edit_organizers: accessObject,
        edit_details: accessObject
      }],
      transitions: [{
        from: null,
        to: 'Status 1',
        allowedFor: accessObject,
      }, {
        from: 'Status 1',
        to: 'Status 2',
        allowedFor: accessObject,
      }, {
        from: 'Status 2',
        to: 'Status 1',
        allowedFor: accessObject,
      }, {
        from: 'Status 2',
        to: 'Status 3',
        allowedFor: accessObject,
      }],
      initialStatus: 'Status 1',
    };

    db.clear();
    const res = await db.populateLifecycles();

    statuses = res.statuses;
    lifecycles = res.lifecycles;
    eventTypes = res.eventTypes;

    omsserviceregistryStub = nock(config.registry.url + ':' + config.registry.port)
      .get('/services/omscore-nginx')
      .replyWithFile(200, path.join(__dirname, '..', 'assets', 'oms-serviceregistry-valid.json'));

    omscoreStub = nock('http://omscore-nginx')
      .post('/api/tokens/user')
      .replyWithFile(200, path.join(__dirname, '..', 'assets', 'oms-core-valid.json'));
  }); */

  it('should fail if no event type exists');
  it('should fail on unautorized access');
  it('should success on correct request');
});
