'use strict';

const debug = require('debug')('narratus:user-controller');
const Promise = require('bluebird');
const createError = require('http-errors');
const User = require('../models/user');

module.exports = exports = {};

exports.createAccount = function(user, password) {
  debug('#createAccount');
  if(!user.username) return Promise.reject(createError(400, 'username required'));
  if(!password) return Promise.reject(createError(400, 'password required'));
  if(!user.email) return Promise.reject(createError(400, 'email required'));

  let newUser = new User(user);
  return newUser.generatePasswordHash(password)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => token)
  .catch(err => Promise.reject(createError(400, 'Bad request')));
};

exports.fetchAccount = function(checkUser) {
  debug('#fetchAccount');
  return User.findOne({username: checkUser.username})
  .then(user => user.comparePasswordHash(checkUser.password))
  .then(user => user.generateToken())
  .then(token => token)
  .catch(err => Promise.reject(createError(401, 'Not authorized')));
};
