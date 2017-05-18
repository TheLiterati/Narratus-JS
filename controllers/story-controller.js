'use strict';

const debug = require('debug')('narratus:story-controller');
const Promise = require('bluebird');
const createError = require('http-errors');
const Story = require('../models/story.js');

module.exports = exports = {};

exports.createStory = function(story) {
  debug('#createStory');
  if(!story) return Promise.reject(createError(400, 'No story included.'));

  return new Story(story).save()
  .then(story => story)
  .catch(() => Promise.reject(createError(400, 'You done goofed up the submission')));
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

  return Story.findOne(id)
  .then(story => {
    return Promise.resolve(story);
  })
  .catch(() => Promise.reject(createError(404, 'Story not found')));
};

exports.updateStory = function(req) {  //NOTE: stretch
  if(!req.params.id) return Promise.reject(createError(400, 'Story ID required'));

  if(!req.body.title || !req.body.description || !req.body.startSnippet) return Promise.reject(createError(400, 'Title, description, and starting snippet are required'));

  return Story.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(story => Promise.resolve(story))
  .catch(() => Promise.reject(createError(404, 'Story not found')));
};

exports.deleteStory = function(storyId) {
  debug('#deleteStory');

  console.log(storyId);

  return Story.findByIdAndRemove(storyId)
  .then(story => Promise.resolve(story))
  .catch(err => Promise.reject(createError(404, 'Story  not found')));
};
