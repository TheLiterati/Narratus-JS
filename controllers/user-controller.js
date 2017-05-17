'use strict';

const debug = require('debug')('narratus:user-controller');
const Promise = require('bluebird');
const createError = require('http-errors');
const User = require('../models/user.js');
const Story = require('../models/story.js');

module.exports = exports = {};

exports.createAccount = function(user, password) {
  debug('#createAccount');
  if(!user.username) return Promise.reject(createError(400, 'username required'));
  if(!password) return Promise.reject(createError(400, 'password required'));
  if(!user.email) return Promise.reject(createError(400, 'email required'));

  let newUser = new User(user);
  return newUser.generatePasswordHash(password)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => token)
  .catch(() => Promise.reject(createError(400, 'Bad request')));
};

exports.fetchAccount = function(checkUser) {
  debug('#fetchAccount');
  return User.findOne({username: checkUser.username})
  .then(user => user.comparePasswordHash(checkUser.password))
  .then(user => user.generateToken())
  .then(token => token)
  .catch(() => Promise.reject(createError(401, 'Not authorized')));
  
};

exports.addToFollowed = function(userId, storyId) {
  debug('#addToFollowed');
  
  if(!userId) return Promise.reject(createError(400, 'Story ID required'));
  if(!storyId) return Promise.reject(createError(400, 'Story ID required'));
  
  return User.findOne(userId)
  .then(user => {
    return Story.findOne(storyId)
    .then(() => user.followedStories.push(storyId))
    .catch(() => Promise.reject(createError(400, 'Bad request')));
  });
};

