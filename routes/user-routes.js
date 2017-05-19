'use strict';

const debug = require('debug')('narratus:user-routes');
const basicAuth = require('../lib/basic-auth-middleware');
const bearerAuth = require('../lib/bearer-auth-middleware');
const userController = require('../controllers/user-controller');

module.exports = function(router) {

  router.post('/signup', (req, res) => {
    debug('#POST /signup');

    let tempPassword = req.body.password;
    req.body.password = null;
    delete req.body.password;

    userController.createAccount(req.body, tempPassword)
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err.mesage));
  });

  router.get('/signin', basicAuth, (req, res) => {
    debug('#GET /signin');

    userController.fetchAccount(req.auth, req.body)
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/dashboard', bearerAuth, (req, res) => {
    debug('#GET /dashboard');

    let dashboardStories = {};
    
    userController.populateOwnedStories(req.user._id)
    .then(ownedStories => dashboardStories.ownedStories = ownedStories.ownedStories)
    .then(()=> {
      return userController.populateFollowedStories(req.user._id)
      .then(followedStories => {
        dashboardStories.followedStories = followedStories.followedStories;
        res.json(dashboardStories);
      })
      .catch(err => res.status(err.status).send(err.message));
    })
    .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/follow/story/:storyId', bearerAuth, (req, res) => {
    debug('#PUT /follow/:storyId');

    userController.addToFollowed(req.user._id, req.params.storyId)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/logout/:userId', bearerAuth, (req, res) => {
    debug('#PUT /logout');

    userController.logout(req.params.userId)
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err.message));
  });

  return router;
};
