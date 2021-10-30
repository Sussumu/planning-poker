const express = require('express')
const app = express()
const http = require('http')
const httpServer = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(httpServer)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
    socket.join(socket.room)
    console.log(`user [${socket.id}] connected`)

    // setups new room
    socket.on('create-room', roomId => {
        console.log(`room [${roomId}] created`)

        socket.join(roomId)
    })

    // broadcasts vote to all users
    socket.on('vote', vote => {
        console.log(`user [${socket.id}] from room [${vote.room}] voted on [${vote.value}]`)

        socket.broadcast.to(vote.room).emit('vote', `user [${socket.id}] voted on [${vote.value}]`)
    })

    socket.on('disconnect', () => {
        console.log(`user [${socket.id}] disconnected`)
    })
})

httpServer.listen(3000, () => {
    console.log('server started at http://localhost:3000')
})