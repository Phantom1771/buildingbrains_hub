module.exports = {
  getUrl:function(json) {
    return 'http://localhost:8080'+"/rest/items/";
  },
  getOptions: function(json) {     // construct request options
    var url = this.getUrl();
    if(json.itemname != '')
      url += json.itemname;
    var options = {
      method:json.method,
      uri: url,
    };
    if(json.method == "POST") {
      options.headers = {
        'Content-Type':'text/plain'
      }
      option.body = json.command;
    }
    return options;
  }
}
