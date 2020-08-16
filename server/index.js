const express = require('express');
const scoketio = require('socket.io');
const http = require('http');

const cors = require('cors')


const PORT = process.env.PORT || 5000;

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users')

const router = require('./router');

const app = express()
const server = http.createServer(app);
const io = scoketio(server);

io.on('connection', (socket) => {

    socket.on('join', ({name, room}, callback) => {
        const { error, user} = addUser({id: socket.id, name, room});

        if(error) return callback(error)

        socket.emit('message', {user: 'admin', text:`${user.name}, welcome to the ${user.room}`})

        socket.broadcast.to(user.room).emit('message', {user:'admin', text:`${user.name}, has joined!!!`})

        socket.join(user.room)

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user, room)})

        callback(); 
    })


    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id);

        console.log(user)

        io.to(user.room).emit('message', { user:user.name, text: message})
        io.to(user.room).emit('roomData', { room:user.room.name, text: message})

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', {user: 'admin', text:`${user.name} has left!!`})
        }
    })
})

app.use(router);
app.use(cors)

server.listen(PORT, () => {
    console.log(`Server has started at ${PORT}`);
})
