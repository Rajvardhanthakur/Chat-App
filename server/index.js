const express = require('express');
const scoketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express()
const server = http.createServer(app);
const io = scoketio(server);

io.on('connection', (socket) => {
    console.log('We have a new connection');

    socket.on('join', ({name, room}, callback) => {
        console.log(name, room)
    })

    socket.on('disconnect', () => {
        console.log('User has Left the chat!!!!')
    })
})

app.use(router);

server.listen(PORT, () => {
    console.log(`Server has started at ${PORT}`);
})
