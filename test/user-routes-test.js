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
//   password: 'bestpassword',
//   email: 'michael@narratus.io',
// };

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

describe.only('User routes', function() {

  // *** USER AUTHENTICATION ***

  // GET: for unauthenticated user: 200, 401, 404
  describe('GET: /api/signup', function(){

    // 200 (proper request with valid body, returns a token)
    // NOTE: Cannot get a user or token on signup page.

    // 401 (unauthorized with invalid username/password)
    // NOTE: Cannot get invalid credentials on signup page.

    // 404 (bad request, not found)
    describe('Signing in on the signup page', function(){
      it('Should result in a bad request 404 not found', done => {
        // TODO:
        request.get(`${url}/api/signup`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  // End GET
  });

  // *** USER TESTS ***

  // POST: for user tests: 200, 400, 401
  describe('POST: /api/signup', function(){

    // 200 (proper request with valid body, returns a token)
    describe('User filled out form data correctly', function(){
      it('Should return a token', done => {
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
    describe('User entered no form data', function(){
      it('Should respond with a 400 bad request error', done => {
        request.post(`${url}/api/signup`)
        .send({ username: '' })
        .send({ password: '' })
        .send({ email: '' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('User already exists', function(){
      it('Should respond with a 400 bad request error', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    // 401 (unauthorized with invalid username/password)
    // NOTE: Cannot post unauthorized user because it doesn't yet exist.

    // NOTE: Removing this will result in "Unhandled rejection MongoError"
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
    describe('User logged in with correct credentials', function() {
      it('Should respond with 200 ok status and token', done => {
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
    describe('User entered incorrect login information', function(){
      it('Should repond with a 401 unauthorized error', done => {
        request.get(`${url}/api/signin`)
        .auth('wrong-user', 'wrong-password')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  // End GET
  });

  // GET: for user tests: 404
  describe('GET: /api/signin', function() {
    // 404 (bad request, not found)
    describe('User put in a bad url path', function() {
      it('Return a bad request 404 not found', done => {
        request.get(`${url}/api/badrequest`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  // NOTE: stretch goals below

  // PUT: (stretch)

  // 404 (bad request, not found)
  // PUT: for user tests: 200, 400, 401, 404
  describe('PUT: /api/follow/:userId/story/:storyId', function(){

    // 200 (proper request with valid body, returns a body)
    describe('Proper request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    // 400 (bad request with invalid body)
    describe('Bad request invalid TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    // 401 (unauthorized with invalid username/password)
    describe('Unauthorized TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    // 404 (bad request, not found)
    describe('Bad request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
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

  // DELETE: (stretch)

  // 204 (no content)
  describe('DELETE: /api/tbd', function(){

    // 200 (proper request with valid body, returns a body)
    describe('Proper request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
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








  // ### PREVIOUS 5/16 ###

  // follow story button
  // should get a 401 unauthorized as well if you go to route.

  //ALL THE WAY THROUGH LINE 223 - THIS IS THE STUFF WE WERE WORKING ON YESTERDAY BUT IS NOT SCAFFOLDED YET, TRY CHANGING THE DESCRIBE BLOCK TO AN ARROW FUNCTION :)
  // describe('PUT: /api/follow/:userId/story/:storyId', function(){
  //   before(done => {
  //     new User(testUser)
  //     .generatePasswordHash(testUser.password)
  //     .then(user => user.save())
  //     .then(user => {
  //       this.tempUser = user;
  //       console.log('before temp User', this.tempUser);
  //       return user.generateToken();
  //     })
  //     .then(token => {
  //       this.tempToken = token;
  //       done();
  //     })
  //     .catch(() => done());
  //   });
  //
  //   before(done => {
  //     new User(testUser2)
  //     .generatePasswordHash(testUser2.password)
  //     .then(user => user.save())
  //     .then(user => {
  //       this.tempUser2 = user;
  //       console.log('before temp User2', this.tempUser2);
  //       return user.generateToken();
  //     })
  //     .then(token => {
  //       this.tempToken2 = token;
  //       done();
  //     })
  //     .catch(() => done());
  //   });
  //
  //   before(done => {
  //     testStory.userId = this.tempUser2._id.toString();
  //     new Story(testStory).save()
  //     .then(story => {
  //       this.tempStory = story;
  //       console.log('before temp Story', this.tempStory);
  //       done();
  //     })
  //     .catch(() => done());
  //   });
  //
  //   afterEach(done => {
  //     Promise.all([
  //       User.remove({}),
  //       Story.remove({}),
  //     ])
  //     .then(() => done())
  //     .catch(done);
  //   });
  //   console.log('after temp Story', this.tempStory);
  //   console.log('after temp User', this.tempUser);
  //   console.log('after temp User2', this.tempUser2);
  //   // should put a story id into the user's array in the database
  //   it('followed stories should have an array', done => {
  //     request.put(`${url}/api/follow/${this.tempUser._id}/story/${this.tempStory._id}`)
  //     .send(testStory)
  //     // .set({Authorization: `Bearer ${this.tempToken}`})
  //     .end((err, res) => {
  //       console.log('test Story', testStory);
  //       expect(testUser.followedStories).to.be.an('array');
  //       console.log('res', res.body);
  //       expect(res.status).to.equal(200);
  //       done();
  //     });
  //   });
  //
  //   it('story id should be in the correct format', done => {
  //     request.put(`${url}/api/follow/${this.tempUser._id}/story/${this.tempStory._id}`)
  //     .end((err, res) => {
  //       expect(testUser.followedStories[0]).to.be.a('string');
  //       expect(res.status).to.equal(200);
  //       done();
  //     });
  //   });
  //
  //   it('the id should not already be in the array', done => {
  //     request.put(`${url}/api/follow/${this.tempUser._id}/story/${this.tempStory._id}`)
  //     .end((err, res) => {
  //       expect(testUser.followedStories).to.be.a('string');
  //       expect(res.status).to.equal(200);
  //       done();
  //     });
  //   });
  //
  //   it('should push a story id into an array', done => {
  //     request.put(`${url}/api/follow/${this.tempUser._id}/story/${this.tempStory._id}`)
  //     .end((err, res) => {
  //       expect(testUser.followedStories).to.be.a('string');
  //       expect(res.status).to.equal(200);
  //       done();
  //     });
  //   });
  // });

  // expect(res.body.followedStories).to.equal(testUser.followedStories);

  // expect(res.body.ownedStories).to.equal(testUser.ownedStories);
  // put generated story id into array, create and delete a story.

// unfollow story button, delete: [empty] or [stories]

  // dashboard get: owned stories: [empty] or [owned]
  // dashboard get: followed stories [empty] or [followed]

  // ownedStories: ['ownedId1', 'ownedId2'],
  // followedStories: ['followedId1', 'followedId2'],

  // [{type: Schema.Types.ObjectId, ref: 'story'}]
  // {type: Schema.Types.ObjectId, ref: 'story'}

// });
