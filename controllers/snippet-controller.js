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
  // console.log('Snippet Body: \n', snippet);
  if (!snippet) return Promise.reject(createError(400, 'Snippet required'));

  return Story.findById(storyId)
  .then(story => {
    // console.log('StoryId.snippets: \n', story.pendingSnippets);
    return new Snippet(snippet).save()
    .then(newSnippet => {
      if (story.pendingSnippetCount < 10) {
        story.pendingSnippets.push(newSnippet);
        story.pendingSnippetCount++;
        console.log('pending count in if conditional', story.pendingSnippetCount);
        story.save();
        return newSnippet;
      }
      console.log('Snippet Limit of 10 is reached');
    })
    .then(newSnippet => Promise.resolve(newSnippet))
    .catch(err => Promise.reject(createError(400, err.message)));
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};

exports.approveSnippet = function(storyId, snippet){
  debug('#approveSnippet');
  // console.log('Snippet Body: \n', snippet);
  return Story.findById(storyId)
  .then(story => {
    // console.log('StoryId.snippets: \n', story.snippets);
    return new Snippet(snippet).save()
    .then(approvedSnippet => {
      // console.log('Pre-pushed snippet: \n', approvedSnippet);
      story.snippets.push(approvedSnippet);
      story.snippetCount += 1;
      story.pendingSnippets = [];
      story.save();
      // console.log('Story\'s snippet array: \n', story.snippets);
      return approvedSnippet;
    })
    .then(approvedSnippet => Promise.resolve(approvedSnippet))
    .catch(err => Promise.reject(err));
  });
};

// return new Snippet ={
//
// }

// return Story.findById(storyId)
// .then(story => {
//   console.log('Whole Story object: \n', story);
//   console.log('Whole pendingsnippet array: \n', story.pendingSnippets);
//   for (var i = 0; i < snippetArray.length; i++) {
//
//     if(snippetArray[i].accepted === true){
//       story.snippets.push(snippetArray[i]);
//       console.log('New array of accepted snippets: \n', story.snippets);
//       story.save();
//       // story.pendingSnippets = [];
//     }
//   }
//
// })
// .then(story => {
//   console.log('Is dis da story?', story);
//   Promise.resolve(story);
// })
// .catch(err => Promise.reject(err));
