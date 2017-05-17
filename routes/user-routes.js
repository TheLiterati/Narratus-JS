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

    userController.fetchAccount(req.auth)
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/dashboard/:userId', bearerAuth, (req, res) => {
    debug('#GET /dashboard');

    // req.body.userId = req.user._id;

    return userController.populateOwnedStories(req.params.userId)
    .then(ownedStories => res.json(ownedStories))
    .then(()=> {
      return userController.populateFollowedStories(req.body.userId)
      .then(followedStories => res.json(followedStories))
      .catch(err => res.status(err.status).send(err.message));
    })
    .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/follow/:userId/story/:storyId', bearerAuth, (req, res) => {
    debug('#PUT /follow/:storyId');

    userController.addToFollowed(req.params.userId, req.params.storyId)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });


  return router;
};
