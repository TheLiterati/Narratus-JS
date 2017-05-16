'use strict';

const snippetController = require('../controllers/snippet-controller.js');
const debug = require('debug')('narratus:snippet-routes.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

module.exports = function(router){
  router.post('/snippet', bearerAuth, (req, res) => {
    debug('#POST /snippet');

    snippetController.createSnippet(req.body)
    .then(snippet => {
      console.log(snippet);
      res.json(snippet);
    })
    .catch(err => res.status(err.status).send(err.message));
  });

  return router;
};
