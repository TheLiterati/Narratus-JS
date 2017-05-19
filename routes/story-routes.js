'use strict';

const debug = require('debug')('narratus:story-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const createError = require('http-errors');
const storyController = require('../controllers/story-controller.js');

module.exports = function(router) {
  router.post('/story', bearerAuth, (req, res) => {
    debug('#POST /api/story');

    req.body.userId = req.user._id;
    return storyController.createStory(req.params.userId, req.body, req.body.startSnippet)
    .then(story => {
      console.log(story);
      res.json(story);
    })
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/story', (req, res) => {
    debug('#GET /api/story');
    storyController.fetchStories(req)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/story/:storyId', (req, res) => {
    debug('#GET /api/story/:storyId');
    storyController.fetchStory(req.params.storyId)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/story/:storyId', bearerAuth, (req, res) => {  //NOTE: stretch
    debug('#PUT /api/story/:storyId');
    storyController.updateStory(req)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.delete('/story/:storyId', bearerAuth, (req, res) => {
    debug('#DELETE /api/story/:storyId');
    storyController.deleteStory(req.params.storyId, req.user._id)
    .then(err => res.status(204).send(err.message))
    .catch(err => res.status(err.status).send(err.message));
  });

  return router;
};
