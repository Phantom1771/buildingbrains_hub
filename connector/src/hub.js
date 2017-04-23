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
	// return base rest api url
  getbaseUrl:function() {
    if(this.loopback) {
      return 'http://localhost:8080' + '/rest';
    }
    else {
      return 'http://' + this.ip + ':' + this.port + '/rest';
    }
  },

	// return url for /rest/inbox
  getInboxUrl:function() {
    var url = this.getbaseUrl();
    return url+'/inbox';
  },

	// return url for /rest/thing/<thingUID>
  getThingUrl:function(uid) {
    var url = this.getbaseUrl();
    return url+'/things/'+uid;
  },

	// return url for /rest/items/<itemname>
  getItemUrl:function(itemName, attr) {
    var url = this.getbaseUrl()+'/items/';
    if(attr === 'state') {
      url += itemName+'/state';
    }
    return url;
  },
  
	// return url for thing discovery /rest/discovery
	getDiscoveryUrl:function() {
		var url = this.getbaseUrl()+'/discovery';
    return url;
	},

  /*
	 *	construct options for approving thingUID
	 *	param:
	 *		device = {label:string, thingUID}
	 *	return: object
	 */
  getApproveDevOptions: function(device) {
    var url = this.getbaseUrl();
    var label = device.label;
    url += '/inbox/' + device.thingUID + '/approve';
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

  /*
	 *	construct options for send command to a device
	 *	param:
	 *		update = {deviceLink:string, setting:string|number}
	 *	return: object
	 */
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
  
  /*
   * Install extension with parameter exId
   * param:
   *	exId, e.g. binding-avmfritz, more in openhab rest api
   * return: object
   */
  getInstallExtOptions: function(extId) {
  	var url = this.getbaseUrl();
    url += '/extensions/' + extId+'/install';
    var options = {
      method: "POST",
      uri: url
    };
    return options;
  },

  // hub config
  loopback: true,
  //ip: '10.0.0.239',
  ip: '161.97.196.240',
  port: 8080
}
