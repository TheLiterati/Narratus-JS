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

exports.populateOwnedStories = function(userId){
  debug('#populateOwnedStories');

  return User.findById(userId).populate('ownedStories')
  .then(user => user)
  .catch(err => Promise.reject(createError(404, err.message)));
};

exports.populateFollowedStories = function(userId){
  debug('#populateFollowedStories');
  return User.findById(userId).populate('followedStories')
  .then(user => user)
  .catch(err => Promise.reject(createError(404, err.message)));
};

exports.populateApprovedSnippets = function(storyId){
  debug('#populateApprovedSnippets');
  return Story.findById(storyId).populate('snippets')
  .then(user => user)
  .catch(err => Promise.reject(createError(404, err.message)));
};

exports.populatePendingSnippets = function(storyId){
  debug('#populatePendingSnippets');

  return Story.findById(storyId).populate('pendingSnippets')
  .then(user => user)
  .catch(err => Promise.reject(createError(404, err.message)));
};

exports.populateEditStory = function(storyId){
  debug('#populateEditStory');
  return Story.findById(storyId)
  .then(() => Story.findById(storyId).populate('snippets pendingSnippets'))
  .then(story => story)
  .catch(err => Promise.reject(createError(404, err.message)));
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
