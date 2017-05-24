'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');
const Story = require('../models/story');

mongoose.Promise = Promise;

// *** SERVER SETUP ***

require('../server');
const url = `http://localhost:${process.env.PORT}`;

// *** TEST MODEL SETUP ***

const testUser = {
  username: 'christina',
  password: 'thebestpasswordever',
  email: 'christina@narratus.io',
  followedStories: [],
};

const exampleStory = {
  title: 'The way we built Narratus',
  description: 'Project week - midterm project for JS backend and final project for iOS',
  startSnippet: 'There were seven of us assigned to a team. And then the murders began',
};

describe('User routes', function() {
  
  describe('Testing user Schema', () => {
    it('Should create a user when given the correct information', done => {
      let req = {};
      req.body = {username: 'Scott', password: 'secret', email: 'scott@codefellows.org'};
      let user = new User(req.body);
      expect(user.username).to.equal('Scott');
      expect(user.password).to.equal('secret');
      expect(user.email).to.equal('scott@codefellows.org');
      expect(user.ownedStories).to.be.a('array');
      expect(user.followedStories).to.be.a('array');
      expect(user.snippetsWritten).to.be.a('array');
      expect(user).to.be.a('object');
      done();
    });

    it('Should not create a user when given invalid information', done => {
      let req = {};
      req.body = {username: '', password: '', email: ''};
      let user = new User(req.body);
      expect(user.username).to.not.equal('Scott');
      expect(user.password).to.not.equal('secret');
      expect(user.email).to.not.equal('scott@codefellows.org');
      expect(user.ownedStories).to.be.a('array');
      expect(user.followedStories).to.be.a('array');
      expect(user.snippetsWritten).to.be.a('array');
      expect(user).to.be.a('object');
      done();
    });
  });
  
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


  describe('GET: /snippetapproval/:storyId', () => {


    describe('testing the snippet approval route', () => {


      beforeEach(done => {
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
        .catch(() => done());
      });

      beforeEach(done => {
        exampleStory.userId = this.tempUser._id.toString();
        new Story(exampleStory).save()
        .then(story => {
          this.tempStory = story;
          done();
        })
        .catch(() => done());
      });

      afterEach(() => delete exampleStory.userId);

      afterEach(done => {
        Promise.all([
          User.remove({}),
          Story.remove({}),
        ])
        .then(() => done())
        .catch(() => done());
      });

      it('should return a status of 200 upon proper request', done => {
        request.get(`${url}/api/snippetapproval/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          console.log('this.tempstory', this.tempStory);
          expect(res.status).to.equal(200);
          done();
        });
      });

      it('should return a status of 401 if unauthorized', done => {
        request.get(`${url}/api/snippetapproval/${this.tempStory._id}`)
        .set({Authorization: 'Bad token'})
        .end((err, res) => {
          console.log('this.tempstory', this.tempStory);
          expect(res.status).to.equal(401);
          done();
        });
      });

      it('should return a status of 404 if not found', done => {
        request.get(`${url}/api/snippetapproval`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          console.log('this.tempstory', this.tempStory);
          expect(res.status).to.equal(404);

          done();
        });
      });

      it('populated approved should return a specific user stories', done => {
        request.get(`${url}/api/snippetapproval/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(this.tempToken).to.be.a('string');
          console.log('res.body', res.body);
          expect(res.body.snippets).to.exist;
          expect(res.body.snippets).to.be.a('array');
          expect(res.body.pendingSnippets).to.exist;
          expect(res.body.pendingSnippets).to.be.a('array');
          expect(res.body).to.be.a('object');
          done();
        });

      });
    });
  }); // end integration tests
});

