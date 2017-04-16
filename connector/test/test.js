
process.env.NODE_ENV = 'test';
const request = require('request')
var server = require('../src/server');
var hub = require('../src/hub');
var config = require('../config/config');
var hublog = require('../src/log');
var app = require('../app');
var assert = require('assert');
var e;
var update = {
  hubCode: app.hardware.hubCode,
  deviceLink: 'MySerialTestItem',
  setting: 'ON'
  };
var device = {
  deviceLink: 'itemname',
  hubCode: app.hardware.hubCode,
  state: 'ON',
  category: 'UNKNOWN',
  type: 'Switch'
};

describe('Sample', function() {
  it('should return -1 when the value is not present', function() {
		hublog.log("INFO", "Sample info message");
		hublog.log("ERROR", "Sample err message");
    assert.equal(-1, [1,2,3].indexOf(4));
  });
});

describe('Test Request Setup', function() {
  it('Request for command', function() {
    var url = 'http://';
    if(hub.loopback){
      url += 'localhost';
    }
    else {
      url += hub.ip;
    }
    e = {
      uri: url+':8080/rest/items/'+update.deviceLink,
      method: "POST",
      body:update.setting,
      headers:{'Content-Type': 'text/plain'}
    };
    var options = hub.getSendCmdOptions(update);
    assert.deepEqual(options, e);
  });

  it('Request for hub', function() {
    var url = 'http://';
    e = {
      uri: url+server.ipaddrs[0]+':'+server.port+server.path_registerhub,
      method: "POST",
      body:JSON.stringify(app.hardware),
      headers:{'Content-Type': 'application/json'}
    };
    var options = server.getRegisterhubOptions(app);
    assert.deepEqual(options, e);
  });

  it('Register for new device', function() {
    var url = 'http://';
    var data = {
      deviceLink: device.deviceLink,
      hubCode: app.hardware.hubCode,
      state: device.state,
      category: device.category,
      type: device.type
    };
    e = {
      uri: url+server.ipaddrs[0]+':'+server.port+server.path_registerdevice,
      method: "POST",
      body:JSON.stringify(data),
      headers:{'Content-Type': 'application/json'}
    };
    data.newitem = 'asdf';
    var options = server.getRegisterdeviceOptions(app, device);
    assert.deepEqual(options, e);

  });

});

describe('Test response', function() {
  it('Send device command', function(done) {
    var options = hub.getSendCmdOptions(update);
    request(options, function(err, res, body){
      
      if(!err) {
        done(assert.equal(res.statusCode, 200));
      }
      else {
				done(assert.equal(err, {}));
      }
    });
		
  });
});

describe('Test App State', function(done) {
  // sample test for asyn
  it('No Connection', function(done) {
    // actions
    app.registerHub();
    setTimeout(function(){
      // test result here
      done(assert.equal(app.Registered, false));
      
    },1000);
  });
});
