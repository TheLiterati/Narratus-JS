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
      res.json(story);
    })
    .catch(() => res.send(createError(400, 'nope')));
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

  return router;
};
