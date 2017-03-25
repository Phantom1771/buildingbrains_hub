
const _name = 'app.js';
const winston = require('winston');
//const request = require('request');        // used to communicate backend
const request = require('request');        // used to communicate openHab
const backend = require('./config/server');
const hubutils = require('./src/hub_utils');
var registered = false;
var Connected = false;
var app = require('./config/config');

//
// Register the hub
//
app.registerHub = function() {
  var options = backend.getRegisterhubOptions(app);
  request(options, function(err, res){
    if(!err) {
      var data = JSON.parse(res.body);
      if(data.result == 0 ) {
        registered = true;
      }
      else {
        winston.info('ERROR', 'EXTERNAL ERROR', data.error);
      }

    }
    else {
      winston.info('ERROR', 'CONNECTION ERROR');
    }
  });
};

app.registerNewDevices = function() {
	var url = hubutils.getInboxUrl();
	// query new devices in INBOX
	request.get(url)
				.on('response', function(res) {
					var devices = JSON.parse(res.body);
					if(devices.length > 0) {
						devices.forEach((deviceinfo) => {
							// approve -> search things -> search items
							var appOp = hubutils.getApproveDevOptions(deviceinfo);
							request(appOp, function(err, res) {
								if(!err && res.statusCode == 200) {
									// handle after approving
									app.prepareDeviceInfo(deviceinfo);
								}
							});
						});
					}
					else {
						winston.info('INFO', 'NO NEW DEVICES');
					}
				});
}

app.prepareDeviceInfo = function(devInfo) {
	var url = hubutils.getThingUrl(devInfo.properties.thingUID);
	request.get(url)
		.on('response', function(res){
			if(res.statusCode === 200) {
				var thing = JSON.parse(res.body);
				if((thing.channels).length > 0 && (thing.channels.linkedItems)>0) {
					const channel = thing.channels[0];
					const linkedItem = channel.linkedItems[0];
					var device = {
						deviceLink:linkedItem,
						type:channel.itemType
					};
					url = hubutils.getItemUrl(linkedItem, 'state');
					request.get(url)
									.on('response', function(itemres){
										if(!err && itemres.statusCode === 200) {
											device.state = itemres.body;
											app.registerDevice(device);
										}
									});
				}
			}
		});
}

app.registerDevice = function(device) {
	var options = backend.getRegisterdeviceOptions(app, device);
	request(options, function(err, res){
		if(!err) {
			console.log('Server gets new device', device.deviceLink);;
		}
		else {
			// Handle CONNECTION ERROR
			winston.info('ERROR', 'CONNECTION ERROR');
		}
	});
}

//
//
//
app.checkupdates = function() {
  var options = backend.getCheckupdateOptions(app);
  request(options, function(err, res, body){
    if(!err) {
			var data = JSON.parse(body);
      if(data.result === 0) {
				var updates = data.updates;
				if(updates.length > 0) {
					updates.forEach((update) => {
						update.method = "POST";
						var options = hubutils.getSendCmdOptions(update);
						console.log("Request to " + JSON.stringify(options));
						// send request to the hub
						//var request = require("request");
						request(options, function(err, res){
							if(!err) {
								console.log("STATUS "+res.statusCode);
							}
							else {
								winston.info("INFO", "INTERNAL ERROR");
							}
						});
					});
				}
				else {
					winston.info("INFO", "NO UPDATES");
				}
			}
      else {
				winston.info("ERROR", "DATABASE ERROR");
			}
    }
    else {
			winston.info("ERROR", "EXTERNAL ERROR");
		}
    Connected = false;
  });
}

// for testing individually or Internal communication in future
app.startCheckNewDevices = function() {
  setInterval(function() {
    if(registered) {
      app.checkNewDevices();
    }
  }, app.checkdevtime);
};

app.startCheckupdates = function() {
  setInterval(function() {
    if(registered&(!Connected)) {
      /*winston.info("connected")*/
      Connected = true;
      app.checkupdates();
    }
  }, app.sendreqtime);
};

app.run = function() {
  setInterval(function(){
    if(!registered){
      app.registerHub();
    }
  }, app.registertime);
  app.startCheckNewDevices();
  app.startCheckupdates();
}

//
// run app
//
module.exports = app;

if (!module.parent) {
    app.run();
} else {
    console.log("Testing " + _name);
}
