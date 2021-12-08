var canvas, context;

var hero;
var heroSpritesheet = new Image();
heroSpritesheet.src = "./js/heroSpritesheet.png"; 


window.onload = function() {
    canvas = document.getElementById("canvasHolder");
    context = canvas.getContext("2d");
    hero = new GameObject(heroSpritesheet,  //the spritesheet image
        counter1front,            //x position of hero
        0,            //y position of hero
        1536 ,         //total width of spritesheet image in pixels
        256,          //total height of spritesheet image in pixels
        90,           //time(in ms) duration between each frame change (experiment with it to get faster or slower animation)
        6);           //number of sprites in the spritesheet
    loop();
}


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
    this.update = function() {
        if(Date.now() - this.lastUpdate >= this.timePerFrame) {
            this.frameIndex++;
            if(this.frameIndex >= this.numberOfFrames) {
                this.frameIndex = 0;
            }
            this.lastUpdate = Date.now();
        }
    }

    //to draw on the canvas, parameter is the context of the canvas to be drawn on
    this.draw = function(context) {
        context.drawImage(this.spritesheet,
                          this.frameIndex*this.width/this.numberOfFrames,
                          0,
                          this.width/this.numberOfFrames,
                          this.height,
                          x,
                          y,
                          this.width/this.numberOfFrames,
                          this.height);
    }
}




//The Game Loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

//update function to update all the GameObjects
function update() {
    hero.update();
}

//draw method for drawing everything on canvas
function draw() {
    context.clearRect(0,0,canvas.width, canvas.height);
    hero.draw(context);
}


inputtest.addEventListener("input", () => {
    if (inputtest.value === "xc" && team1.checked) {
      inputtest.value = "";
      socket.emit("counter1")
      socket.emit("show counter1", counter1front)
      socket.emit("show counter2", counter2front)

    }
    else if (inputtest.value === "xc" && team2.checked) {
      inputtest.value = "";
      socket.emit("counter2")
      socket.emit("show counter1", counter1front)
      socket.emit("show counter2", counter2front)
    }
  
    else if (inputtest.value.length >= 3) inputtest.value = ""
  
  })


  