// const MongoClient    = require('mongodb').MongoClient;
// const bodyParser     = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var coordinates = require('./pokestops_cahors.json')

const port = 8000;
  
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
app.use(express.static('public')); 

  
  io.on('connection', function(socket){
    socket.emit('connection', {coordinates:coordinates});
  });
  
  http.listen(port, function(){
    console.log('listening on *:8000');
  });
