
const _name = 'app.js';
const winston = require('winston');
const reqfwd = require('request');        // used to communicate backend
const reqbwd = require('request');        // used to communicate openHab
const backend = require('./config/server');
const hubutils = require('./src/hub_utils');
var registered = false;
var Connected = false;
var app = require('./config/config');
app.backend = backend;
app.hubutils = hubutils;
app.reqId = 0;
app.data = '{}';

//
// Register the hub
//
app.registerHub = function() {
  var options = backend.getRegisterhubOptions(app);
  reqfwd(options, function(err, res){
    if(!err) {
      var data = JSON.parse(res.body);
      if(data.result == 0 ||
          data.error == 'This Hub has already been registered') {
        registered = true;
      }
      else {
        winston.info('ERR', 'EXTERNAL ERROR', data.error);
      }

    }
    else {
      winston.info('ERROR', 'CONNECTION ERROR');
    }
  });
};

//
//
//
app.checkNewDevices = function () {

}

//
//
//
app.sendReqToHub = function(options) {
  // send request to the hub
  var ret;
  reqbwd(options, function(err, res){
    if(!err) {
      ret = JSON.parse(res);
    }
    else {
      ret = '{"message":"error"}';
    }
    return ret;
  });
};

//
//
//
app.checkupdates = function() {
  /*winston.info("INFO", "request request to Backend");*/
  var options = backend.getCheckupdateOptions(app);
  reqfwd(options, function(err, res){
    var data = JSON.parse(res.body);
    if(!err) {
      if(data.result==0) {
        var existingUpate = JSON.parse(updates);
        var options = hubutils.getQueryOptions(existingUpate);
        sendReqToHub(options); // backend not handle any error
      }
    }
    Connected = false;
  });
}

// for testing individually or Internal communication in future
app.startCheckNewDevices = function() {
  setInterval(function() {
    if(registered) {
      var options = backend.getRegisterdeviceOptions(app);
      console.log(JSON.stringify(options));
      app.checkNewDevices();
    }
  }, app.checkdevtime);
};


app.startCheckupdates = function() {
  setInterval(function() {
    if(registered&(!Connected)) {
      /*winston.info("connected")*/
      Connected = true;
      var options = backend.getCheckupdateOptions(app);
      app.checkupdates();
    }
  }, app.sendreqtime);
};

app.run = function() {
  setInterval(function(){
    if(!registered){
      app.registerHub();
    }
  }, app.registertime);
  app.startCheckNewDevices();
  app.startCheckupdates();
}

//
// run app
//
module.exports = app;

if (!module.parent) {
    app.run();
} else {
    console.log("Testing " + _name);
}
