require("dotenv").config()
const express = require("express");
const cors = require("cors")
const http = require('http');
const { Server } = require("socket.io");
const dbConnect = require("./configs/db")
const app = express();
const server = http.createServer(app);

const authController = require("./controller/auth.controller")
const discussionGroupController = require("./controller/discussionGroup.controller")

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use("/auth", authController);
app.use("/groups", discussionGroupController)

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });


io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    
    socket.on("join_room", (roomId)=>{
        socket.join(roomId)
        console.log(`User with Id: ${socket.id} joined room ${roomId}`)
    })

    socket.on("send_message", (data)=>{
        socket.to(data.room).emit("receive_message", data)
        console.log(`User with Id: ${data.author} sent a message from room ${data.room}`)
    })

    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id)
     });
  });

server.listen(process.env.PORT||2345, async ()=>{
    try{
        dbConnect();
        console.log("DB Connected")       
    }
    catch(er){
        console.log(er)
    }
    console.log(`listening on port ${process.env.PORT||2345}`)
})
//https://book-club-server-hackathon.herokuapp.com/ <- deployed on