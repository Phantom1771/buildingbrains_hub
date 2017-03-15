
var server = require('../config/server');
var hubutils = require('../src/hub_utils');
var config = require('../config/config');
var assert = require('assert');
var json = '{}';

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

/*


//var app = require('../app');


describe("Test", function() {


});
*/
