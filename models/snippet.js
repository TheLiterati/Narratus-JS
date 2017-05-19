'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = Schema({
  userId: [{type: Schema.Types.ObjectId, required: true, ref: 'user'}],
  snippetContent: {type: String, required: true},
  created: {type: Date, default: Date.now, required: true},
  pending: {type: Boolean, default: true},
  accepted: {type: Boolean},
  acceptedDate: {type: Date, default: Date.now}, //NOTE stretch
  lastViewDate: {type: Date, default: Date.now}, //NOTE stretch
  bookmark: {type: Boolean}, //NOTE stretch
});


module.exports = mongoose.model('snippet', snippetSchema);
