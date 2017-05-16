'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');
const Story = require('../models/story');

mongoose.Promise = Promise;
require('../server');
const url = `htt'://localhost:${process.env.PORT}`;

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

describe('Story routes', function() {
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
  
  
  describe('POST /api/story', function() {});
  
  describe('GET /api/story', function() {});
  
  describe('GET /api/story/:storyId', function() {});
  
  describe('PUT /api/story/:storyId', function() {});
  
  describe('DELETE /api/story/:storyId', function() {});
});