
const _name = 'app.js';
const winston = require('winston');
const reqfwd = require('request');
const reqbwd = require('request');
const backend = require('./config/server');
const hubutils = require('./src/hub_utils');
var Connected = false;
var app = require('./config/config');
app.backend = backend;
app.hubutils = hubutils;
app.reqId = 0;
app.data = '{}';

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

/*
  send request to backend server and base on the response
  - send request to openhab, or
  - wait for 500 ms and request

  Expected JSON format from response.body of server
  {
    reqId: integer          //for backend
    method: {GET|POSt}
    itemname: string,       // empty string to query all items
    command: string {ON,OFF,INCREASE,DECREASE},
  }
*/
app.sendReqToBackEnd = function() {
  /*winston.info("INFO", "request request to Backend");*/
  var options = backend.getOptions(app);
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

app.run = function() {
  /*winston.info("[INFO]" + "App starts....");*/
  setInterval(function() {
    if(!Connected) {
      /*winston.info("connected")*/
      Connected = true;
      app.sendReqToBackEnd();
    }
  }, app.sendreqtime)
}

module.exports = app;

if (!module.parent) {
    app.run();
} else {
    console.log("Testing " + _name);
}
