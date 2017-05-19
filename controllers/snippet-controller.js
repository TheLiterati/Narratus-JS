'use strict';

const debug = require('debug')('narratus:snippet-controller.js');
const Promise = require('bluebird');
const createError = require('http-errors');
const Snippet = require('../models/snippet.js');
const Story = require('../models/story.js');

module.exports = exports = {};

exports.createSnippet = function(storyId, snippet){
  debug('#createSnippet');

  if (!snippet.snippetContent) return Promise.reject(createError(400, 'Snippet required'));
  if (!storyId) return Promise.reject(createError(400, 'Story Id required'));

  return Story.findById(storyId)
  .then(story => {
    return new Snippet(snippet).save()
    .then(newSnippet => {
      if (story.pendingSnippetCount < 10) {
        story.pendingSnippets.push(newSnippet);
        story.pendingSnippetCount++;
        story.save()
        .then(() => newSnippet)
        .catch(err => Promise.reject(createError(400, err.message)));
      }
    })
    .then(newSnippet => Promise.resolve(newSnippet))
    .catch(err => Promise.reject(createError(400, err.message)));
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};

exports.approveSnippet = function(storyId, snippet){
  debug('#approveSnippet');

  if (!snippet.snippetContent) return Promise.reject(createError(400, 'Snippet required'));
  if (!storyId) return Promise.reject(createError(400, 'Story Id required'));

  return Story.findById(storyId)
  .then(story => {

    return new Snippet(snippet).save()
    .then(approvedSnippet => {
      story.snippets.push(approvedSnippet);
      story.snippetCount += 1;
      story.pendingSnippets = [];
      story.save();
      return approvedSnippet;
    })
    .then(approvedSnippet => Promise.resolve(approvedSnippet))
    .catch(err => Promise.reject(err));
  });
};
