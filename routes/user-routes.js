'use strict';

// Create user: email, username, password.
//POST /api/signup

// Will change router.use to post.
module.exports = function(router) {
  router.use('/signup', (req, res, next) => {
    console.log('Signup middleware');
    next();
  });
  return router;
};

// app.use(function(req, res, next) {
//   console.log('First middleware');
//   next();
// });

// app.use('/signup', function(req, res, next) {
//   console.log('Signup middleware');
//   next();
// });

// User login: username, password.
//GET /api/signin

// app.use('/signin', function(req, res, next) {
//   console.log('Signin middleware');
//   next();
// });

//GET /api/dashboard
//PUT /api/follow/:storyId
