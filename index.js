const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

const router = require('./router');

app.use(router);

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'https://chat-fullstack.vercel.app/',
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`User has connected with id: ${socket.id}`)

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User has joined room ${data}`)
    })

    socket.on('send_message', (data) => {
        socket.to(data.room).emit("receive_message", data)
        console.log(data)
    })


    socket.on("disconnect", () => {
        console.log(`User ${socket.id} has disconnected`)
    })
})

server.listen(process.env.PORT || 3001, () => {
    console.log("SERVER RUNNING")
})