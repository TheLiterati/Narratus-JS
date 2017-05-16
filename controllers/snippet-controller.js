'use strict';

const debug = require('debug')('narratus:snippet-controller.js');
const Promise = require('bluebird');
const createError = require('http-errors');
const Snippet = require('../models/snippet.js');

module.exports = exports = {};

exports.createSnippet = function(snippet){
  debug('#exports.createStory');
  if(!snippet) return Promise.reject(createError(404, 'No snippet required.'));
  snippet.userId = snippet.user._id;
  
  return new Snippet(snippet).save()
  .then(snippet => snippet)
  .catch(err => Promise.reject(createError(400, err.message)));
};
