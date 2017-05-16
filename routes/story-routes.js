'use strict';

const debug = require('debug')('narratus:story-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const createError = require('http-errors');
const storyController = require('../controllers/story-controller.js');

module.exports = function(router) {
  router.post('/story', bearerAuth, (req, res) => {
    debug('#POST /api/story');

    req.body.userId = req.user._id;
    return storyController.createStory(req.body)
    .then(story => {
      console.log(req.body);
      res.json(story);
    })
    .catch(() => res.send(createError(400, 'fuck')));
  });

  router.get('/story/', bearerAuth, (req, res) => {
    debug('#GET /api/story');
    storyController.fetchStories(req)
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
    debug('#PUT /api/story/:storyId');
    storyController.updateStory(req)
    .then(story => res.json(story))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.delete('/story/:storyId', bearerAuth, (req, res) => {
    debug('#DELETE /api/story/:storyId');
    storyController.deleteStory(req.params.storyId, req.user._id)
    .then(story => {
      console.log('Deleted:\n', story);
      Promise.resolve(story);
    })
    .catch(err => res.status(err.status).send(err.message));
  });

  return router;
};
