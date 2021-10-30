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
    console.log('user connected')

    // broadcasts vote to all users
    socket.on('vote', vote => {
        console.log(`user voted on ${vote}`)

        socket.broadcast.emit('vote', `user voted on ${vote}`)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

httpServer.listen(3000, () => {
    console.log('server started at http://localhost:3000')
})