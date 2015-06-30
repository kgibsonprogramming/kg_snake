var SNAKE = SNAKE || {};

SNAKE.setupSnake = function () {
    'use strict';
    //Create the DOM elements
    var head = document.head,
        styleElement = document.createElement("style"),
        board = document.createElement("div"),
        boardText = document.createElement("p"),
        gameStyle = ".snake_board{background:gainsboro;border: 20px outset red;min-height: 400px;height: 400px;min-width: 600px;width: 600px;position: relative;}\n";

    board.className = "snake_board";
    board.id = "snake_board";
    boardText.className = "snake_board_text";
    boardText.id = "snake_board_text";
    
    gameStyle = gameStyle.concat(".snake_board_text{padding:auto;text-align:center;color:#ff0000;}\n");
    gameStyle = gameStyle.concat(".snakePiece{background: #00ff00;min-height: 10px;min-width: 10px;height: 10px;width: 10px;position: absolute;}\n");
    gameStyle = gameStyle.concat(".snakeFood{position: absolute;min-height: 10px;min-width: 10px;height: 10px;width: 10px;background: #ff00ff;}\n");
    
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = gameStyle;
    } else {
        styleElement.appendChild(document.createTextNode(gameStyle));
    }
    
    head.appendChild(styleElement);
    board.appendChild(boardText);
    document.body.appendChild(board);
    
    
    //
    this.gameSettings.snakeBoard = document.getElementById("snake_board");
    this.gameSettings.snakeText = document.getElementById("snake_board_text");


    this.gameSettings.snakeText.innerHTML = this.gameSettings.INTRO_MESSAGE;
    if (window.addEventListener) {
        window.addEventListener('keydown', this.processKeyPress.bind(this));
    } else if (window.attachEvent) {
        window.attachEvent('keydown', this.processKeyPress.bind(this));
    }
};

SNAKE.gameSettings = {
    gameLoop         : undefined,
    gameSpeed        : 100,
    tileSize         : 10,
    snakeLength      : 1,
    headX            : 100,
    headY            : 100,
    foodX            : 0,
    foodY            : 0,
    moveDirection    : 'r',
    directionChanged : false,
    score            : 0,
    snakeBoard       : undefined,
    snakeText        : undefined,
    scoreText        : '',
    boardHeight      : 400,
    boardWidth       : 600,
    isDead           : false,
    isPaused         : true,
    snakePieces      : [],
    foodPiece        : document.createElement('div'),
    PAUSE_MESSAGE    : "Press 'P' to continue, or space to restart",
    INTRO_MESSAGE    : "Movement: W/S/A/D<br/>Pause: P<br/>Start/Restart: Space"
};

SNAKE.createPiece = function () {
    'use strict';
    var newPiece = document.createElement('div');
    newPiece.className = 'snakePiece';
    newPiece.id = 'sp' + this.gameSettings.snakePieces.length;
    newPiece.setAttribute("style", "top: " + this.gameSettings.headY + "px; left: " + this.gameSettings.headX + "px;");
    this.gameSettings.snakePieces.unshift(newPiece.id);

    return newPiece;
};

SNAKE.createFood = function () {
    'use strict';
    var isValidPosition = false;
    while (!isValidPosition) {
        this.gameSettings.foodX = Math.floor((Math.random() * this.gameSettings.boardWidth));
        this.gameSettings.foodY = Math.floor((Math.random() * this.gameSettings.boardHeight));
        this.gameSettings.foodX -= this.gameSettings.foodX % 10;
        this.gameSettings.foodY -= this.gameSettings.foodY % 10;
        if (!this.isSnakeCollision(this.gameSettings.foodX, this.gameSettings.foodY)) {
            isValidPosition = true;
        }
    }

    this.gameSettings.foodPiece.setAttribute("style", "top: " + this.gameSettings.foodY + "px; left: " + this.gameSettings.foodX + "px;");
    this.gameSettings.snakeBoard.appendChild(this.gameSettings.foodPiece);
};

SNAKE.startGame = function () {
    'use strict';
    var i;
    clearInterval(this.gameSettings.gameLoop);
    this.gameSettings.score = 0;
    this.gameSettings.headX = 100;
    this.gameSettings.headY = 100;
    //Remove all previous pieces
    for (i = 0; i < this.gameSettings.snakePieces.length; i += 1) {
        this.gameSettings.snakeBoard.removeChild(document.getElementById(this.gameSettings.snakePieces[i]));
    }
    this.gameSettings.snakePieces = [];
    this.gameSettings.snakeLength = 1;
    this.gameSettings.snakeBoard.appendChild(this.createPiece());
    this.gameSettings.foodPiece.className = "snakeFood";
    this.gameSettings.foodPiece.id = "snakeFood";
    this.createFood();
    this.gameSettings.isDead = false;
    this.gameSettings.isPaused = false;
    this.gameSettings.scoreText = "Score: " + this.gameSettings.score.toString();
    this.gameSettings.snakeText.innerHTML = this.gameSettings.scoreText;
    this.gameSettings.gameLoop = setInterval(this.gameLoop.bind(this), this.gameSettings.gameSpeed);
};

SNAKE.processPause = function () {
    'use strict';
    if (!this.gameSettings.isDead) {
        if (!this.gameSettings.isPaused) {
            clearInterval(this.gameSettings.gameLoop);
            this.gameSettings.snakeText.innerHTML = SNAKE.gameSettings.PAUSE_MESSAGE;
            this.gameSettings.isPaused = true;
        } else {
            this.gameSettings.gameLoop = setInterval(this.gameLoop.bind(this), this.gameSettings.gameSpeed);
            this.gameSettings.snakeText.innerHTML = this.gameSettings.scoreText;
            this.gameSettings.isPaused = false;
        }
    }
};

SNAKE.processFood = function () {
    'use strict';
    this.gameSettings.score += 5;
    this.gameSettings.snakeLength += 1;
    this.gameSettings.snakeBoard.removeChild(document.getElementById("snakeFood"));
    this.gameSettings.scoreText = "Score: " + this.gameSettings.score.toString();
    this.gameSettings.snakeText.innerHTML = this.gameSettings.scoreText;
    this.createFood();
};

SNAKE.processDeath = function () {
    'use strict';
    this.gameSettings.isDead = true;
    clearInterval(this.gameSettings.gameLoop);
    this.gameSettings.snakeText.innerHTML = this.gameSettings.scoreText + ",<br/>Press space to play again";
};

SNAKE.isSnakeCollision = function (x, y) {
    'use strict';
    var i,
        snakePiece;
    if (this.gameSettings.snakeLength > 1) {
        for (i = 0; i < this.gameSettings.snakePieces.length; i += 1) {
            snakePiece = document.getElementById('sp' + i);
            if (this.gameSettings.snakePieces.indexOf(snakePiece.id) !== 0) {
                if (String(x + "px") === snakePiece.style.left && String(y + "px") === snakePiece.style.top) {
                    return true;
                }
            }
        }
    }
    return false;
};

SNAKE.collision = function () {
    'use strict';
    if (this.isSnakeCollision(this.gameSettings.headX, this.gameSettings.headY)) {
        this.processDeath();
        return;
    }

    if (this.gameSettings.headX < 0 ||
            this.gameSettings.headX >= this.gameSettings.boardWidth ||
            this.gameSettings.headY < 0 ||
            this.gameSettings.headY >= this.gameSettings.boardHeight) {
        this.processDeath();
        return;
    }

    if (this.gameSettings.headX === this.gameSettings.foodX && this.gameSettings.headY === this.gameSettings.foodY) {
        this.processFood();
    }
};

SNAKE.move = function () {
    'use strict';
    var snakeId;

    switch (this.gameSettings.moveDirection) {
    case 'u':
        this.gameSettings.headY -= this.gameSettings.tileSize;
        break;
    case 'd':
        this.gameSettings.headY += this.gameSettings.tileSize;
        break;
    case 'l':
        this.gameSettings.headX -= this.gameSettings.tileSize;
        break;
    case 'r':
        this.gameSettings.headX += this.gameSettings.tileSize;
        break;
    default:
    }

    if (this.gameSettings.snakePieces.length < this.gameSettings.snakeLength) {
        this.gameSettings.snakeBoard.appendChild(this.createPiece());
    } else {
        //Grab the last one and make him the first one
        snakeId = this.gameSettings.snakePieces.pop();
        document.getElementById(snakeId).setAttribute("style", "top: " + this.gameSettings.headY + "px; left: " + this.gameSettings.headX + "px;");
        this.gameSettings.snakePieces.unshift(snakeId);
    }
    this.gameSettings.directionChanged = false;
};

SNAKE.processKeyPress = function (evt) {
    'use strict';
    var event = window.event || evt;
    if (!this.gameSettings.directionChanged || this.gameSettings.isDead) {
        switch (event.keyCode) {
        case 65: //A key - Left
            if (this.gameSettings.moveDirection !== 'r') {
                this.gameSettings.moveDirection = 'l';
                this.gameSettings.directionChanged = true;
            }
            break;
        case 87: //W key - Up
            if (this.gameSettings.moveDirection !== 'd') {
                this.gameSettings.moveDirection = 'u';
                this.gameSettings.directionChanged = true;
            }
            break;
        case 68: //D key - Right
            if (this.gameSettings.moveDirection !== 'l') {
                this.gameSettings.moveDirection = 'r';
                this.gameSettings.directionChanged = true;
            }
            break;
        case 83: //S key - Down
            if (this.gameSettings.moveDirection !== 'u') {
                this.gameSettings.moveDirection = 'd';
                this.gameSettings.directionChanged = true;
            }
            break;
        case 80: //P
            this.processPause();
            break;
        case 32: //Space
            this.startGame();
            break;
        default:
        }
    }
};

SNAKE.gameLoop = function () {
    'use strict';
    this.move();
    this.collision();
};