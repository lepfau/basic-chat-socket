
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

let userList = [];
let team1list = [];
let team2list = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", `${username.value} dit: ${input.value}`);
    input.value = "";
  }
});

form1.addEventListener("submit", function (e) {
  e.preventDefault();
  if (username.value && username.value !== " ") {
    form1.style.visibility = "hidden";
    fullcontainer.style.display = "block"
    if (team1.checked) socket.emit("choose team", { username: username.value, teamnumber: team1.value });
    else socket.emit("choose team", { username: username.value, teamnumber: team2.value })
    socket.emit("add user", username.value);
    socket.emit("new user", username.value);
    socket.emit("user list", userList);
    socket.emit("team1 list", team1list)
    socket.emit("team2 list", team2list)
  }
});


input.addEventListener("input", function () {
  socket.emit("user typing", `${username.value} is typing...`);
});

socket.on("chat message", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  yo.innerHTML = "";
});

socket.on("user typing", function (typi) {
  yo.innerHTML = typi;
});

socket.on("user list", function (userlistfromback) {
  userslisting.innerHTML = "";
  var items = userslisting.getElementsByTagName("li");
  userlistfromback.forEach((el) => {
    var item = document.createElement("li");
    item.textContent = el;
    userslisting.appendChild(item);
  });
});

socket.on("team1 list", function (team1listfromback) {
  team1listing.innerHTML = "";
  team1listfromback.forEach(el => {
    var item = document.createElement("li");
    item.textContent = el;
    team1listing.appendChild(item)
  })
})

socket.on("team2 list", function (team2listfromback) {
  team2listing.innerHTML = "";
  team2listfromback.forEach(el => {
    var item = document.createElement("li");
    item.textContent = el;
    team2listing.appendChild(item)
  })
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
  window.scrollTo(0, document.body.scrollHeight);
});


