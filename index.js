const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on("new user", (newuser) => {
    socket.broadcast.emit("new user", newuser)
  })

  socket.on("add user", (user) => {
    socket.emit("add user", user)
    socket.username = user
  })

  socket.on('disconnect', () => {
    io.emit('chat message', `${socket.username} has left the chat`);
  });

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on("user typing", typi => {
    socket.broadcast.emit("user typing", typi)
    console.log(users)
  })

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});