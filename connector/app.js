
const debug = require('debug')('[LOG]');
const winston = require('winston');
var express = require('express');
var request = require('request');
var app = express();
app.config = require('./config/config');

// start socket io
function sioConnect(context, other) {
  winston.log('info', 'Enable IO');
  if(app.io == undefined)
    app.io = require('socket.io-client')('http://localhost:5000');
  var io = app.io;

  // Handle initiation
  // emit 'initial' and hardware info
  io.on('connect', function(data){
    winston.log('info', 'Created connection', data);
    io.emit('initial', context.config.hardware);
  });

  // Handle all request
  io.on('request', function(data){
    winston.log('info', 'Received request', data);
  });

  io.on('notification', function(data) {
    winston.log('info', 'Got notificaiton', data);
  });

  io.on('idle', function(){
    io.disconnect();
    winston.log('info', 'disconnection');
    var baseUrl = context.config.getUrl();
    request.get(baseUrl + '/idle');
  });

  io.on('disconnect', function(){
    io.disconnect();
    winston.log('info', 'disconnection');
    var baseUrl = context.config.getUrl();
    request.get(baseUrl + '/disconnected');
  });
}

app.get('/disconnected', function(req, res) {
  res.end();
  app.io.close();
  app.io = undefined;

  // Test Timeout
  // TODO: revemve this and enable timeout
  winston.log('info', 'Counting');
  var num = 0;
  var timer = setInterval(function() {
    console.log("%d", num);
    num += 5;
  }, 5000);

  setTimeout(function(){
    clearInterval(timer);
    sioConnect(app);
  }, app.config.timeout*10);
  //

  //setTimeout(sioConnect, app.config.timeout*10, app);

});

app.get('/idle', function(req, res){
  res.end();
  app.io.close();
  app.io = undefined;
  setTimeout(sioConnect, app.config.timeout*2, app);
});

app.get('/reboot', function(req, res){
  winston.log('info', 'Invalid');
});

app.listen(app.config.port, function() {
  winston.log('info', 'Hardware info', app.config.hardware);
  winston.log('info', 'Server info', app.config.server);
  winston.log('info', 'Server info', app.config.sioserver);
  winston.log('info', 'Loopback', app.base_url+":" + app.port);
  winston.log('info', 'Building Brainss Service starts');
});

sioConnect(app);
