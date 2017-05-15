'use strict';

const debug = require('debug')('narratus:story-controller');
const Promise = require('bluebird');
const createError = require('http-errors');
const Story = require('../models/story.js');

module.exports = exports = {};

exports.createStory = function(req) {
  debug('#createStory');
  if(!req.body.title) return Promise.reject(createError(400, 'Invalid title'));
  if(!req.body.description) return Promise.reject(createError(400, 'Invalid description'));
  if(!req.body.startSnippet) return Promise.reject(createError(400, 'Invalid start snippet'));
  req.body.userId = req.user._id;

  return new Story(req.body).save()
  .then(story => story)
  .catch(err => Promise.reject(createError(400, err.message)));
};

exports.fetchAll = function(req) {
  debug('#fetchAll');
  
  return Story.find()
  .then(story => {
    return Promise.resolve(story);
  })
  .catch(() => Promise.reject(createError(404, 'Stories not found')));
};

exports.fetchStory = function(id) {
  debug('#fetchStory');
  
  return Story.findById(id)
  .then(story => {
    return Promise.resolve(story);
  })
  .catch(() => Promise.reject(createError(404, 'Story not found')));
};

exports.updateStory = function(req) {  //NOTE: stretch
  if(!req.params.id) return Promise.reject(createError(400, 'Story ID required'));
  
  if(!req.body.title || !req.body.description || !req.body.startSnippet) return Promise.reject(createError(400, 'Title, description, and starting snippet are required'));
  
  return Story.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(story => return Promise.resolve(story))
  .catch(() => Promise.reject(createError(404, 'Story not found')));
};

exports.deleteStory = function(id) {
  debug('#deleteStory');
  
  return Story.findByIdAndRemove(id)
  .then(story => Promise.resolve(story))
  .catch(() => Promise.reject(createError(404, 'Story  not found')));
};