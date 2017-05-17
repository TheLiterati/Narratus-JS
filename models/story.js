'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = Schema({
  userId: [{type: Schema.Types.ObjectId, required: true, ref: 'user'}],
  title: {type: String, required: true},
  description: {type: String, required: true},
  startSnippet: {type: String, required: true},
  created: {type: Date, default: Date.now, required: true},
  genre: {type: String, default: 'Fiction', require: true},
  open: {type: Boolean, default: true, required:true},
  lastUpdated: {type: Date}, //NOTE stretch
  snippets: [{type: Schema.Types.ObjectId, ref: 'snippet'}],
  snippetCount: {type: Number, default: 0},
  pendingSnippets: [{type: Schema.Types.ObjectId, ref: 'snippet'}],
  pendingSnippetCount: {type: Number, default: 0},
});

module.exports = mongoose.model('story', storySchema);
