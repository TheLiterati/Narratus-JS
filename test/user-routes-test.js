'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');
// const Story = require('../models/story');

mongoose.Promise = Promise;

// *** SERVER SETUP ***

require('../server');
const url = `http://localhost:${process.env.PORT}`;

// *** TEST MODEL SETUP ***

const testUser = {
  username: 'christina',
  password: 'thebestpasswordever',
  email: 'christina@narratus.io',
  // ownedStories: ['ownedId1', 'ownedId2'],
  // 'followedId1', 'followedId2'
  followedStories: [],
};
// const testUser2 = {
//   username: 'michael',
//   password: 'thesecondbestpasswordever',
//   email: 'mp@narratus.io',
//   // ownedStories: ['ownedId1', 'ownedId2'],
//   // 'followedId1', 'followedId2'
//   followedStories: [],
// };
// const testStory = {
//   title: 'test title',
//   description: 'test description',
//   startSnippet: 'this is the first snippet of the test story',
// };????

describe('User routes', function() {

  // *** USER AUTHENTICATION ***

  // GET: for unauthenticated user: 200, 401, 404
  describe('GET: /api/signup', function(){

    // 404 (bad request, not found)
    describe('Signing in on the signup page', function(){
      it('Should result in a bad request 404 not found', done => {
        request.get(`${url}/api/signup`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    // NOTE: this may or may not be needed here
    after(done => {
      User.remove({})
      .then(done())
      .catch();
    });
  });

  // *** USER TESTS ***

  // POST: for user tests: 200, 400, 401
  describe('POST: /api/signup', function(){

    // 200 (proper request with valid body, returns a token)
    describe('user filled out form data correctly', function(){
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('string');
          done();
        });
      });
    });

    // 400 (bad request with invalid body)
    describe('user entered missing or incorrect form data', function(){
      it('should respond with a 400 bad request error', done => {
        request.post(`${url}/api/signup`)
        .send('badrequest')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    // 401 (unauthorized with invalid username/password)
    describe('user submitted invalid username or password', function(){
      it('should respond with a 401 unauthorized error', done => {
        // TODO:
        request.post(`${url}/api/signup`)
        .send('')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    // NOTE: this may or may not be needed here
    after(done => {
      User.remove({})
      .then(done())
      .catch();
    });
  });

  // GET: for user tests: 200, 401, 400
  describe('GET: /api/signin', function(){
    // Test user setup and teardown
    before(done => {
      let user = new User(testUser);
      user.generatePasswordHash(testUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch();
    });
    after(done => {
      User.remove({})
      .then(() => done())
      .catch(done);
    });

    // 200 (proper request with valid body, returns a token)
    describe('user logged in with correct credentials', function() {
      it('should respond with 200 ok status and token', done => {
        request.get(`${url}/api/signin`)
        .auth('christina', 'thebestpasswordever')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('string');
          done();
        });
      });
    });

    // 401 (unauthorized with invalid username/password)
    describe('user entered incorrect login information', function(){
      it('should repond with a 401 unauthorized error', done => {
        request.get(`${url}/api/signin`)
        .auth('wronguser', 'wrongpassword')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  // GET: for user tests: 404
  describe('GET: /api/signin', function() {
    // 404 (bad request, not found)
    describe('user put in a bad url path', function() {
      it('return a bad request 404 not found', done => {
        request.get(`${url}/api/badrequest`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    // NOTE: this may or may not be needed here
    after(done => {
      User.remove({})
      .then(done())
      .catch();
    });
  });
// End  
});

describe('User integration tests', () => {

  // Test user setup and teardown
  before(done => {
    new User(testUser)
    .generatePasswordHash(testUser.password)
    .then(user => user.save())
    .then(user => {
      this.tempUser = user;
      return user.generateToken();
    })
    .then(token => {
      this.tempToken = token;
      done();
    })
    .catch();
  });
  after(done => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('POST: /api/signup', () => {
    
    describe('Testing the create account method', () => {

      it('Should create a new user', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end((err, res) => {
          console.log('res.body', this.tempUser);          
          expect(res.body).to.be.a('object');
          done();
        });
      });
      
      it('Should create a token', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end(() => {
          console.log('this.temptoken', this.tempToken);
          expect(this.tempToken).to.be.a('string');
          done();
        });
      });

      it('Should create a hashed password', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end(() => {
          expect(this.tempUser.password).to.not.equal(testUser.password);
          done();
        });
      });
      
      it('Should create a username', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end(() => {
          expect(this.tempUser.username).to.equal(testUser.username);
          done();
        });
      });
      
      it('Should create an email', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end(() => {
          expect(this.tempUser.email).to.equal(testUser.email);
          done();
        });
      });
      
      it('Should create an ID', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end(() => {
          expect(this.tempUser._id).to.exist;
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', () => {

    describe('Testing the fetch account method', () => {

      it('Should return a user when logging in', done => {
        request.get(`${url}/api/signin`)
        .set({Authorization: `Basic ${this.tempToken}`})
        .send({'username': `${this.tempUser.username}`, 'password': `${testUser.password}`})
        .end(() => {
          expect(this.tempUser.username).to.equal('christina');
          done();
        });
      });

      it('Should generate a new token', done => {
        request.get(`${url}/api/signin`)
        .set({Authorization: `Basic ${this.tempToken}`})
        .send({'username': `${this.tempUser.username}`, 'password': `${testUser.password}`})
        .end(() => {
          expect(this.tempToken).to.be.a('string');
          done();
        });
      });

    }); // testing the create

  }); // end get signin


  describe('PUT: /api/logout/:userId', () => {

    describe('Testing the logout method', function(){
      it('Should take in a user id', done => {
        // TODO:
        request.put(`${url}/api/logout/:userId`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });

      it('Should return a user when given an id', done => {
        // TODO:
        request.put(`${url}/api/logout/:userId`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });

      it('Should reset token to an empty string', done => {
        // TODO:
        request.put(`${url}/api/logout/:userId`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });

    }); // end describe testing create

  }); // end of put logout

}); // end integration tests
