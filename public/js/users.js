let userList = [];
let team1list = [];
let team2list = [];

socket.emit("sync user list", userList);


team1.addEventListener("click", function () {
    team2.checked = false
  })
  
  team2.addEventListener("click", function () {
    team1.checked = false
  })

userform.addEventListener("submit", function (e) {
    e.preventDefault();
    socket.emit("join room", roomnamefront.value);
    
    if ((username.value && username.value !== " ") && (team1.checked || team2.checked)) {
  
      if (team1.checked) {
        socket.emit("add user", { username: username.value, teamnumber: team1.value });
    }
    else if (team2.checked) {
        socket.emit("add user", { username: username.value, teamnumber: team2.value })
    }
        userform.style.visibility = "hidden";
        maintitle.style.visibility = "hidden";
        homepage.style.visibility = "hidden";
        canvasHolder.style.visibility = "visible";
        fullchatcontainer.style.display = "block";
        document.getElementById("game_container").style.visibility = "visible"
        socket.emit("new user", username.value);
         socket.emit("sync team1 list", team1list)
        socket.emit("sync team2 list", team2list)
        socket.emit("sync counter1", counter1front)
        socket.emit("stop hero1", counter1front)
        socket.emit("sync counter2", counter2front)
        socket.emit("stop hero2", counter2front)
    }
  
    else if (!username.value) {
        document.getElementById("error_username").innerHTML = "please submit username"
        setTimeout(() => {
            document.getElementById("error_username").innerHTML = ""
        }, 2000);
    }
 

    else if(!roomnamefront.value) {
      document.getElementById("error_username").innerHTML = "please enter a room name"
      setTimeout(() => {
          document.getElementById("error_username").innerHTML = ""
      }, 2000);
    }

    else if(!team1.checked || !team2.checked) {
      document.getElementById("error_username").innerHTML = "please choose a team"
      setTimeout(() => {
          document.getElementById("error_username").innerHTML = ""
      }, 2000);
  }
  });


socket.on("new user", function (username) {
    var item = document.createElement("li");
    item.textContent = username;
    messages.appendChild(item);
    socket.emit("sync user list", userList);
    socket.emit("sync team1 list", team1list)
    socket.emit("sync team2 list", team2list)
    messages.scrollTo(0, messages.scrollHeight)
  });

socket.on("sync user list", function (userlistfromback) {
    userslisting.innerHTML = "";
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

  socket.on("sync team1 list", function (team1listfromback) {
    team1listing.innerHTML = "";
    team1listfromback.forEach(el => {
      var item = document.createElement("li");
      item.textContent = el;
      team1listing.appendChild(item)
        })
        team1number.innerHTML = team1listfromback.length;
  })
  
  socket.on("sync team2 list", function (team2listfromback) {
    team2listing.innerHTML = "";
    team2listfromback.forEach(el => {
      var item = document.createElement("li");
      item.textContent = el;
      team2listing.appendChild(item)
    })
    team2number.innerHTML = team2listfromback.length;
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

  socket.on("filtered user", (users) => {
    userslisting.innerHTML = "";
    var items = userslisting.getElementsByTagName("li");
    users.forEach((el) => {
      var item = document.createElement("li");
      item.textContent = el;
      userslisting.appendChild(item);
    });
  })


  socket.on("disconnect", () => {
    socket.emit("filtered user", userList);
    socket.emit("filtered team1", team1list);
    socket.emit("filtered team2", team2list) 
  })
