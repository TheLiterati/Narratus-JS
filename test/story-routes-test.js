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

const exampleUser = {
  username: 'Christina',
  password: 'iamawesome',
  email: 'hi@hello.what',
};
// const exampleStory = {
//   title: 'The way we built Narratus',
//   description: 'Project week - midterm project for JS backend and final project for iOS',
//   startSnippet: 'There were seven of us assigned to a team. And then the murders began',
// };

// *** STORY TESTS ***

describe('Story routes', function() {

  // Setup and teardown
  beforeEach(done => {
    new User(exampleUser)
    .generatePasswordHash(exampleUser.password)
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
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Story.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  // POST: for story tests: 200, 400, 401
  describe('POST: /api/story', function(){

    // 200 (proper request with valid body, returns a body)
    describe('proper request TBD', function(){
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
    describe('bad request TBD', function(){
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
    describe('unauthorized TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

  });

  // GET: for story tests: 200, 401, 404
  describe('GET: /api/story', function(){

    // 200 (proper request with valid body, returns a token)
    describe('proper request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    // 401 (unauthorized with invalid username/password)
    describe('unauthorized TBD', function(){
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
    describe('bad request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  // TODO: Story GET: /api/story/:storyId

  // PUT: for story tests: 200, 400, 401, 404
  describe('PUT: /api/story', function(){

    // 200 (proper request with valid body, returns a body)
    describe('proper request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/story/:storyId`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    // 400 (bad request with invalid body)
    describe('bad request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api//:storyId`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    // 401 (unauthorized with invalid username/password)
    describe('unauthorized TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/story/:storyId`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    // 404 (bad request, not found)
    describe('bad request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/story/:storyId`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

  });

  // DELETE: for story tests: 204
  describe('DELETE: /api/story', function(){

    // 204 (no content)
    describe('no content TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/story`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
// End
});









// ### PREVIOUS 5/16 ###

//   describe('Unregistered route', function() {
//     it('should respond with a status of 404 not found', done => {
//
//
//       done();
//     });
//   });
//
//   describe('POST /api/story', function() {
//     describe('Request with a valid body', function() {
//       it('should return a story', done => {
//
//         done();
//       });
//     });
//
//     describe('Request with an invalid token', function() {
//       it('should respond with a 401 unauthorized error', done => {
//
//         done();
//       });
//     });
//
//     describe('Request with an invalid body', function() {
//       it('should respond with a 400 invalid body error', done => {
//
//         done();
//       });
//     });
//   });
//
//   describe('GET /api/story', function() {
//     beforeEach(done => {
//       exampleStory.userId = this.tempUser._id.toString();
//       new Story(exampleStory).save()
//       .then(story => {
//         this.tempStory = story;
//         done();
//       })
//       .catch(() => done());
//     });
//
//     afterEach(() => delete exampleStory.userId);
//
//     describe('Request with a valid body', function() {
//       it('should return a story', done => {
//
//         done();
//       });
//     });
//
//     describe('Request with invalid token', function() {
//       it('should respond with a 401 unauthorized error', done => {
//
//
//         done();
//       });
//     });
//
//     describe('Request with invalid id', function() {
//       it('should respond with a 404 not found error', done => {
//
//         done();
//       });
//     });
//   });
//
//   describe('GET /api/story/:storyId', function() {
//     beforeEach(done => {
//       exampleStory.userId = this.tempUser._id.toString();
//       new Story(exampleStory).save()
//       .then(story => {
//         this.tempStory = story;
//         done();
//       })
//       .catch(() => done());
//     });
//
//     afterEach(() => delete exampleStory.userId);
//
//     describe('Request with a valid body', function() {
//       it('should return a story', done => {
//
//         done();
//       });
//     });
//
//     describe('Request with invalid token', function() {
//       it('should respond with a 401 unauthorized error', done => {
//
//
//         done();
//       });
//     });
//
//     describe('Request with invalid id', function() {
//       it('should respond with a 404 not found error', done => {
//
//         done();
//       });
//     });
//   });
//
//   describe('PUT /api/story/:storyId', function() {
//     let updatedStory = {
//       title: 'Did we survive project week?',
//       description: 'A reflection on how the week went',
//       startSnippet: 'We are not sure yet, check back on Friday!',
//     };
//
//     beforeEach(done => {
//       exampleStory.userId = this.tempUser._id.toString();
//       new Story(exampleStory).save()
//       .then(story => {
//         this.tempStory = story;
//         done();
//       });
//     });
//
//     afterEach(() => delete exampleStory.userId);
//
//     describe('A request with a valid body', function() {
//       it('should return an updated story', done => {
//
//         done();
//       });
//     });
//
//     describe('A request with an unauthorized token', function() {
//       it('should return an error of 401 unauthorized', done => {
//
//         done();
//       });
//     });
//
//     describe('A request with an invalid body', function() {
//       it('should return an error of 400 invalid body', done => {
//
//         done();
//       });
//     });
//
//     describe('A request with an invalid id', function() {
//       it('should return an error of 404 not found', done => {
//
//         done();
//       });
//     });
//   });
//
//   describe('DELETE /api/story/:storyId', function() {
//     beforeEach(done => {
//       exampleStory.userId = this.tempUser._id.toString();
//       new Story(exampleStory).save()
//       .then(story => {
//         this.tempStory = story;
//         done();
//       });
//     });
//
//     afterEach(() => delete exampleStory.userId);
//
//     it('should remove the story and return a status of 204', done => {
//
//       done();
//     });
//   });
// });
