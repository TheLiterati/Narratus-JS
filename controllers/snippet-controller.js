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
    new Snippet(snippet).save()
    .then(newSnippet => {
      console.log('Story.pendingSnippetCount', story.pendingSnippetCount);
      if (story.pendingSnippetCount < 10) {
        story.pendingSnippets.push(newSnippet);
        story.pendingSnippetCount +=1;
        // console.log('pending count in if conditional', story.pendingSnippetCount);
        story.save()
        .then(() => newSnippet)
        .catch(err => Promise.reject(createError(400, err.message)));
        // return newSnippet;
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

  console.log('snippet.snippetContent', snippet.snippetContent);
  console.log('snippet', snippet);

  return Story.findById(storyId)
  .then(story => {
    return new Snippet(snippet).save()
    .then(newSnippet => {
      // if (story.snippetCount < 10) {
        console.log('newSnippet', newSnippet);
        console.log('story.snippets IS THIS:', story.snippets);
        story.snippets.push(newSnippet);
        story.snippetCount +=1;
        story.pendingSnippets = [];
        story.pendingSnippetCount = 0;
        // console.log('pending count in if conditional', story.pendingSnippetCount);
        story.save()
        .then(() => Promise.resolve(newSnippet))
        .catch(err => Promise.reject(createError(400, err.message)));

    })
    .then(newSnippet => Promise.resolve(newSnippet))
    .catch(err => Promise.reject(createError(400, err.message)));
  })
  .catch(err => Promise.reject(createError(404, err.message)));
  // return Story.findById(storyId)
  // .then(story => {
  //   return new Snippet(snippet.snippetContent).save()
  //   .then(approvedSnippet => {
  //     story.snippets.push(approvedSnippet.snippetContent);
  //     story.snippetCount += 1;
  //     story.pendingSnippets = [];
  //     story.save()
  //     .then(snippet => Promise.resolve(snippet))
  //     .catch(err => Promise.reject(createError(404, 'Cannot find Snippet')));
  //   })
  //   .then(approvedSnippet => Promise.resolve(approvedSnippet))
  //   .catch(err => Promise.reject(err));
  // });
};
