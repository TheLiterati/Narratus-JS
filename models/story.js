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
  lastUpdated: {type: Date}, //NOTE stretch
  open: {type: Boolean, default: true},
  snippets: [{type: Schema.Types.ObjectId, ref: 'snippet'}],
  snippetCount: {type: Number, default: 0},
  pendingSnippets: [{type: Schema.Types.ObjectId, ref: 'snippet'}],
  pendingSnippetCount: {type: Number, default: 0},
});

storySchema.methods.addStartSnippet = function(snippet) {
  debug('#addStartSnippet');

  return new Promise((resolve, reject) => {
    if(!snippet) return Promise.reject(createError(401, 'Story push failed'));
    let newSnippet = new Snippet();
    console.log('newSnippet', newSnippet);
    newSnippet.snippetContent = snippet;
    newSnippet.save();
    this.snippets.push(newSnippet);
    resolve(this);
  });
};

module.exports = mongoose.model('story', storySchema);
