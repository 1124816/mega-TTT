var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs =require("fs");
var players = 0;
var turnEh = 1;
var map = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];

app.use(express.static(path.join(__dirname, '/pub')));
app.get('/', function(req, res){
  res.sendFile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  players = players + 1;
  socket.emit('matches', {map:map, players:players, turn:turnEh});

  socket.on('play', function(msg){
  map[msg.x][msg.y] = msg.player;
  console.log(map);
  turnEh = (3-msg.player);
  socket.broadcast.emit('play', {x:msg.x, y:msg.y, player:msg.player, turn:turnEh});
  });

  socket.on('disconnect', function(){
  players = players - 1;
  console.log('user disconnected');
  socket.emit('matches', {map:map, players:players, turn:turnEh});
  });
});

http.listen(4000, function(){
  console.log('listening on *:3000');
});
