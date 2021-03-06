const bodyParser     = require('body-parser');
var express = require('express');
var app = express();

// Connexion mongoDB
const mongoose = require('./back/config');
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

//import controller
const questRoute = require('./back/questRoute');
const questController = require('./back/questController');
//import dependencies 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pokestops = require('./pokestops_cahors.json');
var quests = require('./quest.json');


const port = 4600;
app.use(bodyParser.json())
app.use(express.static('public')); 
app.use('/', questRoute);
  
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  // send json informations to client 
  io.on('connection', function(socket){
    socket.emit('connection', {pokestops:pokestops.pokestops, quests:quests.quest});

    socket.on('quest update', function () {
      console.log('Une quête a été ajoutée')
      // A ce moment il faut broadcast les nouvelles données de la database a tout le monde 
    });

  });

  
  http.listen(port, function(){
    console.log('listening on *:4600');
  });

