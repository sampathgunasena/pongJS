const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

//darwing a rectangle
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}


//drawing a circle
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.closePath();
    context.fill();
}

//drawing text
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text, x, y);
}

//giving movement
let rectX = 0;
function renderbox() {
    drawRect(0, 0, 600, 400, "black");
    drawRect(rectX, 100, 100, 100, "red");
    rectX += 100;
}
//setInterval(renderbox, 1000);


//creating paddles
const user = {
    x: 0,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "white",
    score: 0
}

const com = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "white",
    score: 0
}



//drawing midline
const net = {
    width: 2,
    height: 10,
    color: "white",
    x: canvas.width / 2 - 1,
    y: 0
}

function drawNet() {
    for(let i = 0; i < canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    };
};



//draw the ball
const ball = {
    radius: 10,
    color: "white",
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 5,
    velocityX: 5,
    velocityY: 5
}



let i = 1;
open = setInterval(init, 800);



//rendering the game
function render() {

    drawRect(0, 0, 600, 400, "black");
    drawRect(user.x, user.y, user.width,  user.height, user.color);
    drawRect(com.x, com.y, com.width,  com.height, com.color);
    drawNet();
    drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "white");
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    
    
}


function game() {
    update(); //movements, collision detection, score update
    render();
 
}

const fps = 50;
function setRender() {
    setInterval(game, 1000 / fps);
}

setTimeout(setRender, 3300);



//controlling user paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}



//detect collision
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top
}

//moving the ball
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }
    /* if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.velocityX = -ball.velocityX;
    } */

    //simple AI to control com paddle
    let comLevel = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * comLevel;

    let player = (ball.x < canvas.width / 2) ? user : com;
    if(collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2)) / player.height * 2;
        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }

    if(ball.x  - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
}




//reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX
}


function init() {
    drawRect(0, 0, 600, 400, "black");
    drawRect(user.x, user.y, user.width,  user.height, user.color);
    drawRect(com.x, com.y, com.width,  com.height, com.color);
    drawText(`Get ready . . . ${i}`, 180, 200, "white");
    i++
    if (i > 3) {
        clearInterval(open);
    }
    
}

