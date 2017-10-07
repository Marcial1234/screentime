var morgan = require('morgan');
var express = require('express');
var routes  = require('./routes.js');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');

module.exports.init = function() {
  // Connect to database
  // mongoose.connect(process.env.MLAB_DB);

  // initialize app
  var app = express();

  // enable request logging for development debugging
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());

  // views is directory for all template files
  app.set('views', __dirname + '/../client');
  app.set('view engine', 'ejs');

  // serve static files
  // app.use('/client', express.static(__dirname + '/../client'));
  app.use('/', express.static(__dirname + '/../client'));

  // use the listings router for requests to the api
  app.use('/api', routes);

  app.all('/loophole', function(req, res) {
    res.render('investment');
  });

  // go to homepage for all routes not specified
  app.all('/*', function(req, res) {
    res.render('index');
  });

  return app;
};