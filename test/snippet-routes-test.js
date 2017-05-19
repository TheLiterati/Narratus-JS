'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');
const Story = require('../models/story');
// const Snippet = require('../models/snippet');

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
const exampleStory = {
  title: 'The way we built Narratus',
  description: 'Project week - midterm project for JS backend and final project for iOS',
  startSnippet: 'There were seven of us assigned to a team. And then the murders began',
};
const exampleSnippet = {
  snippetContent: 'And then the story continued with a user submitted snippet',
};

// SNIPPET TESTS

describe('Snippet routes', function () {

  // Setup and teardown
  // beforeEach(done => {
  //   new User(exampleUser)
  //   .generatePasswordHash(exampleUser.password)
  //   .then(user => user.save())
  //   .then(user => {
  //     this.tempUser = user;
  //     return user.generateToken();
  //   })
  //   .then(token => {
  //     this.tempToken = token;
  //     done();
  //   })
  //   .catch(() => done());
  // });
  // beforeEach(done => {
  //   exampleStory.userId = this.tempUser._id.toString();
  //   new Story(exampleStory).save()
  //   .then(story => {
  //     this.tempStory = story;
  //     done();
  //   })
  //   .catch(() => done());
  // });
  // afterEach(() => delete exampleStory.userId);
  // afterEach(done => {
  //   Promise.all([
  //     User.remove({}),
  //     Story.remove({}),
  //   ])
  //   .then(() => done())
  //   .catch(() => done());
  // });

  // POST: for snippet tests: 200, 400, 401, 404
  describe('POST /api/snippet/:storyId', function() {

    // 200 (proper request with valid body, returns a body)
    describe('proper request TBD', function(){
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/snippet/:storyId`)
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
        request.post(`${url}/api/snippet/:storyId`)
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
        request.post(`${url}/api/snippet/:storyId`)
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
        request.post(`${url}/api/snippet/:storyId`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  // End
  });
  // ### PREVIOUS 5/16 ###
  describe('POST /api/snippet/:storyId', function() {
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

    describe('a proper request with a valid body', () => {

      it('should return a snippet and 200 response', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          let date = new Date(res.body.created).toString();
          expect(res.body.snippetContent).to.equal('And then the story continued with a user submitted snippet');
          expect(res.body.pending).to.equal(true);
          expect(res.body.userId[0]).to.equal(`${this.tempUser._id}`);
          expect(date).to.not.equal('Invalid Date');
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
    describe('a request with an invalid token', () => {
      it('should respond with a 401 unauthorized error', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: 'Bad token'})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('a request with an invalid story ID', () => {
      it('should respond with a 404 error not found', done => {
        request.post(`${url}/api/snippet/story1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('a bad request with an invalid body', () => {
      it('should respond with a 400 invalid body error', done => {
        request.post(`${url}/api/snippet/what`)
        .send({})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });
// End
//
  describe('POST /api/approve/:storyId', function() {
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

    describe('a proper request with a valid body', () => {
      it('should return a 200 response', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          let date = new Date(res.body.created).toString();
          expect(res.body.snippetContent).to.equal('And then the story continued with a user submitted snippet');
          expect(res.body.pending).to.equal(true);
          expect(res.body.userId[0]).to.equal(`${this.tempUser._id}`);
          expect(date).to.not.equal('Invalid Date');
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('a request with an invalid token', () => {
      it('should respond with a 401 unauthorized error', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: 'Bad token'})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('a request with an invalid story ID', () => {
      it('should respond with a 404 error not found', done => {
        request.post(`${url}/api/snippet/story1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('a bad request with an invalid body', () => {
      it('should respond with a 400 invalid body error', done => {
        request.post(`${url}/api/snippet/what`)
        .send()
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('an approved snippet', () => {
      it('should push the approved snippet to the snippet array', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .send(exampleSnippet)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.body.exampleSnippet.snippet[0].snippetContent).to.equal(exampleSnippet.snippetContent);
          done();
        });
      });
    });
  });

}); //end snippet routes test



describe('Snippet integration tests', () => {

  describe('POST :/api/snippet/:storyId', () => {

  }); //end post :/api/snippit/:storyId test




}); //end snippet integration test
