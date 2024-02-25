const moment = require('moment');

const { startServer, stopServer } = require('../../lib/server');
const { request } = require('../scripts/helpers');
const mock = require('../scripts/mock-core-registry');
const generator = require('../scripts/generator');

describe('Events listing', () => {
    beforeEach(async () => {
        mock.mockAll();
        await startServer();
    });

    afterEach(async () => {
        await stopServer();
        mock.cleanAll();

        await generator.clearAll();
    });

    it('should work without authorization on / GET', async () => {
        mock.mockAll({
            core: { unauthorized: true },
            mainPermissions: { unauthorized: true },
            approvePermissions: { unauthorized: true }
        });

        const event = await generator.createEvent({ status: 'published' });
        await generator.createEvent({ status: 'draft' });

        const res = await request({
            uri: '/',
            method: 'GET'
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).toEqual(1);

        expect(res.body.data[0]).toHaveProperty('id');
        expect(res.body.data[0]).toHaveProperty('name');
        expect(res.body.data[0]).toHaveProperty('starts');
        expect(res.body.data[0]).toHaveProperty('ends');
        expect(res.body.data[0]).toHaveProperty('application_status');
        expect(res.body.data[0]).toHaveProperty('status');
        expect(res.body.data[0]).toHaveProperty('type');
        expect(res.body.data[0]).toHaveProperty('description');
        expect(res.body.data[0]).toHaveProperty('meals_per_day');
        expect(res.body.data[0]).toHaveProperty('accommodation_type');
        expect(res.body.data[0]).toHaveProperty('optional_programme');
        expect(res.body.data[0]).toHaveProperty('optional_fee');
        expect(res.body.data[0]).toHaveProperty('link_info_travel_country');

        expect(res.body.data[0].id).toEqual(event.id);
    });

    it('should list all published on / GET', async () => {
        const event = await generator.createEvent({ status: 'published' });
        await generator.createEvent({ status: 'draft' });

        const res = await request({
            uri: '/',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).toEqual(1);

        expect(res.body.data[0]).toHaveProperty('id');
        expect(res.body.data[0]).toHaveProperty('name');
        expect(res.body.data[0]).toHaveProperty('starts');
        expect(res.body.data[0]).toHaveProperty('ends');
        expect(res.body.data[0]).toHaveProperty('application_status');
        expect(res.body.data[0]).toHaveProperty('status');
        expect(res.body.data[0]).toHaveProperty('type');
        expect(res.body.data[0]).toHaveProperty('description');
        expect(res.body.data[0]).toHaveProperty('meals_per_day');
        expect(res.body.data[0]).toHaveProperty('accommodation_type');
        expect(res.body.data[0]).toHaveProperty('optional_programme');
        expect(res.body.data[0]).toHaveProperty('optional_fee');
        expect(res.body.data[0]).toHaveProperty('link_info_travel_country');

        expect(res.body.data[0].id).toEqual(event.id);
    });

    it('should use the default limit if limit is NaN', async () => {
        const res = await request({
            uri: '/?limit=nan',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).not.toEqual(1);
        expect(res.body.meta.limit).not.toEqual('nan');
    });

    it('should use the default limit if limit is < 0', async () => {
        await generator.createEvent({ status: 'published' });

        const res = await request({
            uri: '/?limit=-1',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).not.toEqual(-1);
        expect(res.body.meta.limit).not.toEqual(-1);
    });

    it('should work with limit if limit is > 0', async () => {
        await generator.createEvent({ status: 'published' });
        await generator.createEvent({ status: 'published' });

        const res = await request({
            uri: '/?limit=1',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).toEqual(1);
        expect(res.body.meta.limit).toEqual(1);
    });

    it('should use the default offset if offset is NaN', async () => {
        const res = await request({
            uri: '/?offset=nan',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).not.toEqual(1);
        expect(res.body.meta.offset).not.toEqual('nan');
    });

    it('should use the default offset if offset is < 0', async () => {
        const res = await request({
            uri: '/?offset=-1',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).not.toEqual(1);
        expect(res.body.meta.offset).not.toEqual(-1);
    });

    it('should work with offset if offset is > 0', async () => {
        await generator.createEvent({ status: 'published' });
        await generator.createEvent({ status: 'published' });

        const res = await request({
            uri: '/?offset=100',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).toEqual(0);
        expect(res.body.meta.offset).toEqual(100);
    });

    it('should display only specified event types if specified and if multiple types are specified', async () => {
        await generator.createEvent({ status: 'published', type: 'cultural' });
        const event = await generator.createEvent({ status: 'published', type: 'training' });

        const res = await request({
            uri: '/?type[]=training',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].id).toEqual(event.id);
    });

    it('should display only specified event types if specified and if single type is specified', async () => {
        await generator.createEvent({ status: 'published', type: 'cultural' });
        const event = await generator.createEvent({ status: 'published', type: 'training' });

        const res = await request({
            uri: '/?type=training',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].id).toEqual(event.id);
    });

    it('should filter by start date', async () => {
        await generator.createEvent({
            status: 'published',
            application_starts: moment().subtract(5, 'week').toDate(),
            application_ends: moment().subtract(4, 'week').toDate(),
            starts: moment().subtract(3, 'week').toDate(),
            ends: moment().subtract(2, 'week').toDate(),
        });

        const event = await generator.createEvent({
            status: 'published',
            application_starts: moment().add(1, 'week').toDate(),
            application_ends: moment().add(2, 'week').toDate(),
            starts: moment().add(3, 'week').toDate(),
            ends: moment().add(4, 'week').toDate(),
        });

        const res = await request({
            uri: '/?starts=' + moment().format('YYYY-MM-DD'),
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].id).toEqual(event.id);
    });

    it('should filter by end date', async () => {
        await generator.createEvent({
            status: 'published',
            application_starts: moment().add(1, 'week').toDate(),
            application_ends: moment().add(2, 'week').toDate(),
            starts: moment().add(3, 'week').toDate(),
            ends: moment().add(4, 'week').toDate(),
        });

        const event = await generator.createEvent({
            status: 'published',
            application_starts: moment().subtract(5, 'week').toDate(),
            application_ends: moment().subtract(4, 'week').toDate(),
            starts: moment().subtract(3, 'week').toDate(),
            ends: moment().subtract(2, 'week').toDate(),
        });

        const res = await request({
            uri: '/?ends=' + moment().format('YYYY-MM-DD'),
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].id).toEqual(event.id);
    });

    it('should filter by name case-insensitive', async () => {
        await generator.createEvent({
            status: 'published',
            name: 'NWM Voronezh'
        });

        const res = await request({
            uri: '/?search=nwm',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);

        expect(res.body.data[0].name.toLowerCase()).toContain('nwm');
    });

    it('should filter by description case-insensitive', async () => {
        await generator.createEvent({
            status: 'published',
            description: 'Drafting Action Agenda'
        });

        const res = await request({
            uri: '/?search=action agenda',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);

        expect(res.body.data[0].description.toLowerCase()).toContain('action agenda');
    });

    it('should sort events properly', async () => {
        const first = await generator.createEvent({
            status: 'published',
            application_starts: moment().add(1, 'day').toDate(),
            application_ends: moment().add(2, 'days').toDate(),
            starts: moment().add(3, 'days').toDate(),
            ends: moment().add(4, 'days').toDate()
        });
        const third = await generator.createEvent({
            status: 'published',
            application_starts: moment().add(9, 'day').toDate(),
            application_ends: moment().add(10, 'days').toDate(),
            starts: moment().add(11, 'days').toDate(),
            ends: moment().add(12, 'days').toDate()
        });
        const second = await generator.createEvent({
            status: 'published',
            application_starts: moment().add(5, 'day').toDate(),
            application_ends: moment().add(6, 'days').toDate(),
            starts: moment().add(7, 'days').toDate(),
            ends: moment().add(8, 'days').toDate()
        });

        const res = await request({
            uri: '/',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);

        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.length).toEqual(3);
        expect(res.body.data[0].id).toEqual(first.id);
        expect(res.body.data[1].id).toEqual(second.id);
        expect(res.body.data[2].id).toEqual(third.id);
    });

    it('should list most recent events per body', async () => {
        await generator.createEvent({
            status: 'published',
            organizing_bodies: [{ body_id: 1, body_name: 'blabla' }],
            application_starts: moment().subtract(10, 'days').toDate(),
            application_ends: moment().subtract(9, 'days').toDate(),
            starts: moment().subtract(8, 'days').toDate(),
            end: moment().subtract(7, 'days').toDate(),
        });
        const mostRecentEvent = await generator.createEvent({
            status: 'published',
            organizing_bodies: [{ body_id: 1, body_name: 'blabla' }],
            application_starts: moment().subtract(5, 'days').toDate(),
            application_ends: moment().subtract(4, 'days').toDate(),
            starts: moment().subtract(3, 'days').toDate(),
            end: moment().subtract(2, 'days').toDate(),
        });

        const res = await request({
            uri: '/recents',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].latest_event).toEqual(mostRecentEvent.starts);
    });

    it('should not list most recent events in the future', async () => {
        const previousEvent = await generator.createEvent({
            status: 'published',
            organizing_bodies: [{ body_id: 1, body_name: 'blabla' }],
            application_starts: moment().subtract(10, 'days').toDate(),
            application_ends: moment().subtract(9, 'days').toDate(),
            starts: moment().subtract(8, 'days').toDate(),
            end: moment().subtract(7, 'days').toDate(),
        });
        await generator.createEvent({
            status: 'published',
            organizing_bodies: [{ body_id: 1, body_name: 'blabla' }],
            application_starts: moment().subtract(5, 'days').toDate(),
            application_ends: moment().subtract(4, 'days').toDate(),
            starts: moment().subtract(3, 'days').toDate(),
            end: moment().subtract(2, 'days').toDate(),
        });

        const ends = moment().subtract(5, 'days').toISOString();

        const res = await request({
            uri: '/recents?ends=' + ends,
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].latest_event).toEqual(previousEvent.starts);
    });
});
