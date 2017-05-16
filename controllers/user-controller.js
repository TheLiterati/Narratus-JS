'use strict';

const debug = require('morgan');
const createError = require('http-errors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.Promise = Promise;

module.exports = exports = {};

exports.createUser = function(user, password) {
  debug('#createUser');
  if(!user) return Promise.reject(createError(400, 'No user, user required.'));

  let newUser = new User(user);

  return newUser.generatePasswordHash(password)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => Promise.resolve(token))
  .catch(err => Promise.reject(err.status).send(err));
};
