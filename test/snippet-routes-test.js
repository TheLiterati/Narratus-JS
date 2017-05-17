'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');
const Story = require('../models/story');
// const Snippet = require('../models/snippet');

mongoose.Promise = Promise;
require('../server');
const url = `http://localhost:${process.env.PORT}`;

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
  snippetContent: 'And then the storied continued with a user submitted snippet',
};


describe('Snippet Routes', function () {

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

  describe('POST /api/snippet/:storyId', () => {

    describe('Request with a valid body', () => {

      it.only('should return a snippet and 200 response', done => {

        // console.log('wahts the tempUser', this.tempUser);
        // console.log('wahts the tempToken', this.tempToken);
        // console.log('wahts the exampleStory.userId', exampleStory.userId);
        // console.log('whats the tempStory', this.tempStory);
        // console.log('wahts the te tempstoryID?', this.tempStory._id);

        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          console.log('bookmark', res.body.bookmark);
          let date = new Date(res.body.created).toString();
          expect(res.body.snippetContent).to.equal('And then the storied continued with a user submitted snippet');
          expect(res.body.pending).to.equal(true);
          expect(res.body.userId[0]).to.equal(`${this.tempUser._id}`);
          expect(date).to.not.equal('Invalid Date');
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('Request with an invalid token', function() {
      it('should respond with a 401 unauthorized error', done => {

        done();
      });
    });

    describe('Request with an invalid story ID', function() {
      it('should respond with a 404 error not found', done => {

        done();
      });
    });


    describe('Request with an invalid body', function() {
      it('should respond with a 400 invalid body error', done => {

        done();
      });
    });




  });



});
