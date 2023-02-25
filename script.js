const settings = {
    gameSizeX:20,
    gameSizeY:20,
    cellSize:20,
}
let direction = 'up';
let directionChanged = false;
let foodPos = [0,0];
const snake = [[5,5],[5,6],[5,7]];
const gameFrame = document.querySelector('#game');
const score = document.querySelector('#score span');
const btnStart = document.querySelector('#btn-start');
const gameOverPopup = document.querySelector('#game-over');


const gameWrap = document.querySelector('#game-wrap');
gameWrap.style.width = `${settings.gameSizeX*settings.cellSize}px`;

let gameInterval;

const gameFragment = new DocumentFragment();

function renderLevel(gameSizeX, gameSizeY, cellSize){
    gameFrame.style.width = `${gameSizeX*cellSize}px`;
    gameFrame.style.height = `${gameSizeY*cellSize}px`;
}
renderLevel(settings.gameSizeX, settings.gameSizeY, settings.cellSize);

btnStart.addEventListener('click', runGame);

function runGame(){
    window.addEventListener('keydown', setDirection);
    btnStart.classList.add('hidden');
    randomizeFoodPosition();
    createFood();
    renderSnake();
    gameInterval = setInterval(renderSnake, 300);
}

function setDirection(event) {

    switch (event.key) {
        case 'ArrowLeft':
            if ((direction==='up'|| direction==='down') && directionChanged === false){
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if ((direction==='up'|| direction==='down') && directionChanged === false){
                direction = 'right';
            }
            break;
        case 'ArrowUp':
            if ((direction==='left'|| direction==='right') && directionChanged === false){
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if ((direction==='left'|| direction==='right') && directionChanged === false){
                direction = 'down';
            }
            break;
    }
    directionChanged = true;
}

function renderSnake(){
    directionChanged = false;

    // add first item to array
    let newY = 0;
    let newX = 0;
    switch (direction) {
        case 'up':
            newY = snake[0][1] === 0 ? settings.gameSizeY - 1 : snake[0][1]-1;
            snake.unshift([snake[0][0],newY]);
            break;
        case 'down':
            newY = snake[0][1] === settings.gameSizeY-1 ? 0 : snake[0][1]+1;
            snake.unshift([snake[0][0],newY]);
            break;
        case 'left':
            newX = snake[0][0] === 0 ? settings.gameSizeX - 1 : snake[0][0]-1;
            snake.unshift([newX,snake[0][1]]);
            break;
        case 'right':
            newX = snake[0][0] === settings.gameSizeX-1  ? 0 : snake[0][0]+1;
            snake.unshift([newX,snake[0][1]]);
            break;
    }

    // game over condition
    for (let i = 1; i < snake.length; i++) {
        if (snake[i][0] === snake[0][0] && snake[i][1] === snake[0][1]) {
            gameOver();
        }
    }

    if (snake[0][0] === foodPos[0] && snake[0][1] === foodPos[1]){
        // eat food
        score.innerText = Number(score.innerText) + 1;
        console.log(score.innerText);
        randomizeFoodPosition();
        createFood();
    }
    else{
        // remove last item from array
        snake.splice(-1);
        createFood();
    }


    for (let i = 0; i < snake.length; i++){
        let snakePart = document.createElement("div");
        if (i === 0){
            snakePart.classList.add('snake-part','head');
        }
        else {
            snakePart.classList.add('snake-part','tail');
        }
        snakePart.style.width = `${settings.cellSize}px`;
        snakePart.style.height = `${settings.cellSize}px`;
        snakePart.style.left = `${snake[i][0]*settings.cellSize}px`;
        snakePart.style.top = `${snake[i][1]*settings.cellSize}px`;
        gameFragment.append(snakePart);
    }


    gameFrame.innerHTML = '';
    gameFrame.append(gameFragment);

    console.log(`Snake goes ${direction}`);
}

function createFood(){
    let food = document.createElement("div");
    food.classList.add('food');
    food.style.width = `${settings.cellSize}px`;
    food.style.height = `${settings.cellSize}px`;
    food.style.left = `${foodPos[0]*settings.cellSize}px`;
    food.style.top = `${foodPos[1]*settings.cellSize}px`;
    gameFragment.append(food);
}

function randomizeFoodPosition() {
    foodPos[0] = randomNumber(0, settings.gameSizeX);
    foodPos[1] = randomNumber(0, settings.gameSizeY);
}

function gameOver(){
    console.log('Game over');
    clearInterval(gameInterval);
    gameOverPopup.classList.remove('hidden');
}

//random number
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}