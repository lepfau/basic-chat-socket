
      var fullcontainer = document.getElementById("full_container")
      var yo = document.getElementById("yo");
      var messages = document.getElementById("messages");
      var form = document.getElementById("form");
      var form1 = document.getElementById("form1");
      var input = document.getElementById("input");
      var username = document.getElementById("username");
      let userslisting = document.getElementById("users");
      let userList = [];
      let receivedList = [];

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

          socket.emit("add user", username.value);
          socket.emit("new user", username.value);
          socket.emit("user list", userList);
        }
      });

      // teamForm.addEventListener("submit", function (e) {
      //   e.preventDefault();
      //   socket.emit("choose team", username.value, "team1")
      
      // })

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

     socket.on("updated list", function (updatedlist) {
       userslisting.innerHTML = "";
       var items = userslisting.getElementsByTagName("li");
        updatedlist.forEach((el) => {
          var item = document.createElement("li");
          item.textContent = el;
          userslisting.appendChild(item);
        });
     })

     socket.on("disconnect", () => {
       socket.emit("updated list", userList)
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
        window.scrollTo(0, document.body.scrollHeight);
      });

      socket.on("choose team", function (user, team) {
        socket.emit(user, team)
      })

