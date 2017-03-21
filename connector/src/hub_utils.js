module.exports = {
  getQueryUrl:function() {
    return 'http://localhost:8080'+"/rest/items";
  },
  getQueryOptions: function(json) {     // construct request options
    var url = this.getQueryUrl();
    if(json.deviceLink != '') {
      url += '/'+json.deviceLink;
    var options = {
      method:json.method,
      uri: url,
    };
    if(json.method == "POST") {
      options.headers = {
        'Content-Type':'text/plain'
      }
      option.body = json.setting;
    }
    return options;
  },
  getNewDeviceOptions: function(json) {
    var url = this.getUrl();

    var options = {
      method:json.method,
      uri: url,
    };

    return options;
  }
}
