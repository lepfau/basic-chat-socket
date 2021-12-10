const app = require('express')();
const express = require('express')
const http = require('http').Server(app);
const path = require('path');
const { start } = require('repl');

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

let startArray = [];

let counter1 = 0;
let counter2 = 0;

let timer = 4;


io.on('connection', (socket) => {

  //////////////////////////////////////CHAT PART/////////////////////////

  //new user message on chat
  socket.on("new user", (username) => {
    socket.broadcast.emit("new user", `${username} has join the chat`)
  })

  //send chat message 
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  //show user typing
  socket.on("user typing", typi => {
    socket.broadcast.emit("user typing", typi)
  })

  //////////////////////////////////////USERS PART/////////////////////////

  //add user to users list array
  socket.on("add user", (user) => {
    socket.emit("add user", user)
    users.push(user)
    socket.username = user;
  })

  //add user to team list array
  socket.on("choose team", ({ username: user, teamnumber: team }) => {
    socket.emit("choose team", { user: user, team: team })
    if (team === "team1") team1.push(user)
    else team2.push(user)
  })

  //sync back user list array with front user list
  socket.on("sync user list", (userlistfromback) => {
    userlistfromback = users;
    socket.emit("sync user list", userlistfromback)
  });


  //sync team1 list array from back with team1 array on front
  socket.on("sync team1 list", (team1listfromback) => {
    team1listfromback = team1;
    socket.emit("sync team1 list", team1listfromback)
  })

  //sync team2 list array from back with team2 array on front
  socket.on("sync team2 list", (team2listfromback) => {
    team2listfromback = team2;
    socket.emit("sync team2 list", team2listfromback)
  })


  //////////////////////////////////////GAME PART/////////////////////////

  //sync counter1 from back with counter1 from front
  socket.on("sync counter1", (counterfromback1) => {
    counterfromback1 = counter1;
    io.emit("sync counter1", counterfromback1)
  })

  //sync counter2 from back with counter2 from front
  socket.on("sync counter2", (counterfromback2) => {
    counterfromback2 = counter2;
    io.emit("sync counter2", counterfromback2)
  })

  socket.on("increase counter1", () => {
    counter1 += 5;
  })

  socket.on("increase counter2", () => {
    counter2 += 5;
  })

  //sync counter1 with counter in front (differencier pour le socket on partie counter / hero)
  socket.on("move hero1", (counterfromback1) => {
    counterfromback1 = counter1;
    io.emit("move hero1", counterfromback1)
  })
  //sync counter2 with counter in front (differencier pour le socket on partie counter / hero)
  socket.on("move hero2", (counterfromback2) => {
    counterfromback2 = counter2;
    io.emit("move hero2", counterfromback2)
  })

  //afficher position initiale hero1
  socket.on("show hero1", (counterfromback1) => {
    counterfromback1 = counter1;
    io.emit("show hero1", counterfromback1)
  })

  //afficher position initiale hero1
  socket.on("show hero2", (counterfromback2) => {
    counterfromback2 = counter2;
    io.emit("show hero2", counterfromback2)
  })


  //sync counter pour garder la position et envoyer le loop fixe du canvas
  socket.on("stop hero1", counterfromback1 => {
    counterfromback1 = counter1;
    io.emit("stop hero1", counterfromback1)
  })
  //sync counter pour garder la position et envoyer le loop fixe du canvas
  socket.on("stop hero2", counterfromback2 => {
    counterfromback2 = counter2;
    io.emit("stop hero2", counterfromback2)
  })

  socket.on("launch game", () => {
    io.emit("launch game")
  })

  socket.on("winner1", (countertest) => {
    countertest = counter1;
    if (countertest === 700) {
      io.emit("winner1")
    }
  })

  socket.on("winner2", (countertest2) => {
    countertest2 = counter2;
    if (countertest2 === 700) {
      io.emit("winner2")
    }
  })

  socket.on("restart", (countertochange1, countertochange2) => {
    counter1 = 0;
    counter2 = 0;
    countertochange1 = counter1 - 5;
    countertochange2 = counter2 - 5;
    io.emit("restart")
  })


  socket.on("timer", timerfromback => {
    timerfromback = timer;
    socket.emit("timer", timerfromback)
  })

  socket.on("addStartList", (username) => {
    startArray.push(username);
  })

  socket.on("startList", (startList) => {
    startList = startArray
    socket.emit("startList", startList)
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

    counter1 = 0;
    counter2 = 0;

    console.log(users)
  });

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});