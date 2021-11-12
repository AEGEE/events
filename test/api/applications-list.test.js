const { startServer, stopServer } = require('../../lib/server');
const { request } = require('../scripts/helpers');
const mock = require('../scripts/mock-core-registry');
const generator = require('../scripts/generator');
const user = require('../assets/oms-core-valid.json').data;

describe('Events application listing', () => {
    beforeEach(async () => {
        mock.mockAll();
        await startServer();
    });

    afterEach(async () => {
        await stopServer();
        mock.cleanAll();

        await generator.clearAll();
    });

    it('should return 403 if you cannot view applications', async () => {
        mock.mockAll({ mainPermissions: { noPermissions: true } });
        const event = await generator.createEvent({ organizers: [{
            first_name: 'test',
            last_name: 'test',
            user_id: 1337
        }] });

        const res = await request({
            uri: '/single/' + event.id + '/applications',
            headers: { 'X-Auth-Token': 'foobar' },
            method: 'GET'
        });

        expect(res.statusCode).toEqual(403);

        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('message');
    });

    it('should display applications if you can see them', async () => {
        const event = await generator.createEvent({ organizers: [{
            first_name: 'test',
            last_name: 'test',
            user_id: user.id
        }] });

        const application = await generator.createApplication(event);
        const res = await request({
            uri: '/single/' + event.id + '/applications',
            headers: { 'X-Auth-Token': 'foobar' },
            method: 'GET'
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].id).toEqual(application.id);
    });

    it('should sort applications properly', async () => {
        const event = await generator.createEvent({ organizers: [{
            first_name: 'test',
            last_name: 'test',
            user_id: user.id
        }] });

        const first = await generator.createApplication(event, { user_id: 1 });
        const second = await generator.createApplication(event, { user_id: 2 });
        const third = await generator.createApplication(event, { user_id: 3 });

        await first.update({ user_id: 4 });

        const res = await request({
            uri: '/single/' + event.id + '/applications',
            headers: { 'X-Auth-Token': 'foobar' },
            method: 'GET'
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(3);

        expect(res.body.data[0].id).toEqual(first.id);
        expect(res.body.data[1].id).toEqual(second.id);
        expect(res.body.data[2].id).toEqual(third.id);
    });

    it('should not display events I haven\'t applied at /mine/participating', async () => {
        const event = await generator.createEvent();
        await generator.createApplication(event, { user_id: 1337 });

        const res = await request({
            uri: '/mine/participating',
            headers: { 'X-Auth-Token': 'foobar' },
            method: 'GET'
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(0);
    });

    it('should display events I\'ve applied at /mine/participating', async () => {
        const event = await generator.createEvent();
        await generator.createApplication(event, { user_id: user.id });

        const res = await request({
            uri: '/mine/participating',
            headers: { 'X-Auth-Token': 'foobar' },
            method: 'GET'
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].id).toEqual(event.id);
    });
});
