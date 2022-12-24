const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");
gameBoard.height = gameBoard.width / 1.78; // 16:9 ratio
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "rgb(6, 73, 45)"; // green
//const boardBackground = "rgb(176, 104, 53)"; // brown

const paddle1Color = "lightblue";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const ballRadius = gameWidth / 40;
const paddleSpeed = gameHeight / 10;

let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;

let paddle1 = {
    width: gameWidth / 30,
    height: gameHeight / 5,
    x: 0,
    y: 0,
};

let paddle2 = {
    width: gameWidth / 30,
    height: gameHeight / 5,
    x: gameWidth - gameWidth / 30,
    y: gameHeight - gameHeight / 5,
};

window.addEventListener("keydown", (e) => {
    if (startBtn.textContent == "Start" || startBtn.textContent == "Resume") {
        return;
    } else {
        changeDirection(e);
    }
});

startBtn.addEventListener("click", gameHandler);
resetBtn.addEventListener("click", resetGame);

clearBoard();
drawPaddles();
drawBall(ballX, ballY);

function gameHandler() {
    if (startBtn.textContent == "Start") {
        startBtn.textContent = "Pause";
        gameStart();
    } else if (startBtn.textContent == "Pause") {
        startBtn.textContent = "Resume";
        clearTimeout(intervalID);
    } else if (startBtn.textContent == "Resume") {
        startBtn.textContent = "Pause";
        nextTick();
    }
}

function gameStart() {
    createBall();
    nextTick();
}

/* routine */
function nextTick() {
    intervalID = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    }, 10);
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = gameWidth / 250;
    ctx.beginPath();
    ctx.moveTo(0, gameHeight / 8);
    ctx.lineTo(gameWidth, gameHeight / 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, gameHeight - gameHeight / 8);
    ctx.lineTo(gameWidth, gameHeight - gameHeight / 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gameWidth / 4, gameHeight / 8);
    ctx.lineTo(gameWidth / 4, gameHeight - gameHeight / 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gameWidth - gameWidth / 4, gameHeight / 8);
    ctx.lineTo(gameWidth - gameWidth / 4, gameHeight - gameHeight / 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gameWidth / 4, gameHeight / 2);
    ctx.lineTo(gameWidth - gameWidth / 4, gameHeight / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = "black";
    ctx.moveTo(gameWidth / 2, gameHeight);
    ctx.lineTo(gameWidth / 2, gameHeight - gameHeight);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawPaddles() {
    ctx.strokeStyle = paddleBorder;
    ctx.fillStyle = paddle1Color;
    ctx.lineWidth = gameWidth / 250;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
    ballSpeed = 1;
    if (Math.round(Math.random()) == 1) {
        ballXDirection = 1;
    } else {
        ballXDirection = -1;
    }
    if (Math.round(Math.random()) == 1) {
        ballYDirection = Math.random() * 1;
    } else {
        ballYDirection = Math.random() * -1;
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
}

function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
}

function drawBall(ballX, ballY) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = gameHeight / 250;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
        ballX + ballRadius - gameWidth / 25,
        ballY - ballRadius + gameHeight / 80
    );
    ctx.lineTo(ballX - ballRadius + gameWidth / 62.5, ballY + ballRadius);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
        ballX + ballRadius - gameWidth / 100,
        ballY + ballRadius - gameHeight / 80
    );
    ctx.lineTo(ballX - ballRadius + gameWidth / 30, ballY - ballRadius);
    ctx.stroke();
}

function checkCollision() {
    if (ballY <= 0 + ballRadius || ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }
    if (ballX <= 0) {
        player2Score += 1;
        updateScore();
        createBall();
        return;
    }
    if (ballX >= gameWidth) {
        player1Score += 1;
        updateScore();
        createBall();
        return;
    }
    if (ballX <= paddle1.x + paddle1.width + ballRadius) {
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            ballX = paddle1.x + paddle1.width + ballRadius; // if ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
    if (ballX >= paddle2.x - ballRadius) {
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            ballX = paddle2.x - ballRadius; // if ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
}
function changeDirection(event) {
    const keyPressed = event.keyCode;
    //console.log(keyPressed);
    const paddle1Up = 37; // <-
    const paddle1Down = 39; // ->
    const paddle2Up = 38; // up
    const paddle2Down = 40; // down
    switch (keyPressed) {
        case paddle1Up:
            if (paddle1.y > 0) {
                paddle1.y -= paddleSpeed;
            }
            break;
        case paddle1Down:
            if (paddle1.y < gameHeight - paddle1.height) {
                paddle1.y += paddleSpeed;
            }
            break;
        case paddle2Up:
            if (paddle2.y > 0) {
                paddle2.y -= paddleSpeed;
            }
            break;
        case paddle2Down:
            if (paddle2.y < gameHeight - paddle2.height) {
                paddle2.y += paddleSpeed;
            }
            break;
    }
}

function updateScore() {
    scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    paddle1 = { width: gameWidth / 30, height: gameHeight / 5, x: 0, y: 0 };
    paddle2 = {
        width: gameWidth / 30,
        height: gameHeight / 5,
        x: gameWidth - gameWidth / 30,
        y: gameHeight - gameHeight / 5,
    };
    ballSpeed = 1;
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    startBtn.textContent = "Start";
    clearBoard();
    drawPaddles();
    drawBall(ballX, ballY);
}
