let maintitle = document.getElementById("main_title")
let canvasHolder = document.getElementById("canvasHolder")
let homepage = document.getElementById("homepage")

let userform = document.getElementById("user_form");
let username = document.getElementById("username");
let userslisting = document.getElementById("users");
let team1listing = document.getElementById("team1list");
let team2listing = document.getElementById("team2list");
let team1 = document.getElementById("myCheck1");
let team2 = document.getElementById("myCheck2");

let teamchoice = document.getElementById("checkbox_container")

var fullchatcontainer = document.getElementById("full_chat_container")
var istyping = document.getElementById("is_typing");
var messages = document.getElementById("messages");
var chatform = document.getElementById("chat_form");
var chatinput = document.getElementById("chat_input");

let countertag = document.getElementById("countertag");
let countertag2 = document.getElementById("countertag2");

// let team1number = document.getElementById("team1number");
// let team2number = document.getElementById("team2number");
// let countdown = document.getElementById("countdown")

let gameinput = document.getElementById("game_input");
let startbutton = document.getElementById("start_button");
let restartbutton = document.getElementById("restart");


let startList = [];


let counter1front = 0;
let counter2front = 0;


let roomnamefront = document.getElementById("roomname");

let team1userslist = document.getElementById("team1userslist");



// socket.emit("startList", startList)
// socket.emit("timer", counter)

// let number1= team1list.length;
// let number2 = team2list.length;
// let counter = 4;

// socket.on("join room", room => {
//   room = roomname.value;
// })

// let changeteam1 = document.getElementById("changeteam1");
// let changeteam2 = document.getElementById("changeteam2");

// changeteam1.addEventListener("click", () => {
//   socket.emit("change team", "team1")
//   socket.emit("apply change team1")
//   socket.emit("sync team1 list", team1list)
//   socket.emit("sync team2 list", team2list)
// })

// changeteam2.addEventListener("click", () => {
//   socket.emit("change team", "team2")
//   socket.emit("apply change team2")
//   socket.emit("sync team1 list", team1list)
//   socket.emit("sync team2 list", team2list)
// })

// socket.on("change team", (team) => {
//   socket.emit("change team", team)
// })

// socket.on("apply change team1", () => {
//   socket.emit("apply change team1")
// })

// socket.on("apply change team2", () => {
//   socket.emit("apply change team2")
// })


startbutton.addEventListener("click", () => {
  socket.emit("launch game");
  socket.emit("start time")
})


restartbutton.addEventListener("click", () => {
  socket.emit("restart", counter1front, counter2front)
  socket.emit("stop time")
})

socket.on("restart", (countertochange1, countertochange2) => {
  countdown.innerText = "";
  chronoStopReset();
  socket.emit("zero counters");
  socket.emit("sync counter1", counter1front)
  socket.emit("stop hero1", counter1front)
  socket.emit("sync counter2", counter2front)
  socket.emit("stop hero2", counter2front)
  socket.emit("stop time");
  let item = document.createElement("BUTTON");
  item.innerHTML = "START"
  item.setAttribute("id", "start_button");
  countdown.appendChild(item);
  item.addEventListener("click", () => {
    socket.emit("stop time")
    socket.emit("launch game");
    socket.emit("sync counter1", counter1front)
    socket.emit("stop hero1", counter1front)
    socket.emit("sync counter2", counter2front)
    socket.emit("stop hero2", counter2front)
    socket.emit("start time")
  })
})


///////////////////////////////////////////////////////////
socket.on("launch game", () => {
  countdown.innerHTML = "GO !"
});

socket.on("winner1", () => {
  countdown.innerHTML = "TEAM 1 WINS !!!"
  chronoStop()
  socket.emit("stop time")
  //  socket.emit("restart", counter1front)
})

socket.on("winner2", () => {
  countdown.innerHTML = "TEAM 2 WINS !!!"
  chronoStop()
  socket.emit("stop time")
  //  socket.emit("restart", counter2front)
})

socket.on("start time", () => {
  chronoStopReset();
  chronoStart();
})

socket.on("stop time", () => {
  chronoStop();
})

socket.on("sync counter1", (counter) => {
  countertag.innerHTML = "";
  let item = document.createElement("p");
  item.innerText = `${counter / 10} meters`
  countertag.appendChild(item);
})

socket.on("sync counter2", (counter) => {
  countertag2.innerHTML = "";
  let item = document.createElement("p");
  item.innerText = `${counter / 10} meters`
  countertag2.appendChild(item);
})

socket.on("move hero1", (counter) => {
  canvas = document.getElementById("canvasHolder");
  context = canvas.getContext("2d");
  hero = new GameObject(heroSpritesheet,  //the spritesheet image
    counter,            //x position of hero
    200,            //y position of hero
    864,         //total width of spritesheet image in pixels
    140,          //total height of spritesheet image in pixels
    60,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
    8);           //number of sprites in the spritesheet
  loop2();
  socket.emit("winner1", counter)
})

socket.on("move hero2", (counter) => {
  canvas = document.getElementById("canvasHolder");
  hero2 = new GameObject(heroSpritesheet2,  //the spritesheet image
    counter,            //x position of hero
    225,            //y position of hero
    1000,         //total width of spritesheet image in pixels
    157,          //total height of spritesheet image in pixels
    60,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
    8);           //number of sprites in the spritesheet
  loop2();
  socket.emit("winner2", counter)

})



socket.on("stop hero1", (counter) => {
  canvas = document.getElementById("canvasHolder");
  context = canvas.getContext("2d");
  hero = new GameObject(heroSpritesheet,  //the spritesheet image
    counter,            //x position of hero
    200,            //y position of hero
    864,         //total width of spritesheet image in pixels
    140,          //total height of spritesheet image in pixels
    100000,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
    8);           //number of sprites in the spritesheet
  stopHero();
})

socket.on("stop hero2", (counter) => {
  canvas = document.getElementById("canvasHolder");
  hero2 = new GameObject(heroSpritesheet2,  //the spritesheet image
    counter,            //x position of hero
    225,            //y position of hero
    1000,         //total width of spritesheet image in pixels
    157,          //total height of spritesheet image in pixels
    600000,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
    8);           //number of sprites in the spritesheet
  stopHero();
})


