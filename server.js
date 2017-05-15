'use strict';

const express = require('express');
const userRoutes = require('./routes/user-routes');

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use('/api', userRoutes(router));

app.listen(port, function(){
  console.log('Listening on port', port);
});
