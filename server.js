const bodyParser     = require('body-parser');
var express = require('express');
var app = express();

// Connexion mongoDB
const mongoose = require('./back/config');
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

//import controller
const questController = require('./back/questController');

//import dependencies 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var coordinates = require('./pokestops_cahors.json');
var quest = require('./quest.json');


const port = 8000;
app.use(bodyParser.json())
app.use(express.static('public')); 
  
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  // send json informations to client 
  io.on('connection', function(socket){
    socket.emit('connection', {coordinates:coordinates, quest:quest.quest});
    questController.findAll()

    socket.on('quest selected', function (data) {
    questController.create(data)
    });
  });

  
  http.listen(port, function(){
    console.log('listening on *:8000');
  });

