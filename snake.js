class Snake{
    constructor(x,y,size){
        this.x = x
        this.y=y
        this.size = size
        this.tail = [{x:this.x,y:this.y}]
        this.rotateX = 0
        this.rotateY = 1
    }

    move(){
        var newRect;
        if(this.rotateX == 1){
            newRect = {
                x: this.tail[this.tail.length -1].x + this.size,
                y: this.tail[this.tail.length-1].y
            }
        } else if(this.rotateX == -1){
            newRect = {
                x: this.tail[this.tail.length -1].x - this.size,
                y: this.tail[this.tail.length-1].y
            }
        } else if(this.rotateY == 1){
            newRect = {
                x: this.tail[this.tail.length -1].x,
                y: this.tail[this.tail.length-1].y + this.size
            }
        } else if(this.rotateY == -1){
            newRect = {
                x: this.tail[this.tail.length -1].x,
                y: this.tail[this.tail.length-1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)
    }
}

class Apple{
    constructor(){
        var isTouching;
        while(true){
            isTouching = false;
            this.x = Math.floor(Math.random()*canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random()*canvas.height / snake.size) * snake.size
            for(var i = 0; i<snake.tail.length;i++){
                if(this.x == snake.tail[i].x && this.y == snake.tail[i].y){
                    isTouching= true;
                }
            }
            this.size = snake.size
            this.color = "red"
            if(!isTouching){
                break;
            }
        }
    }
}


var canvas = document.getElementById("canvas")

var snake = new Snake(50,50,50);

var apple = new Apple();

var canvasContext = canvas.getContext('2d');

var x;

var pauseControl = 0;

var gameSpeed = 5;

window.onload = () =>{
    gameLoop();
}

function gameLoop(){
    x = setInterval(show, 1000/5)
}

function show(){
    update();
    draw();
}

function update(){
    canvasContext.clearRect(0,0,canvas.width,canvas.height)
    snake.move()
    eatApple()
    checkEatItself();
    checkHitWall();
    
}

function eatApple(){
    if(snake.tail[snake.tail.length-1].x == apple.x && snake.tail[snake.tail.length-1].y == apple.y){
        snake.tail[snake.tail.length] = {x:apple.x, y: apple.y}
        apple = new Apple();
        x = clearInterval(x)
        x = setInterval(show, 1000/++gameSpeed)
    }
}

function checkEatItself(){
    for(var i = 0; i<snake.tail.length-2;i++){
        if(snake.tail[snake.tail.length-1].x==snake.tail[i].x && snake.tail[snake.tail.length-1].y==snake.tail[i].y){
            alert("You ate yourself! your high score was " + score.value);
            newGameButton();
        }
    }
}

function checkHitWall(){
    var headTail = snake.tail[snake.tail.length-1]
    if(headTail.x == -snake.size){
        headTail.x = canvas.width - snake.size
    }else if(headTail.x == canvas.width){
        headTail.x = 0
    } else if(headTail.y == -snake.size){
        headTail.y = canvas.height - snake.size
    }else if(headTail.y == canvas.height){
        headTail.y = 0
    }
}
function draw(){
    canvasBackground();
    for(var i = 0; i< snake.tail.length;i++){
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5, snake.size - 5, snake.size -5, 'green')
    }

    score.value = snake.tail.length-1
    createRect(apple.x,apple.y,apple.size,apple.size,apple.color)

}

function canvasBackground(){
    for(var i = 0; i<24;i++){
        for(var x = 0; x<24;x++){
            if(i%2==x%2){
                canvasContext.fillStyle = "white"
                canvasContext.fillRect(50*i,50*x,50,50);
            }else{
                canvasContext.fillStyle = "yellow"
                canvasContext.fillRect(50*i,50*x,50,50);
            }
        }
    }
}

function createRect(x,y,width,height,color){
    canvasContext.fillStyle = color
    canvasContext.fillRect(x,y,width,height)
}

window.addEventListener("keydown", (event) => {
    setTimeout(()=>{
        if(event.keyCode == 37 && snake.rotateX != 1){
            snake.rotateX = -1;
            snake.rotateY = 0;
        }else if(event.keyCode == 38 && snake.rotateY != 1){
            snake.rotateX = 0;
            snake.rotateY = -1;
        } else if(event.keyCode == 39 && snake.rotateX != -1){
            snake.rotateX = 1;
            snake.rotateY = 0;
        }else if(event.keyCode == 40 && snake.rotateY != -1){
            snake.rotateX = 0;
            snake.rotateY = 1;
        }
    },1)
})

// finger swipes

let touchStartX = 0
let touchEndX = 0
let touchStartY = 0
let touchEndY = 0
    
function checkDirection() {
    if(touchEndX-touchStartX > 0 && Math.abs(touchEndX-touchStartX) > Math.abs(touchEndY-touchStartY)){
        //swiped right
        snake.rotateX = 1;
        snake.rotateY = 0;
    }else if(touchEndX-touchStartX < 0 && Math.abs(touchEndX-touchStartX) > Math.abs(touchEndY-touchStartY)){
        //swiped left
        snake.rotateX = -1;
        snake.rotateY = 0;
    }else if(touchEndY-touchStartY > 0 && Math.abs(touchEndX-touchStartX) < Math.abs(touchEndY-touchStartY)){
        //swiped down
        snake.rotateX = 0;
        snake.rotateY = 1;
    }else if(touchEndY-touchStartY < 0 && Math.abs(touchEndX-touchStartX) < Math.abs(touchEndY-touchStartY)){
        //swiped up
        snake.rotateX = 0;
        snake.rotateY = -1;
    }
}

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  touchStartX = e.changedTouches[0].screenX
  touchStartY = e.changedTouches[0].screenY
})

canvas.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX
  touchEndY = e.changedTouches[0].screenY
  checkDirection()
})

//buttons

function newGameButton(){
    while(snake.tail.length-1!=0){
        snake.tail.pop()
    }
    x = clearInterval(x);
    x=setInterval(show, 1000/5)
    gameSpeed=5;
    apple = new Apple();
}

function pauseButton(){

    if(pauseControl==0){
        x = clearInterval(x)
        pauseControl = 1;
    }else{
        x = setInterval(show,1000/5)
        pauseControl = 0;
    }

}
