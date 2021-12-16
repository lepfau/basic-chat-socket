

chatform.addEventListener("submit", function (e) {
    e.preventDefault();
    if (chatinput.value) {
      socket.emit("chat message", `${username.value}: ${chatinput.value}`);
      chatinput.value = "";
    }
  });

  chatinput.addEventListener("input", function () {
    socket.emit("user typing", `${username.value} is typing...`);
  });

  socket.on("chat message", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight)
    istyping.innerHTML = "";
  });

  socket.on("user typing", function (typi) {
    istyping.innerHTML = typi;
  });
  