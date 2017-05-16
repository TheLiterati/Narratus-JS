'use strict';

const debug = require('debug')('narratus:story-routes');
// const bodyParser = require('body-parser').json();
const storyController = require('../controllers/story-controller.js');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {
  router.post('/story', bearerAuth, (req, res) => {
    debug('#POST /api/story');

    req.body.userId = req.user._id;
    
    console.log('string req.user._id', req.user._id);
    console.log('string this req.userId', req.body.userId);

    console.log('give it a string', req.body);
    console.log('some sort of string in there, too', req.body.userId);

    return storyController.createStory(req.body)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/story', bearerAuth, (req, res) => {
    debug('#GET /api/story');
    storyController.fetchAll(req)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/story/:storyId', bearerAuth, (req, res) => {
    debug('#GET /api/story/:id');
    storyController.fetchStory(req.params.id)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/story/:storyId', bearerAuth, (req, res) => {  //NOTE: stretch
    debug('#PUT /story/:storyId');
    storyController.updateStory(req)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.delete('/story/:storyId', bearerAuth, (req, res) => {
    debug('#DELETE /story/:storyId');
    storyController.deleteStory(req.params.id)
    .then(err => res.status(204).send(err.message))
    .catch(err => res.status(err.status).send(err.message));
  });

  return router;
};
