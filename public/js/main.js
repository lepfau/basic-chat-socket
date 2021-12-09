
var fullcontainer = document.getElementById("full_container")
var yo = document.getElementById("yo");
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var form1 = document.getElementById("form1");
var input = document.getElementById("input");
var username = document.getElementById("username");
let userslisting = document.getElementById("users");

let team1listing = document.getElementById("team1list");
let team2listing = document.getElementById("team2list");
let team1 = document.getElementById("myCheck1");
let team2 = document.getElementById("myCheck2");

let inputtest = document.getElementById("inputtest");

let userList = [];
let team1list = [];
let team2list = [];


let counter1front = 0;
let counter2front = 0;
let countertag = document.getElementById("countertag");
let countertag2 = document.getElementById("countertag2")
let pcounter1 = document.getElementById("pcounter1")
let pcounter2 = document.getElementById("pcounter2")

let maintitle = document.getElementById("main_title")
let canvasHolder = document.getElementById("canvasHolder")
let homepage = document.getElementById("homepage")

let team1number = document.getElementById("team1number");
let team2number = document.getElementById("team2number");

let number1= team1list.length;
let number2 = team2list.length;



form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", `${username.value}: ${input.value}`);
    input.value = "";
  }
});

team1.addEventListener("click", function () {
  team2.checked = false
})

team2.addEventListener("click", function () {
  team1.checked = false
})

form1.addEventListener("submit", function (e) {
  e.preventDefault();
  if ((username.value && username.value !== " ") && (team1.checked || team2.checked)) {
    form1.style.visibility = "hidden";
    maintitle.style.visibility = "hidden";
    homepage.style.visibility="hidden";
    canvasHolder.style.visibility = "visible";
    fullcontainer.style.display = "block";
    document.getElementById("game_container").style.visibility = "visible"
    if (team1.checked) {
    socket.emit("choose team", { username: username.value, teamnumber: team1.value });
    socket.emit("add user", username.value);
    socket.emit("new user", username.value);
    socket.emit("user list", userList);
    socket.emit("team1 list", team1list)
    socket.emit("team2 list", team2list)
      socket.emit("show counter1", counter1front)
      socket.emit("show hero1", counter1front)
      socket.emit("show counter2", counter2front)
      socket.emit("show hero2", counter1front)
    }
    else  if (team2.checked) {
      socket.emit("choose team", { username: username.value, teamnumber: team2.value })
      socket.emit("add user", username.value);
    socket.emit("new user", username.value);
    socket.emit("user list", userList);
    socket.emit("team1 list", team1list)
    socket.emit("team2 list", team2list)
      socket.emit("show counter1", counter1front)
      socket.emit("show hero1", counter1front)
      socket.emit("show counter2", counter2front)
      socket.emit("show hero2", counter1front)
    }

      }
   
   else if(!username.value) {
   document.getElementById("error_username").innerHTML = "please submit username"
   setTimeout(() => {
    document.getElementById("error_username").innerHTML = ""
   }, 2000);}

   else {
    document.getElementById("error_username").innerHTML = "please choose a team"
    setTimeout(() => {
     document.getElementById("error_username").innerHTML = ""
    }, 2000);}
   


});

  socket.emit("user list", userList);
  socket.emit("team1 list", team1list)
  socket.emit("team2 list", team2list)


input.addEventListener("input", function () {
  socket.emit("user typing", `${username.value} is typing...`);
});

socket.on("chat message", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTo(0, messages.scrollHeight)
  // window.scrollTo(0, document.body.scrollHeight);
  yo.innerHTML = "";
});


socket.on("user typing", function (typi) {
  yo.innerHTML = typi;
});

socket.on("user list", function (userlistfromback) {
  userslisting.innerHTML = "";
  var items = userslisting.getElementsByTagName("li");
  if(userlistfromback.length > 0) {
  userlistfromback.forEach((el) => {
    var item = document.createElement("li");
    item.textContent = el;
    userslisting.appendChild(item);
  });
} else {
  var item = document.createElement("li");
    item.textContent = "Nobody online";
    userslisting.appendChild(item);
}
});


socket.on("team1 list", function (team1listfromback) {
  team1listing.innerHTML = "";
  team1listfromback.forEach(el => {
    var item = document.createElement("li");
    item.textContent = el;
    team1listing.appendChild(item)
      })
      team1number.innerHTML = team1listfromback.length;

})

socket.on("team2 list", function (team2listfromback) {
  team2listing.innerHTML = "";
  team2listfromback.forEach(el => {
    var item = document.createElement("li");
    item.textContent = el;
    team2listing.appendChild(item)
  })
  team2number.innerHTML = team2listfromback.length;
})

socket.on("updated list", function (updatedlist) {
  userslisting.innerHTML = "";
  var items = userslisting.getElementsByTagName("li");
  updatedlist.forEach((el) => {
    var item = document.createElement("li");
    item.textContent = el;
    userslisting.appendChild(item);
  });
})

socket.on("filtered team1", function (updatedlist) {
  team1listing.innerHTML = "";
  updatedlist.forEach((el) => {
    var item = document.createElement("li");
    item.textContent = el;
    team1listing.appendChild(item);
  });
})

socket.on("filtered team2", function (updatedlist) {
  team2listing.innerHTML = "";
  updatedlist.forEach((el) => {
    var item = document.createElement("li");
    item.textContent = el;
    team2listing.appendChild(item);
  });
})

socket.on("disconnect", () => {
  socket.emit("updated list", userList);
  socket.emit("filtered team1", team1list);
  socket.emit("filtered team2", team2list)

})

socket.on("filtered user", (users) => {
  userslisting.innerHTML = "";
  var items = userslisting.getElementsByTagName("li");
  users.forEach((el) => {
    var item = document.createElement("li");
    item.textContent = el;
    userslisting.appendChild(item);
  });
})

socket.on("new user", function (username) {
  var item = document.createElement("li");
  item.textContent = username;
  messages.appendChild(item);
  socket.emit("user list", userList);
  socket.emit("team1 list", team1list)
  socket.emit("team2 list", team2list)
  messages.scrollTo(0, messages.scrollHeight)
  // window.scrollTo(0, document.body.scrollHeight);
});

//KEY SEQUENCE TEST
///////////////////////////////////////////////////////////

socket.on("show counter1", (counter) => {
  countertag.innerHTML = "";
  let item = document.createElement("p");
  item.innerText = counter
  countertag.appendChild(item);

})

socket.on("move hero1", (counter) => {
  canvas = document.getElementById("canvasHolder");
  context = canvas.getContext("2d");
  hero = new GameObject(heroSpritesheet,  //the spritesheet image
      counter,            //x position of hero
      20,            //y position of hero
      864 ,         //total width of spritesheet image in pixels
      140,          //total height of spritesheet image in pixels
      60,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
      8);           //number of sprites in the spritesheet
  loop2();
})

socket.on("show hero1", counter => {
  canvas = document.getElementById("canvasHolder");
  context = canvas.getContext("2d");
  hero = new GameObject(heroSpritesheet,  //the spritesheet image
      counter,            //x position of hero
      20,            //y position of hero
      864 ,         //total width of spritesheet image in pixels
      140,          //total height of spritesheet image in pixels
      600000,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
      8);           //number of sprites in the spritesheet
  loop2();
})

socket.on("show counter2", (counter) => {
  countertag2.innerHTML = "";
  let item = document.createElement("p");
  item.innerText = counter
  countertag2.appendChild(item);

})

socket.on("move hero2", (counter) => {
  canvas = document.getElementById("canvasHolder");
  hero2 = new GameObject(heroSpritesheet2,  //the spritesheet image
    counter,            //x position of hero
    160,            //y position of hero
    1000 ,         //total width of spritesheet image in pixels
    157,          //total height of spritesheet image in pixels
    60,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
     8);           //number of sprites in the spritesheet
loop2();
})

socket.on("show hero2", (counter) => {
  canvas = document.getElementById("canvasHolder");
  hero2 = new GameObject(heroSpritesheet2,  //the spritesheet image
    counter,            //x position of hero
    160,            //y position of hero
    1000 ,         //total width of spritesheet image in pixels
    157,          //total height of spritesheet image in pixels
    600000,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
     8);           //number of sprites in the spritesheet
loop2();
})

socket.on("stop hero1", (counter) => {
  canvas = document.getElementById("canvasHolder");
  context = canvas.getContext("2d");
  hero = new GameObject(heroSpritesheet,  //the spritesheet image
      counter,            //x position of hero
      20,            //y position of hero
      864 ,         //total width of spritesheet image in pixels
      140,          //total height of spritesheet image in pixels
      100000,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
      8);           //number of sprites in the spritesheet
  loop();
})

socket.on("stop hero2", (counter) => {
  canvas = document.getElementById("canvasHolder");
  hero2 = new GameObject(heroSpritesheet2,  //the spritesheet image
    counter,            //x position of hero
    160,            //y position of hero
    1000 ,         //total width of spritesheet image in pixels
    157,          //total height of spritesheet image in pixels
    100000,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
     8);           //number of sprites in the spritesheet
loop2();
} )


