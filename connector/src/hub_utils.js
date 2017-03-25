const rn = require('random-number');

function genRandID() {
  var options = {
    min:  100000,
    max:  599999,
    integer: true
  };
  return rn(options);
};

module.exports = {
  
  getbaseUrl:function() {
    if(this.loopback = true) {
      return 'http://localhost:8080'+path;
    }
    return 'http://' + this.ip + ':' + this.port + '/rest';
  },

  getInboxUrl:function() {
    var url = this.getbaseUrl();
    return url+'/inbox';
  },

  getThingUrl:function(uid) {
    var url = this.getbaseUrl();
    return url+'/things/'+uid;
  },

  getItemUrl:function(itemName, attr) {
    var url = this.getbaseUrl()+'/items/';
    if(attr === 'state') {
      url += itemName+'/'state;
    }
    return url;
  },

  //{"flag":"NEW","label":"test Switch","properties":{"udn":"Socket-1_0-221328K0101916"},"representationProperty":"udn","thingUID":"wemo:socket:Socket-1_0-221328K0101916","thingTypeUID":"wemo:socket"}
  getApproveDevOptions: function(device) {
    var url = this.getbaseUrl();
    var label = device.label;
    url += '/inbox/' + device.properties.thingUID + '/approve';
    var options = {
        method:"POST",
        uri: url
    };

    options.headers = {
      'Content-Type':'text/plain'
    };
    options.body = label;
    return options;
  },

  getSendCmdOptions: function(update) {
    var url = this.getbaseUrl();
    url += '/items/' + update.deviceLink;
    var options = {
      method: "POST",
      uri: url
    };
    options.headers = {
      'Content-Type':'text/plain'
    };
    options.body = update.setting;
    return options;
  },


  // hub config
  loopback: true,
  ip: '161.97.196.240',
  port: 8080
}
