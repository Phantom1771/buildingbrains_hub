const _name = 'app.js';
const winston = require('winston');
const request = require('request');
const backend = require('./src/server');
const hubutils = require('./src/hub');
var registered = false;
var Connected = false;
var app = require('./config/config');

//
// Register the hub. On success,The app starts to check updates 
// from backend server and check new device from openhab.
// On failure, register again after an time interval
//
app.registerHub = function() {
  var options = backend.getRegisterhubOptions(app);
  request(options, function(err, res){
    if(!err) {
			if(res.statusCode === 200 ||
					res.statusCode === 400) {
						// Next sate after registered
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

//
// Start the routine to register new devices
// 1. request data from openhab,		GET 	/rest/inbox
// 2. approve thing.UID to openhab, POST 	/rest/thing.UID/approve
// 3. request thing from openhab, 	GET 	/rest/thing.UID
// 4. request state of item, 				GET 	/rest/thing.linkeditem[0]
// 5. register device 
//
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
				// approving device found
				var appOp = hubutils.getApproveDevOptions(deviceinfo);
				console.log(deviceinfo+ '\napprove options: ', appOp);
				request(appOp, function(err, res) {
					if(!err && res.statusCode === 200) {
						// handle after approving successfully
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

//
// prepare the device info as Backend required
// by retrieving the thing with devInfo.thingUID
//
// **Don't guurantee the state is initialized
//
app.prepareDeviceInfo = function(devInfo) {
	var url = hubutils.getThingUrl(devInfo.thingUID);
	var options = {
		uri: url,
		method:"GET"
	};
	request(options, function(err, res) {
		if(!err && res.statusCode === 200) {
			var thing = JSON.parse(res.body);
			var channels = thing.channels;
			if(channels.length > 0) {
				const channel = channels[0];
				const linkedItems = channel.linkedItems;
				var device = {
					deviceLink:linkedItems[0],
					type:channel.itemType,
					category: 'UNKNOWN'
				};
				// retrieve current data of the item
				url = hubutils.getItemUrl(linkedItems[0], 'state');
				options = {
					uri:url,
					method:"GET"
				};
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

//
// register the device with the request [GET, /devices/register]
// param: 	device: json
//
// device fields: {deviceLink, type, category, state}
//
app.registerDevice = function(device) {
	var options = backend.getRegisterdeviceOptions(app, device);
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
// Send request to request POST, /hubs/checkUpdates
// and handle the response from Back-end server
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

//
// start the procedures to check new device from openhab
// in the time interval
//
app.startCheckNewDevices = function() {
  app.deviceTimer = setInterval(function() {
    if(registered) {
      app.registerNewDevices();
    }
  }, app.checkdevtime);
};

//
// start the procedures to check updates from backend server
// in the time interval
//
app.startCheckupdates = function() {
  app.updateTimer = setInterval(function() {
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
