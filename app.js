const express = require('express')
const app = new express()
const http = require('http').Server(app)
const port = 4000

// Init app
app.use(express.static('public'))

http.listen(port, () => {
    console.log('listen on port', port)
})

// Socket
const io = require('socket.io')(http)

io.on('connection', socket => {
    console.log('new connection')

    socket.on('create or join', room => {
        console.log('create or join room', room)
        let myRoom = io.sockets.adapter.rooms[room] || {length: 0}
        let numClients = myRoom.length
        console.log(room, 'has', numClients, 'clients')

        if(numClients == 0) {
            socket.join(room)
            socket.emit('created', room)
        } else if(numClients == 1) {
            socket.join(room)
            socket.emit('joined', room)
        } else {
            socket.emit('full', room)
        }
    })

    socket.on('ready', room => {
        socket.broadcast.to(room).emit('ready')
    })


    socket.on('candidate', event => {
        socket.broadcast.to(event.room).emit('candidate', event)
    })
    socket.on('offer', event => {
        socket.broadcast.to(event.room).emit('offer', event.sdp)
    })
    socket.on('offer', event => {
        socket.broadcast.to(event.room).emit('ready', event.sdp)
    })
    
})