var canvas, context;

var hero;
var heroSpritesheet = new Image();

var heroSpritesheet2 = new Image();

heroSpritesheet.src = "./js/scottpilgrim.png";
heroSpritesheet2.src = "./js/ramonaflowers.png"


//GameObject constructor
function GameObject(spritesheet, x, y, width, height, timePerFrame, numberOfFrames) {
    this.spritesheet = spritesheet;             //the spritesheet image
    this.x = x;                                 //the x coordinate of the object
    this.y = y;                                 //the y coordinate of the object
    this.width = width;                         //width of spritesheet
    this.height = height;                       //height of spritesheet
    this.timePerFrame = timePerFrame;           //time in(ms) given to each frame
    this.numberOfFrames = numberOfFrames || 1;  //number of frames(sprites) in the spritesheet, default 1

    //current frame index pointer
    this.frameIndex = 0;

    //time the frame index was last updated
    this.lastUpdate = Date.now();

    //to update
    this.update = function () {
        if (Date.now() - this.lastUpdate >= this.timePerFrame) {
            this.frameIndex++;
            if (this.frameIndex >= this.numberOfFrames) {
                this.frameIndex = 0;
            }
            this.lastUpdate = Date.now();
        }
    }

    //to draw on the canvas, parameter is the context of the canvas to be drawn on
    this.draw = function (context) {
        context.drawImage(this.spritesheet,
            this.frameIndex * this.width / this.numberOfFrames,
            0,
            this.width / this.numberOfFrames,
            this.height,
            x,
            y,
            this.width / this.numberOfFrames,
            this.height);
    }
}


//The Game Loop
function stopHero() {
    draw();
}

function loop2() {
    update();
    draw();
    requestAnimationFrame(loop2);
}

//update function to update all the GameObjects
function update() {
    hero.update();
    hero2.update()
}

//draw method for drawing everything on canvas
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    hero.draw(context);
    hero2.draw(context)
}


var typingTimer;                //timer identifier
var doneTypingInterval = 300;  //time in ms, 5 second for example


inputtest.addEventListener("input", () => {
    if (inputtest.value === "xc" && team1.checked && countdown.innerHTML === "GO !") {
        inputtest.value = "";
        socket.emit("increase counter1")
        socket.emit("sync counter1", counter1front)
        socket.emit("move hero1", counter1front)
        socket.emit("sync counter2", counter2front)
    }

    else if (inputtest.value === "xc" && team2.checked && countdown.innerHTML === "GO !") {
        inputtest.value = "";
        socket.emit("increase counter2")
        socket.emit("sync counter1", counter1front)
        socket.emit("sync counter2", counter2front)
        socket.emit("move hero2", counter2front)
    }

    else if (inputtest.value.length >= 3) inputtest.value = ""

    else if (team1.checked && inputtest.value === "") socket.emit("stop hero1", counter1front);
    else if (team2.checked && inputtest.value === "") socket.emit("stop hero2", counter2front);

})


inputtest.addEventListener('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

function doneTyping() {
    if (team1.checked) socket.emit("stop hero1", counter1front);
    if (team2.checked) socket.emit("stop hero2", counter2front);

}


