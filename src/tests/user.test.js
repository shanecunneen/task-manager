const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'UserOne',
    email: 'UserOne@email.com',
    password: 'MyPwd12345',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();    // clear the database before each test
    await new User(userOne).save();
})

test('Should sign up a new user', async () => {
    const response = await (request(app).post('/users')).send({
        name: 'Shane',
        email: 'shane@test.com',
        password: 'MyPwd123456&'
    }).expect(201);
    
    // Get the user from the DB and check that all is correct
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // assert that the response body contains the name
    expect(response.body).toMatchObject({
        user: {
            name: 'Shane',
            email: 'shane@test.com'
        },
        token: user.tokens[0].token
    });

    // make sure the password is encrypted
    expect(user.password).not.toBe('MyPwd123456&');

}); 

test('Should login existing user', async () => {
    await request(app).post('/users/logon').send({
        email: userOne.email,
        password: userOne.password 
    }).expect(200); 
});

test('Should not login non-existant user', async () => {
    await request(app).post('/users/logon').send({
        email: userOne.email,
        password: 'WrongPassword' 
    }).expect(400); 
});

test('Should get the user profile', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get the user profile for unauthenticated', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});


test('Should delete the user', async() => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

        const user = await User.findById(userOneId);
        expect(user).toBeNull();  
});

test('Should not delete the user when unauthenticated', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401); 
});

test('Should upload image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', './fixtures/profile-pic.jpg')   
        .expect(200);
        
        const user = await User.findById(userOneId);
        expect(user.avatar).toEqual(expect.any());
});
