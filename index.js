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

let roomsList = [];
let roomsListObject = [];

let users = [];

let team1 = [];
let team2 = [];

let startArray = [];

let counter1 = 0;
let counter2 = 0;

let timer = 4;


io.on('connection', (socket) => {
  // io.to("some room").emit("some event");
  //////////////////////////////////////CHAT PART/////////////////////////
  socket.on("join room", (room) => {
    socket.roomname = room;
    socket.join(room);
    if (!roomsList.includes(room)) {
      roomsList.push(room);
      roomsListObject.push(
        { name: socket.roomname,
          team1: [], 
          team2: [],
          counter1: 0,
          counter2: 0,
    });
  }})

  //add user to users list array
  socket.on("add user", ({username: user, teamnumber: team}) => {
  socket.username = user;
  let targetedRoom = roomsListObject.find(room => room.name === socket.roomname);
  socket.targetroom = targetedRoom;
  if(team === "team1") {targetedRoom.team1.push(user);}
  else {targetedRoom.team2.push(socket.username)};
  users.push(user)
  });

  //new user message on chat
  socket.on("new user", (username) => {
    io.to(socket.roomname).emit("new user", `${username} has join the chat`)
  })

  //send chat message 
  socket.on('chat message', msg => {
    io.to(socket.roomname).emit('chat message', msg)
    console.log(socket.roomname)
  });

  //show user typing
  socket.on("user typing", typi => {
    socket.to(socket.roomname).emit("user typing", typi)
    console.table(roomsListObject);
  })

  //////////////////////////////////////USERS PART/////////////////////////

  //add user to team list array
  socket.on("choose team", ({ username: user, teamnumber: team }) => {
    io.to(socket.roomname).emit("choose team", { user: user, team: team })
    if (team === "team1") team1.push(user)
    else team2.push(user)
  });

  //sync back user list array with front user list
  socket.on("sync user list", (userlistfromback) => {
    userlistfromback = users;
    socket.emit("sync user list", userlistfromback)
  });


  //sync team1 list array from back with team1 array on front
  socket.on("sync team1 list", (team1listfromback) => {
    team1listfromback = socket.targetroom.team1;
    socket.emit("sync team1 list", team1listfromback)
  });

  //sync team2 list array from back with team2 array on front
  socket.on("sync team2 list", (team2listfromback) => {
    team2listfromback = socket.targetroom.team2;
    socket.emit("sync team2 list", team2listfromback)
  });

  //////////////////////////////////////GAME PART/////////////////////////

  //sync counter1 from back with counter1 from front
  socket.on("sync counter1", (counterfromback1) => {
    counterfromback1 = socket.targetroom.counter1;
    io.to(socket.roomname).emit("sync counter1", counterfromback1)
  });

  //sync counter2 from back with counter2 from front
  socket.on("sync counter2", (counterfromback2) => {
    counterfromback2 = socket.targetroom.counter2;
    io.to(socket.roomname).emit("sync counter2", counterfromback2)
  });

  socket.on("increase counter1", () => {
    socket.targetroom.counter1 += 5;
    console.table(roomsListObject);
  });

  socket.on("increase counter2", () => {
    socket.targetroom.counter2 += 5;
  });

  //sync counter1 with counter in front (differencier pour le socket on partie counter / hero)
  socket.on("move hero1", (counterfromback1) => {
    counterfromback1 = socket.targetroom.counter1;
    io.to(socket.roomname).emit("move hero1", counterfromback1)
  })
  //sync counter2 with counter in front (differencier pour le socket on partie counter / hero)
  socket.on("move hero2", (counterfromback2) => {
    counterfromback2 = socket.targetroom.counter2;
    io.to(socket.roomname).emit("move hero2", counterfromback2)
  })


  //sync counter pour garder la position et envoyer le loop fixe du canvas
  socket.on("stop hero1", counterfromback1 => {
    counterfromback1 = socket.targetroom.counter1;
    io.to(socket.roomname).emit("stop hero1", counterfromback1)
  })

  //sync counter pour garder la position et envoyer le loop fixe du canvas
  socket.on("stop hero2", counterfromback2 => {
    counterfromback2 = socket.targetroom.counter2;
    io.to(socket.roomname).emit("stop hero2", counterfromback2)
  })

  socket.on("launch game", () => {
    io.to(socket.roomname).emit("launch game")
  })

  socket.on("winner1", (countertest) => {
    countertest = socket.targetroom.counter1;
    if (countertest === 700) {
      io.to(socket.roomname).emit("winner1")
    }
  })

  socket.on("winner2", (countertest2) => {
    countertest2 = socket.targetroom.counter2;
    if (countertest2 === 700) {
      io.to(socket.roomname).emit("winner2")
    }
  })

  socket.on("restart", (countertochange1, countertochange2) => {
    socket.targetroom.counter1 = 0;
    socket.targetroom.counter2 = 0;
    io.to(socket.roomname).emit("restart")
  })

  socket.on("start time", () => {
    io.to(socket.roomname).emit("start time")
  })

  socket.on("stop time", () => {
    io.to(socket.roomname).emit("stop time")
  })


  socket.on('disconnect', () => {
    io.to(socket.roomname).emit('chat message', `${socket.username} has left the chat`);

    let filtered = users.filter(user => user !== socket.username);
    users = filtered;
    io.to(socket.roomname).emit("filtered user", users)

    let filtered2 = socket.targetroom.team1.filter(user => user !== socket.username)
    socket.targetroom.team1 = filtered2;
    io.to(socket.roomname).emit("filtered team1", socket.targetroom.team1)

    let filtered3 = socket.targetroom.team2.filter(user => user !== socket.username)
    socket.targetroom.team2 = filtered3;
    io.to(socket.roomname).emit("filtered team2", socket.targetroom.team2)
    // counter1 = 0;
    // counter2 = 0;
  });

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});