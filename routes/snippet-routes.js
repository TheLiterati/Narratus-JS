'use strict';

const snippetController = require('../controllers/snippet-controller.js');
const debug = require('debug')('narratus:snippet-routes.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

module.exports = function(router){
  // these routes should be structured something like `/story/:storyId/snippet`
  router.post('/snippet/:storyId', bearerAuth, (req, res) => {
    debug('#POST /snippet/:storyId');
    req.body.userId = req.user._id;
    console.log('UserId:', req.body.userId);
    console.log('StoryId:', req.params.storyId);
    snippetController.createSnippet(req.params.storyId, req.body)
    .then(snippet => {
      console.log(snippet);
      res.json(snippet);
    })
    .catch(err => res.status(err.status).send(err.message));
  });

  //approving snippets and pushing them to the array of approved snippets
  router.post('/snippet/approve/:storyId', bearerAuth, (req, res) => {
    debug('#POST /snippet/:storyId');
    req.body.userId = req.user._id;
    console.log('UserId:', req.body.userId);
    console.log('StoryId:', req.params.storyId);
    snippetController.approveSnippet(req.params.storyId, req.body)
    .then(snippet => {
      console.log(snippet);
      res.json(snippet);
    })
    .catch(err => res.status(404).send(err.message));
  });

  return router;
};
