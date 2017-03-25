
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
			if(res.statusCode === 200 ||
					res.statusCode === 400) {
						registered = true;
      			winston.info('OK', 'HUB is registered');
					}
			else {
      	winston.info('ERROR', 'UNKNOWN ERROR');
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
	var options = {
		uri: url,
		method:"GET"
	};
	request(options, function(err, res) {
		winston.info('INFO', 'GET INBOX');
		var devices = JSON.parse(res.body);
		if(devices.length > 0) {
			console.log('/n');
			devices.forEach((deviceinfo) => {
				// approve -> search things -> search items
				var appOp = hubutils.getApproveDevOptions(deviceinfo);
				console.log(deviceinfo+ '\napprove options: ', appOp);
				request(appOp, function(err, res) {
					if(!err && res.statusCode === 200) {
						// handle after approving
						console.log("Handle New device");
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
	devInfo = JSON.parse('{"flag":"NEW","label":"test Switch","properties":{"udn":"Socket-1_0-221328K0101916"},"representationProperty":"udn","thingUID":"wemo:socket:Socket-1_0-221328K0101916","thingTypeUID":"wemo:socket"}');

	console.log("construct device information");
	var url = hubutils.getThingUrl(devInfo.thingUID);
	var options = {
		uri: url,
		method:"GET"
	};
	request(options, function(err, res) {
		if(!err && res.statusCode === 200) {
			var thing = JSON.parse(res.body);
			winston.info("INFO", "GET THINGS", thing);
			var channels = thing.channels;
			if(channels.length > 0) {
				const channel = channels[0];
				const linkedItems = channel.linkedItems;
				winston.info("INFO", "linkedItems", linkedItems[0]);
				var device = {
					deviceLink:linkedItems[0],
					type:channel.itemType,
					category: 'UNKNOWN'
				};
				url = hubutils.getItemUrl(linkedItems[0], 'state');
				options = {
					uri:url,
					method:"GET"
				};
				winston.info("INFO", "device\n", device);
				request(options, function(err, itemres){
					if(!err && itemres.statusCode === 200) {
						device.state = itemres.body;
						winston.info("INFO", "device\n", device);
						app.registerDevice(device);
					}
				});
			}
		}
		else {
			winston.info("ERROR", "Request Failed at GET thing")
		}
	});
}

app.registerDevice = function(device) {
	var options = backend.getRegisterdeviceOptions(app, device);
	winston.info("INFO", "DEVICE", device)
	winston.info('INFO', "options -> ", options)
	request(options, function(err, res){
		if(!err) {
			if(res.statusCode == 200) {
				console.log('Server gets new device', device.deviceLink);;
			}
			else {
				winston.info('ERROR', 'statusCode', res.statusCode)
				winston.info("ERROR", "message: \n", JSON.parse(res.body).error);
			}
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
      app.registerNewDevices();
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
