'use strict';

const debug = require('debug')('narratus:story-controller');
const Promise = require('bluebird');
const createError = require('http-errors');
const Story = require('../models/story.js');

module.exports = exports = {};

exports.createStory = function(story) {
  debug('#createStory');
  // if(!req.body.title) return Promise.reject(createError(400, 'Invalid title'));
  // if(!req.body.description) return Promise.reject(createError(400, 'Invalid description'));
  // if(!req.body.startSnippet) return Promise.reject(createError(400, 'Invalid start snippet'));

  // const newStory = new Story(story);
  // console.log(newStory);
  // // newStory.save()
  // return newStory.save()
  // .then(story => {
  //   console.log('Resolution', story);
  //   Promise.resolve(story);
  // })
  // .catch(err => Promise.reject(createError(400, err.message)));

  return new Story(story).save()
  .then(newStory => console.log('This is a story', newStory))
  .then(story => story)
  .catch(() => createError(400, 'You fucked up'));
};

exports.fetchAll = function(req) {
  debug('#fetchAll');
  console.log(req);
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
  .then(story => Promise.resolve(story))
  .catch(() => Promise.reject(createError(404, 'Story not found')));
};

exports.deleteStory = function(id) {
  debug('#deleteStory');

  return Story.findByIdAndRemove(id)
  .then(story => Promise.resolve(story))
  .catch(() => Promise.reject(createError(404, 'Story  not found')));
};
