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
  getUrl: function(type) {        // construct URL
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
    Contruct option for request in type of asking (reqId == 0)
                            and responding(reqId > 0)
    param: cxt :app
    return options for request and its body is in JSON Format
    {
      secretekey: string, hubCode:string, reqId: integer, response: json(string)
    }
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
    data.reqId = cxt.reqId;                // extend object
    if(cxt.reqId > 0)
      data.response = cxt.data;           // extend object
    options.body = JSON.stringify(data);
    return options;
  },

  getRegisterhubOptions: function(cxt) {     // construct request options
    var url = this.getUrl('registerhub');
    var data = cxt.hardware;      // object
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

  getRegisterdeviceOptions: function(cxt) {     // construct request options
    var url = this.getUrl('registerdevice');
    var data = cxt.hardware;      // object
    var options = {
      method:'POST',
      uri: url,
      headers: {
        'Content-Type':'application/json'
        }
      };
    options.body = JSON.stringify(data);
    return options;
  },

  // configuration
  path_checkupdates: '/hubs/checkUpdates',
  path_registerhub: '/hubs/register',
  path_registerdevice: '/devices/register',
  ipaddrs:['127.0.0.1','127.0.0.1'],
  port:'8000'
}
