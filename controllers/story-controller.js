'use strict';

const debug = require('debug')('narratus:story-controller');
const Promise = require('bluebird');
const createError = require('http-errors');
const Story = require('../models/story.js');
const User = require('../models/user.js');

module.exports = exports = {};

exports.createStory = function(userId, story, snippet){
  debug('#createStory');
  return User.findOne(userId)
  .then(user => {

    return new Story(story).save()

    .then(newStory => {
      user.ownedStories.push(newStory);
      return user.save()
      .then(() => newStory)
      .catch(err => Promise.reject(createError(400, err.message)));

    })
    .then(newStory => newStory)
    .catch(err => Promise.reject(createError(400, err.message)));
  });
};

exports.fetchStories = function() {
  debug('#fetchAll');
  // console.log();
  return Story.find()
  .then(story => {
    return Promise.resolve(story);
  })
  .catch(() => Promise.reject(createError(404, 'Stories not found')));
};

exports.fetchStory = function(id) {
  debug('#fetchStory');

  return Story.findById({'_id':id}).populate('snippets')
  .then(story => {
    return Promise.resolve(story);
  })
  .catch(() => Promise.reject(createError(404, 'Story not found')));
};
