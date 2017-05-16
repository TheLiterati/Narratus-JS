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

  // return storyController.fetchStory(storyId)
  return Story.findById(storyId)
  // .then(story => {
  //   console.log('The Story we\'re targeting: \n', story);
  //   console.log('Our Story\'s Snippets: \n', story.snippets);
  //   // return Promise.resolve(story);
  // })
  .then(story => {
    console.log('StoryId.snippets: \n', story.pendingSnippets);
    return new Snippet(snippet).save()
    .then(newSnippet => {
      console.log('Pre-pushed snippet: \n', newSnippet);
      story.pendingSnippets.push(newSnippet);
      story.save();
      console.log('Story\'s snippet array: \n', story.pendingSnippets);
      return newSnippet;
    })
    .then(newSnippet => Promise.resolve(newSnippet))
    .catch(err => Promise.reject(err));
  });
};
