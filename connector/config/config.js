

module.exports = {
  getLoUrl: function () {
    return (this.base_url)+':'+(this.port);
  },
  getiosUrl: function() {
    var proto = 'http://'
    var ip = this.sioserver.ipaddrs[0];
    var port = this.sioserver.port;
    return proto+ip+':'+port;
  },
  hardware:{
    secretekey: 'AABBCCDD',
    uuid: 'F21E5698A0678543'
  },
  server: {
    ipaddrs:['127.0.0.1','127.0.0.1'],
    port:'8000'
  },
  sioserver: {
    ipaddrs:['127.0.0.1','127.0.0.1'],
    port:'5000'
  },
  timeout: 5000,
  timetowait: 0,                  // initial 5 sec when disconnected by server
  waitfactor: 1,

  // internal communication
  port: 3000,                     // change when not available
  base_url: 'http://localhost'    // for internal communication
}
