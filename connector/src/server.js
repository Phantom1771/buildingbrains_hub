const rn = require('random-number');

function genRandReqID() {
  var options = {
    min:  100000,
    max:  599999,
    integer: true
  };
  return rn(options);
}

module.exports = {
	// construct options with type
  getUrl: function(type) {
    var base_url = 'http://';
    var options = {
      min:  0,
      max:  this.ipaddrs.length-1,
      integer: true
    };
    var rnum = rn(options);
    base_url += this.ipaddrs[rnum];
    base_url += ":"+this.port;
    if(type == 'checkupdates')
      return base_url+this.path_checkupdates;
    else if(type == 'registerhub')
      return base_url+this.path_registerhub;
    else if(type == 'registerdevice')
      return base_url+this.path_registerdevice;
  },

	/*
	 *	construct options for checking updates
	 *	param: cxt = {hardware:{hubcode:<string>, secreteCode:<string>}
	 *	return: object
	 */
  getCheckupdateOptions: function(cxt) {     // construct request options
    var url = this.getUrl('checkupdates');
    var data = cxt.hardware;      // object
    var options = {
      method:'POST',
      uri: url,
      headers: {
        'Content-Type':'application/json'
      }
    };
    data.reqId = cxt.reqId;
    if(cxt.reqId > 0)
      data.response = cxt.data;
    options.body = JSON.stringify(data);
    return options;
  },

	/*
	 *	construct options for registering hub
	 *	param:
	 *		cxt = {hardware:{hubcode:string, secreteCode:string}
	 *	return: object
	 */
  getRegisterhubOptions: function(cxt) {     // construct request options
    var url = this.getUrl('registerhub');
    var data = cxt.hardware;
    var options = {
      method:'POST',
      uri: url,
      headers: {
        'Content-Type':'application/json'
      },
    };
    options.body = JSON.stringify(data);
    return options;
  },

	/*
	 *	construct options for registering device
	 *	param:
	 *		cxt: {hardware:{hubcode:<string>, secreteCode:<string>}
	 *		device: {deviceLink:string, type:string, category:string, state:string|number}
	 *	return: object
	 */
  getRegisterdeviceOptions: function(cxt, device) {     // construct request options
    var url = this.getUrl('registerdevice');
    var options = {
      method:'POST',
      uri: url,
      headers: {
        'Content-Type':'application/json'
        }
      };
    device.hubCode = cxt.hardware.hubCode;
    options.body = JSON.stringify(device);
    return options;
  },

  // configuration
  path_checkupdates: '/hubs/checkUpdates',
  path_registerhub: '/hubs/register',
  path_registerdevice: '/devices/register',
  ipaddrs:['10.201.25.162', '10.201.25.162'],
  //ipaddrs:['ec2-52-36-226-213.us-west-2.compute.amazonaws.com','ec2-52-36-226-213.us-west-2.compute.amazonaws.com'],
  port:'4000'
}
