const request = require('supertest');
const app = require('../app');

test('Should sign up a new user', async () => {
    await (await request(app).post('/users')).send({
        name: 'Shane',
        email: 'shane@test.com',
        password: 'MyPwd123456&'
    }).expect(201);
})


