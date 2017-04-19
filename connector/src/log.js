
var log = {};

log.log = function(type, msg) {
	var date = new Date();
	var t = type.toLowerCase();
	var msg 
	if(t === 'error' || t === 'err') {
		msg = "[ERROR]" + date.toString() + ' ' + msg;
		console.log(msg); 
	}
	else if(t === 'info' || t === 'information') {
		msg = "[INFO]" + date.toString() + ' ' + msg;
		console.log(msg); 
	}
	else if(t === 'ok' || t === 'OK') {
		msg = "[OK]" + date.toString() + ' ' + msg;
		console.log(msg); 
	}
}

module.exports = log;
