//importing 



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express()
const port = process.env.PORT || 8000;
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoute")
const socket = require("socket.io");
const {MONGOURL} = require('../config/keys')
//app config



//middleware
app.use(express.json())
app.use(cors())

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// WdcBCDrQeM8Ucq6Z
//Db configure

mongoose.connect(MONGOURL, {

    useNewUrlParser: true,
    useUnifiedTopology: true
})

//??

const db = mongoose.connection
db.once('open', () => {
    console.log('Db is connected');
});






//deploy code starts

if (process.env.NODE_ENV == 'production') {
    const path = require('path')
    app.get('/', (req, res) => {
        app.use(express.static(path.resolve(__dirname, 'unite_chat_app','build')))
        res.sendFile(path.resolve(__dirname, 'unite_chat_app','build', 'index.html'))

    })
}

//deploy code ends





const server = app.listen(port, () => console.log(`Listening on localhost:${port}`))

//listener
//socket code

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send_msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    })
})

