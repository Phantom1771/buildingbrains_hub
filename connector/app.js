var app = require('./config/app.json');
app.serverConf = require('./config/server.json');
app.hub = require('./src/hub_utils');
var sleeptime = 1;
var failCounter = 0;
const maxsleep = 16;
const maxfailed = 10;
console.log(app);

app.senduuid = function(){
    var request = require('request');
    const port = app.serverConf.port;
    const ip = app.serverConf.ip;
    const protocol = app.serverConf.httpp;
    const base = protocol+"://"+ip+":"+port;
    const req_url = '/rest';
    console.log(base);
    var body = app.hardware;
    console.log(body);
    return true;
    const options = {
        url: base+req_url,
        method: 'GET',
        body:body
    };
    request(options, function(err, res, body) {
        console.log(body) 
        if(!err && res.statusCode == 200) {
            console.log(body);
            return true;
        }
        else {
            //return false;
            return true;
        }
    });
};

app.identityHub = function() {
    var i=0;
    while(!app.senduuid()) {
        setTimeout(function(){
            console.log((i++)+" Failed to identify hub");
        }, 60000);

        sleeptime += 2;
        if(sleeptime > 180) {
            sleeptime = 180;
        }
        console.log((i++) +"sleep time: " + sleeptime);

    }
    sleeptime = 1;
    return true;
};

app.runRoutines = function() {
    return
};

app.run = function() {
    console.log("Running");
    app.identityHub();
    app.runRoutines();
};

//app.run();
app.hub.init();
