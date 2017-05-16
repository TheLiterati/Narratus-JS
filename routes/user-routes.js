'use strict';

const debug = require('debug')('narratus:user-routes');
const basicAuth = require('../lib/basic-auth-middleware');
const authController = require('../controllers/user-controller');

module.exports = function(router) {

  router.post('/signup', (req, res) => {
    debug('#POST /signup');

    let tempPassword = req.body.password;
    req.body.password = null;
    delete req.body.password;

    authController.createAccount(req.body, tempPassword)
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err.mesage));
  });

  router.get('/signin', basicAuth, (req, res) => {
    debug('GET /signin');

    authController.fetchAccount(req.auth)
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err.message));
  });
  
  router.get('/dashboard', basicAuth, (req, res) => {
    debug('GET /dashboard');
    
    authController.fetchDashboard()
    .then()
    .catch();
  });
  
  router.put('/follow/:userId/story/:storyId', basicAuth, (req, res) => {
    debug('PUT /follow/:storyId');
    
    authController.addToFollowed(req.params.userId, req.params.storyId)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });
  
  return router;
};
