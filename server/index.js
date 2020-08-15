const express = require('express');
const scoketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const app = express()
const server = http.createServer(app);
const io = scoketio(server);

server.listen(PORT, () => {
    console.log(`Server has started at ${PORT}`);
})
