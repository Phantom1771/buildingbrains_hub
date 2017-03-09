
const debug = require('debug')('[LOG]');
const winston = require('winston');
var express = require('express');
var request = require('request');
var app = express();
app.config = require('./config/config');

// start socket io
function sioConnect(context) {
  winston.log('info', 'Enable IO');
  winston.log('info', 'screte', context.config.hardware.secretekey);
  if(context.io == undefined) {
    var url = app.config.getiosUrl();
    context.io = require('socket.io-client')(url, {
      'reconnection': false,
      //'reconnectionAttempts': 3,
      query: context.config.hardware
    });
  }
  var io = app.io;
  // Handle initiation
  // emit 'initial' and hardware info
  io.on('connect', function(data){
    winston.log('info', 'Created connection', data);
    context.config.waitfactor = 1;
  });

  io.on('connect_error', function() {
    winston.log('info', 'connect_error');
    context.config.timetowait = context.config.timeout*context.config.waitfactor;
    if(context.config.waitfactor <= 20)
      context.config.waitfactor += 1;
    var baseUrl = context.config.getLoUrl();
    request.get(baseUrl + '/connect');
  });

  // Handle all requestes from server
  // GET, POST, PUT ...
  io.on('request', function(data){
    winston.log('info', 'Received request', data);
  });

  // handle notification
  // e.g. timeout
  io.on('notification', function(data) {
    winston.log('info', 'Got notificaiton', data);
  });



  // disconnected by server
  io.on('disconnect', function(){
    winston.log('info', 'disconnection');
    context.config.timetowait = context.config.timeout;
    var baseUrl = context.config.getLoUrl();
    request.get(baseUrl + '/disconnected');
  });
}

// app routines

// server disconnected
app.get('/disconnected', function(req, res) {
  res.end();
  setTimeout(function() {
    app.io.connect();
  }, app.config.timetowait);
});

app.get('/connect', function(req, res){
  res.end();
  setTimeout(function() {
    app.io.connect();
  }, app.config.timetowait);
});

app.get('/reboot', function(req, res){
  winston.log('info', 'Invalid');
});

app.listen(app.config.port, function() {
  winston.log('info', 'Hardware info', app.config.hardware);
  winston.log('info', 'Server info', app.config.server);
  winston.log('info', 'Server info', app.config.sioserver);
  winston.log('info', 'Loopback', app.base_url+":" + app.port);
  winston.log('info', 'Building Brains Service starts');
  sioConnect(app);
});
