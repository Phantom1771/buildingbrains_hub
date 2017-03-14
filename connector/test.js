const winston = require('winston');
const request = require('request');
var server = require('./config/server');
var config = require('./config/config');

var options = server.getOptions(config.hardware);

console.log('info', options);
