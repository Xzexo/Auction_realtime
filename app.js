const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/myRouter');
const app = express();
const path = require('path');
const cookieSession = require('cookie-session');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const socketio = require("socket.io");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Add this line to parse JSON bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "mysession", resave: false, saveUninitialized: false }));
app.use(router);

const port = process.env.PORT || 3030;

const server = app.listen(port, () => {
  console.log("Server is running on port " + port);
});

const io = socketio(server);

io.on("connection", socket => {
  console.log("New user connected");

  socket.username = "Toro";

  socket.on("change_username", data => {
    socket.username = data.username;
  });

  socket.on("new_message", data => {
    console.log("New message");
    io.sockets.emit("receive_message", { message: data.message, username: socket.username });
  });

  socket.on('typing', data => {
    socket.broadcast.emit('typing', { username: socket.username });
  });
});
