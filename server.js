const bodyParser     = require('body-parser');
var express = require('express');
var app = express();
/* const MongoClient    = require('mongodb').MongoClient; */

// Connexion mongoDB
const mongoose = require('./back/config');
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

//import routes
const quests = require('./back/questRoute');

//import dependencies 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var coordinates = require('./pokestops_cahors.json');
var quest = require('./quest.json');

/* console.log(quest.quest) */

const port = 8000;
app.use(bodyParser.json())
app.use(express.static('public')); 
  
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });


  
  io.on('connection', function(socket){
    socket.emit('connection', {coordinates:coordinates, quest:quest.quest});
  });


  app.use('/', quests);
  
  http.listen(port, function(){
    console.log('listening on *:8000');
  });




/*   // Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  if (err) throw err;

  const db = client.db(dbName);
  console.log("Connected successfully to server");

  client.close();
}); */
