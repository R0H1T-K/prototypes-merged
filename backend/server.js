require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const router = require('./pdfVariable/routers/router');
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const aiRoutes = require('./aiApp/aiRoutes');
const connectDB = require("./chatApp/config/db");
const userRoutes = require("./chatApp/routes/userRoutes");
const chatRoutes = require("./chatApp/routes/chatRoutes");
const messageRoutes = require("./chatApp/routes/messageRoutes");
const { notFound, errorHandler } = require("./chatApp/middleware/errorMiddleware");
const faceapi = require("face-api.js");
const { Canvas, Image } = require("canvas");

connectDB();
const app = express();
faceapi.env.monkeyPatch({ Canvas, Image });

app.use(cors());

app.use(express.json());

const app1BuildPath = path.join(__dirname, 'buildAI');
const app2BuildPath = path.join(__dirname, 'buildChatApp');

app.use('/ai-app', express.static(app1BuildPath));
app.use('/chat-app', express.static(app2BuildPath));

app.get('/ai-app/*', function(req, res){
  res.sendFile(app1BuildPath)
});
app.get('/chat-app/*', function(req, res){
  res.sendFile(app2BuildPath)
});

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'buildChatApp', 'index.html'));
// });

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:6974'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/output", express.static(path.join(__dirname, 'output')));
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, "public")));
const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use("/", router);
app.use('/ai', aiRoutes);

app.use(bodyParser.urlencoded({
  limit: '500mb',
  parameterLimit: 1000000,
  extended: true
}));

app.use(bodyParser.json());

// app.get('*', function (req, res) {
//   // Serve the AI app for all other routes
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

server.timeout = 300000; // Set the timeout to 5 minutes (300,000 ms)

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.SERVER_URL,
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  io.emit("newUserResponse", { socketId: socket.id });

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });


  socket.on("callUser", (data) => {
    console.log("caller userrr", data);
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
  })

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

