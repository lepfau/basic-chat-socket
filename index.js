const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {


  socket.on("new user", (username) => {
    socket.broadcast.emit("new user", `${username} has join the chat`)
  })

  socket.on("add user", (user) => {
    socket.emit("add user", user)
    users.push(user)
    socket.username = user;
  })


  socket.on("user list", (userlistfromback) => {
    userlistfromback = users;
    socket.emit("user list", userlistfromback)
  })


  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on("user typing", typi => {
    socket.broadcast.emit("user typing", typi)
  })

  
  socket.on('disconnect', () => {
    io.emit('chat message', `${socket.username} has left the chat`);
    let filtered = users.filter(user => user !== socket.username);
    users = filtered;
    socket.emit("user list", filtered);
    console.log(users)
  });

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});