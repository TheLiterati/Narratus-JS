'use strict';

require('dotenv').load();

const express = require('express');
const cors = require('cors');
const Promise = require('bluebird');
const errorHandler = require('./lib/error-middleware');
const bodyParser = require('body-parser').json();
const mongoose = require('mongoose');

const userRoutes = require('./routes/user-routes');
const storyRoutes = require('./routes/story-routes');
const snippetRoutes = require('./routes/snippet-routes');


const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/narratus-dev';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(bodyParser);
app.use(errorHandler);
app.use(cors());

app.use('/api', userRoutes(router));
app.use('/api', storyRoutes(router));
app.use('/api', snippetRoutes(router));

app.listen(PORT, function(){
  console.log('Listening on port', PORT);
});
