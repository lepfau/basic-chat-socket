var canvas, context;

var hero;
var hero2;
var heroSpritesheet = new Image();

var heroSpritesheet2 = new Image();

heroSpritesheet.src = "./../assets/scottpilgrim.png";
heroSpritesheet2.src = "./../assets/ramonaflowers.png"

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

window.onload = () => {
canvas = document.getElementById("canvasHolder");
context = canvas.getContext("2d");
hero = new GameObject(heroSpritesheet,  //the spritesheet image
    counter1front,            //x position of hero
    200,            //y position of hero
    864 ,         //total width of spritesheet image in pixels
    140,          //total height of spritesheet image in pixels
    60,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
    8);           //number of sprites in the spritesheet

hero2 = new GameObject(heroSpritesheet2,  //the spritesheet image
    counter2front,            //x position of hero
    225,            //y position of hero
    1000 ,         //total width of spritesheet image in pixels
    157,          //total height of spritesheet image in pixels
    60,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
     8);           //number of sprites in the spritesheet

stopHero()
}


var typingTimer;                //timer identifier
var doneTypingInterval = 300;  //time in ms, 5 second for example


gameinput.addEventListener("input", () => {
    if (gameinput.value === "xc" && team1.checked && countdown.innerHTML === "GO !") {
        gameinput.value = "";
        socket.emit("increase counter1")
        socket.emit("sync counter1", counter1front)
        socket.emit("move hero1", counter1front)
        socket.emit("sync counter2", counter2front)
    }

    else if (gameinput.value === "xc" && team2.checked && countdown.innerHTML === "GO !") {
        gameinput.value = "";
        socket.emit("increase counter2")
        socket.emit("sync counter1", counter1front)
        socket.emit("sync counter2", counter2front)
        socket.emit("move hero2", counter2front)
    }

    else if (gameinput.value.length >= 3) gameinput.value = ""
    else if (team1.checked && gameinput.value === "") socket.emit("stop hero1", counter1front);
    else if (team2.checked && gameinput.value === "") socket.emit("stop hero2", counter2front);

})

gameinput.addEventListener('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

function doneTyping() {
    if (team1.checked) socket.emit("stop hero1", counter1front);
    if (team2.checked) socket.emit("stop hero2", counter2front);
}


