'use strict';

const debug = require('debug')('narratus:snippet-controller.js');
const Promise = require('bluebird');
const createError = require('http-errors');
const Snippet = require('../models/snippet.js');
const storyController = require('../controllers/story-controller.js');
const Story = require('../models/story.js');

module.exports = exports = {};

exports.createSnippet = function(storyId, snippet){
  debug('#createSnippet');
  console.log('Snippet Body: \n', snippet);
  return Story.findById(storyId)
  .then(story => {
    new Snippet(snippet).save()
    .then(newSnippet => {
      if (story.pendingSnippetCount < 10) {
        story.pendingSnippets.push(newSnippet);
        story.pendingSnippetCount +=1;
        story.save()
        .then(() => newSnippet)
        .catch(err => Promise.reject(createError(400, err.message)));

      }
    })
    .then(newSnippet => Promise.resolve(newSnippet))
    .catch(err => Promise.reject(err));
  });
};

exports.approveSnippet = function(storyId, snippet){
  debug('#createSnippet');
  console.log('Snippet Body: \n', snippet);


  return Story.findById(storyId)
  .then(story => {
    return new Snippet(snippet).save()
    .then(newSnippet => {
      story.snippets.push(newSnippet);
      story.snippetCount +=1;
      story.pendingSnippets = [];
      story.pendingSnippetCount = 0;
      story.save()
      .then(() => Promise.resolve(newSnippet))
      .catch(err => Promise.reject(createError(400, err.message)));
    })
    .then(newSnippet => Promise.resolve(newSnippet))
    .catch(err => Promise.reject(createError(400, err.message)));
  })
  .catch(err => Promise.reject(createError(404, err.message)));

};