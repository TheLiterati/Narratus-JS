'use strict';

const snippetController = require('../controllers/snippet-controller.js');
const debug = require('debug')('narratus:snippet-routes.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

module.exports = function(router){

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

  return router;
};
