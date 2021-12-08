const app = require('express')();
const express = require('express')
const http = require('http').Server(app);
const path = require('path');

const port = process.env.PORT || 3000;

const io = require("socket.io")(http, {
  cors: {
    origin: port,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


let users = [];

let team1 = [];
let team2 = [];

let counter1 = 0;
let counter2 = 0;



io.on('connection', (socket) => {

  socket.on("new user", (username) => {
    socket.broadcast.emit("new user", `${username} has join the chat`)
  })

  socket.on("add user", (user) => {
    socket.emit("add user", user)
    users.push(user)
    socket.username = user;
    console.log("team1: " + team1)
    console.log("team2: " + team2)
  })

  socket.on("choose team", ({ username: user, teamnumber: team }) => {
    socket.emit("choose team", { user: user, team: team })
    if (team === "team1") team1.push(user)
    else team2.push(user)
  })

  socket.on("user list", (userlistfromback) => {
    userlistfromback = users;
    socket.emit("user list", userlistfromback)
  });



  socket.on("team1 list", (team1listfromback) => {
    team1listfromback = team1;
    socket.emit("team1 list", team1listfromback)
  })

  socket.on("team2 list", (team2listfromback) => {
    team2listfromback = team2;
    socket.emit("team2 list", team2listfromback)
  })

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on("user typing", typi => {
    socket.broadcast.emit("user typing", typi)
    console.log("counter 1 : " + counter1)
    console.log("counter 2 : " + counter2)
  })

  socket.on("counter1", () => {
   counter1 += 5;
  })

  socket.on("counter2", () => {
    counter2 += 5;
  })

  
  socket.on("show counter1", (counterfromback1) => {
    counterfromback1 = counter1;
    io.emit("show counter1", counterfromback1)
  })

  socket.on("show counter2", (counterfromback2) => {
    counterfromback2 = counter2;
    io.emit("show counter2", counterfromback2)
  })

  socket.on('disconnect', () => {
    io.emit('chat message', `${socket.username} has left the chat`);
    let filtered = users.filter(user => user !== socket.username);
    users = filtered;
    io.emit("filtered user", users)

    let filtered2 = team1.filter(user => user !== socket.username)
    team1 = filtered2;
    io.emit("filtered team1", team1)

    let filtered3 = team2.filter(user => user !== socket.username)
    team2 = filtered3;
    io.emit("filtered team2", team2)


    console.log(users)
  });

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});