var app = require('./config/app.json');
var io = require('socket.io-client')('http://localhost:3000');
const prompt = require('prompt-sync')();
const eventList = ['send', 'request', 'echo'];
const messageList = ['message 1', 'masdfaf', 'adeswwca', 'sdfe 1', '2342', 'asdfa'];
var connecting = true;
var connected = false;
var counter = 0;
var num = 0;

onConnect();

io.on('event', function(data){
  console.log(data);
});

io.on('notification', function(data) {
  console.log("notification:\n" + JSON.stringify(data));
});

io.on('disconnect', function(){
  console.log("disconnect");
  connecting = false;
  connected = false
});


setInterval(function() {
  if(counter > 0) return;
  counter++;
  if(!connecting && !connected){
    onConnect();
  }
}, 1000);

function onConnect() {
  counter = 0;
  connecting = true;
  io.on('connect', function(){
    connecting = true;
    num++;
    console.log(num + " connected");
    io.emit('initial', { secretekey:"myscretekey", uuid:'myuuid'});
    connected = true;
  });
}
