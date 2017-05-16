'use strict';

const debug = require('debug')('narratus:user-routes');
const basicAuth = require('../lib/basic-auth-middleware');
const User = require('../models/user');
const userController = require('../controllers/user-controller');

// Create user: email, username, password.
//POST /api/signup

module.exports = function(router) {
  router.post('/signup', (req, res) => {
    debug('POST /signup');

    let tempPassword = req.body.password;
    req.body.password = null;
    delete req.body.password;

    return userController.createUser(req.body, tempPassword)
    .then(token => {
      console.log('token', token);
      res.json(token);
    })
    .catch(err => res.status(err.status).send(err));
  });

  // User login: username, password.
  //GET /api/signin

  router.get('/signin', basicAuth, (req, res) => {
    debug('GET /signin');

    return User.findOne({username: req.auth.username})
    .then(user => user.comparePasswordHash(req.auth.password))
    .then(user => user.generateToken())
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err));
  });

  // router.get('/dashboard', (req, res) => {
  //   debug('GET /dashboard');
  //
  //   return User.find({username: req.followedStories});
  // });
  return router;
};

//GET /api/dashboard
// fetch all of the user's followed and owned stories.

//PUT /api/follow/:storyId
// follow a story that you are not contributing to.
