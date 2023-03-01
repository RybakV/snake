const settings = {
    gameSizeX: 10,
    gameSizeY: 10,
    cellSize: 20,
    speed: 300,
}
let direction = 'right';
let directionChanged = false;
let foodPos = [0,0];
const snake = [[4,2],[3,2],[2,2]];
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
    btnStart.classList.add('hidden');
    // arrows event
    window.addEventListener('keydown', setDirection);
    // swipe events
    window.addEventListener('touchstart', touchStartCoordinates );
    window.addEventListener('touchend', touchEndCoordinates );


    randomizeFoodPosition();
    renderSnake();

    gameInterval = setInterval(renderSnake, settings.speed);
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

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;
function checkDirection() {
    let difX = touchstartX - touchendX;
    let difY = touchstartY - touchendY;
    if (Math.abs(difX) > 10 && Math.abs(difX) > Math.abs(difY)) {
        if (touchendX < touchstartX && direction !== 'right') {direction = 'left';}
        if (touchendX > touchstartX && direction !== 'left') {direction = 'right';}
    }
    if (Math.abs(difY) > 10 && Math.abs(difY) > Math.abs(difX) ) {
        if (touchendY < touchstartY && direction !== 'down') {direction = 'up';}
        if (touchendY > touchstartY && direction !== 'up') {direction = 'down';}
    }
    directionChanged = true;
}
function touchStartCoordinates(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}
function touchEndCoordinates(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    checkDirection();
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
        randomizeFoodPosition();
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

    //console.log(`Snake goes ${direction}`);
}

function createFood(){
    let food = document.createElement("div");
    food.classList.add('food');
    food.style.width = `${settings.cellSize}px`;
    food.style.height = `${settings.cellSize}px`;
    food.style.left = `${foodPos[0]*settings.cellSize}px`;
    food.style.top = `${foodPos[1]*settings.cellSize}px`;
    gameFragment.append(food);
    //console.log('food spawn ' + foodPos);
}

function randomizeFoodPosition() {
    const gameCells = []
    for (let y = 0; y<settings.gameSizeY; y++){
        for (let x = 0; x<settings.gameSizeX; x++){
            gameCells.push([x, y])
        }
    }
    console.log('snake' + snake);
    let indexes = [];
    snake.forEach(element => {
            let index = element[1]*settings.gameSizeX + element[0];
            indexes.push(index);
        });
    indexes.sort().reverse();
    console.log(indexes);

    indexes.forEach(element => {
        console.log('remove: ' + gameCells[element]);
        gameCells.splice(element, 1);
    });

    let newFoodCoordinates = gameCells[randomNumber(0, gameCells.length -1)];

    foodPos[0] = newFoodCoordinates[0];
    foodPos[1] = newFoodCoordinates[1];

    createFood();
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