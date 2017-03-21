
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
app.sendReqToHub = function(json) {
  /*winston.info("INFO", "request request to openHab");*/
  // send request to the hub
  var options = hubutils.getOptions(json);
  console.log(options);
  reqbwd(options, function(err, res){
    if(!err) {
      app.data = res;
    }
    else {
      /*winston.error("ERROR", "Internal: Connection Error");*/
      app.data = '{"message":"error"}';
    }
    // restart request
    Connected = false;
  });
};

//
//
//
app.sendReqToBackEnd = function() {
  /*winston.info("INFO", "request request to Backend");*/
  var options = backend.getCheckupdateOptions(app);
  reqfwd(options, function(err, res){
    if(!err) {
      var data = JSON.parse(res.body);
      /*winston.info("[INFO]", "keys number: ", Object.keys(data).length)*/
      if(Object.keys(data).length) {
        /*winston.info("[INFO]", "reqId: ", data.reqId)*/
        var reqId = data.reqId;
        if(reqId > 0) {
          /*winston.info("[INFO]", "should send request to Hub");*/
          app.reqId = reqId;
          console.log(data);
          app.sendReqToHub(data);
        }
        // server response last request which the hub response
        // server's request
        else{
            /*winston.info("[DONE]", "Request");*/
            Connected = false;
        }
      }
    }
    else {
      /*winston.error("ERROR", "External: Connection Error");*/
      Connected = false;
    }
  });
}

// for testing individually or Internal communication in future
app.startCheckNewDevices = function() {
  setInterval(function() {
    if(registered) {
      app.checkNewDevices();
    }
  }, app.checkdevtime);
};


app.startCheckupdates = function() {
  setInterval(function() {
    if(registered&(!Connected)) {
      /*winston.info("connected")*/
      Connected = true;
      app.sendReqToBackEnd();
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
