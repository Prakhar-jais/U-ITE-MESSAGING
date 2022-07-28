//importing 


const dotenv = require("dotenv");
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

dotenv.config();


//middleware
app.use(express.json())
app.use(cors())

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// WdcBCDrQeM8Ucq6Z
//Db configure


mongoose.connect(process.env.MONGOURL, {

    useNewUrlParser: true,
    useUnifiedTopology: true
})

//??

const db = mongoose.connection
db.once('open', () => {
    console.log('Db is connected');
});






//deploy code starts
const path = require("path");
const dir_ = path.basename(path.dirname("server.js"));
const {resolve} = require("path");
const { DEFAULT_MIN_VERSION } = require("tls");
const abs_dir = resolve(dir_);
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(dir_, 'unite_chat_app','build')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(dir_,'unite_char_app', 'build', 'index.html'));
    });
} 
else{
    // app.use(express.static(path.join(dir_, 'unite_chat_app','build')));

    // app.get('/', function (req, res) {
    //     res.sendFile(path.join(dir_,'unite_char_app', 'build', 'index.html'));
    // });
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

