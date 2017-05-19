'use strict';

const snippetController = require('../controllers/snippet-controller.js');
// const Promise = require('bluebird');
const debug = require('debug')('narratus:snippet-routes.js');
// const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

module.exports = function(router){

  // these routes should be structured something like `/story/:storyId/snippet`
  router.post('/snippet/:storyId', bearerAuth, (req, res) => {
    debug('#POST /snippet/:storyId');

    req.body.userId = req.user._id;

    snippetController.createSnippet(req.params.storyId, req.body)
    .then(snippet => res.json(snippet))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.post('/snippet/approve/:storyId', bearerAuth, (req, res) => {
    debug('#POST /snippet/approve/:storyId');
    req.body.userId = req.user._id;
    snippetController.approveSnippet(req.params.storyId, req.body)
    .then(snippet => {
      // console.log(req.body.snippetContent);
      // console.log('this is our snippet on heroin:', req.body.snippetContent);
      // console.log(JSON.stringify(snippet.snippetContent));
      res.json(snippet);
    })
    .catch(err => res.status(404).send(err.message));
  });
  return router;
};
