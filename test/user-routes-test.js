'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');
const Story = require('../models/story');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'christina',
  password: 'thebestpasswordever',
  email: 'christina@narratus.io',
  // ownedStories: ['ownedId1', 'ownedId2'],
  // 'followedId1', 'followedId2'
  followedStories: [],
};

const testStory = {
  title: 'test title',
  description: 'test description',
  startSnippet: 'this is the first snippet of the test story',
};

describe('User routes', function() {

  describe('POST: /api/signup', function(){
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
    after(done => {
      User.remove({})
      .then(done())
      .catch();
    });
  });

  describe('GET: /api/signin', function() {
    describe('user put in a bad url path', function() {
      it('return a bad request 404 not found', done => {
        request.get(`${url}/api/badrequest`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', function(){
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

  // follow story button
  // should get a 401 unauthorized as well if you go to route.
  describe('PUT: /api/follow/:userId/story/:storyId', function(){
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
      .catch(() => done());
    });

    before(done => {
      new Story(testStory).save()
      .then(story => {
        this.tempStory = story;
        done();
      })
      .catch(() => done());
    });

    after(done => {
      Promise.all([
        User.remove({}),
        Story.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });

    // should put a story id into the user's array in the database
    it('followed stories should have an array', done => {
      request.put(`${url}/api/follow/${this.tempUser._id}/story/${this.tempStory._id}`)
      .end((err, res) => {
        expect(testUser.followedStories).to.be.an('array');
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('story id should be in the correct format', done => {
      request.put(`${url}/api/follow/${this.tempUser._id}/story/${this.tempStory._id}`)
      .end((err, res) => {
        expect(testUser.followedStories[0]).to.be.a('string');
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('the id should not already be in the array', done => {
      request.put(`${url}/api/follow/${this.tempUser._id}/story/${this.tempStory._id}`)
      .end((err, res) => {
        expect(testUser.followedStories).to.be.a('string');
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should push a story id into an array', done => {
      request.put(`${url}/api/follow/${this.tempUser._id}/story/${this.tempStory._id}`)
      .end((err, res) => {
        expect(testUser.followedStories).to.be.a('string');
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  // expect(res.body.followedStories).to.equal(testUser.followedStories);

  // expect(res.body.ownedStories).to.equal(testUser.ownedStories);
  // put generated story id into array, create and delete a story.

// unfollow story button, delete: [empty] or [stories]

  // dashboard get: owned stories: [empty] or [owned]
  // dashboard get: followed stories [empty] or [followed]

});
// ownedStories: ['ownedId1', 'ownedId2'],
// followedStories: ['followedId1', 'followedId2'],

// [{type: Schema.Types.ObjectId, ref: 'story'}]
// {type: Schema.Types.ObjectId, ref: 'story'}
