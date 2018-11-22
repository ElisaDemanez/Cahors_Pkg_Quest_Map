// const MongoClient    = require('mongodb').MongoClient;
// const bodyParser     = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = 8000;
  
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
app.use(express.static('public')); 

  
  io.on('connection', function(socket){
    console.log('a user connected');
  });
  
  http.listen(port, function(){
    console.log('listening on *:8000');
  });
