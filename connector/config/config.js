

module.exports = {
  getUrl: function () {
    return (this.base_url)+':'+(this.port);
  },
  getiosUrl: function() {
    var ip = this.sioserver.ipaddrs[0];
    var port = this.sioserver.ipaddrs[0];
    return
  },
  hardware:{
    secretekey: 'AABBCCDD',
    uuid: 'F21E5698A0678543'
  },
  server: {
    ipaddrs:['127.0.0.1','127.0.0.2'],
    port:'8000'
  },
  sioserver: {
    ipaddrs:['127.0.0.4','127.0.0.5'],
    port:'5000'
  },

  timeout: 2000,                  // initial 5 sec when disconnected by server

  // internal communication
  port: 3000,                     // change when not available
  base_url: 'http://localhost'    // for internal communication
}
