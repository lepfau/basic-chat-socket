const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on("new user", newuser => {
    socket.broadcast.emit("new user", newuser)
  })
  console.log('a user connected');
  socket.on('disconnect', () => {
  io.emit('chat message', 'some user disconnected');
  });
});


io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

io.on("connection", (socket) => {
  socket.on("user typing", typi => {
    socket.broadcast.emit("user typing", typi)
  })
})


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});