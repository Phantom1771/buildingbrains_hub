
var server = require('../config/server');
var hubutils = require('../src/hub_utils');
var config = require('../config/config');
var app = require('../app');
var assert = require('assert');
var json = '{}';

describe('Sample', function() {
  it('should return -1 when the value is not present', function() {
    assert.equal(-1, [1,2,3].indexOf(4));
  });
});

describe('Test Request Setup', function() {
  var options = {};
  var opBackend= {};
  var opHub= {};
  it('Request for backend', function() {
    assert.equal(JSON.stringify(options),
            JSON.stringify(opBackend));
  });
  it('Request for hub', function() {
    assert.equal(JSON.stringify(options),
            JSON.stringify(opHub));
  });

});

describe('Test response', function() {
  var options = {};
  var opBackend= {};
  var opHub= {};
  it('Request for backend', function() {
    assert.equal(JSON.stringify(options),
            JSON.stringify(opBackend));
  });
  it('Request for hub', function() {
    assert.equal(JSON.stringify(options),
            JSON.stringify(opHub));
  });
});

describe('Test App State', function() {
  // sample test for asyn
  it('No Connection', function(done) {
    // actions
    var expVal = 0;
    app.sendReqToBackEnd();

    setTimeout(function(){
      // test result here
      assert.equal(app.reqId, expVal);
      done();
    },1000);
  });

  it('Disconnected by Backend', function(done) {
    var expVal = 0;
    app.sendReqToBackEnd();
    setTimeout(function(){
      assert.equal(app.reqId, expVal);
      done();
    },1000);
  });

  it('Received Response', function(done) {
    var expVal = 0;
    app.sendReqToBackEnd();
    setTimeout(function(){
      assert.equal(app.reqId, expVal);
      done();
    },1000);
  });

});


/*


//var app = require('../app');


describe("Test", function() {


});
*/
