const express= require('express');
const app=express();
const http = require('http');
const socketIO = require('socket.io');
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = socketIO(server);

//setting io to a socket with the instance of our server
//check for connections and then listen for event from client with the argument given
let clients ={}
let clientNum = 0
io.on('connection', socket=>{
    clientNum++;

    socket.emit('newclientconnect', {decription: "Welcome!"})
    socket.broadcast.emit('newclientconnect', {description: clientNum + ' clients connected', users: socket.id})
    socket.on('disconnect', ()=>{
        clientNum--;
        socket.broadcast.emit('newclientconnect', {description: clientNum+ ' clients'})
    })
})

server.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})