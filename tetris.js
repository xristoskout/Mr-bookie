const canvas = document.getElementById('tetrisCanvas');
const context = canvas.getContext('2d');
const scale = 30; // Size of each block in pixels

const boardWidth = canvas.width / scale;
const boardHeight = canvas.height / scale;

// Create an empty game board (2D array)
let board = [];
for (let r = 0; r < boardHeight; r++) {
    board[r] = [];
    for (let c = 0; c < boardWidth; c++) {
        board[r][c] = 0; // 0 represents an empty cell
    }
}

// Define Tetromino shapes and their colors
const tetrominoes = {
    'I': {
        shape: [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        color: 'cyan'
    },
    'L': {
        shape: [
            [0,1,0],
            [0,1,0],
            [0,1,1]
        ],
        color: 'orange'
    },
    'J': {
        shape: [
            [0,1,0],
            [0,1,0],
            [1,1,0]
        ],
        color: 'blue'
    },
    'O': {
        shape: [
            [1,1],
            [1,1]
        ],
        color: 'yellow'
    },
    'S': {
        shape: [
            [0,1,1],
            [1,1,0],
            [0,0,0]
        ],
        color: 'green'
    },
    'T': {
        shape: [
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ],
        color: 'purple'
    },
    'Z': {
        shape: [
            [1,1,0],
            [0,1,1],
            [0,0,0]
        ],
        color: 'red'
    }
};

let currentPiece = null;
let currentX = 0;
let currentY = 0;

// Function to draw a single block
function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * scale, y * scale, scale, scale);
    context.strokeStyle = '#333'; // Block border
    context.strokeRect(x * scale, y * scale, scale, scale);
}

// Function to draw the game board
function drawBoard() {
    for (let r = 0; r < boardHeight; r++) {
        for (let c = 0; c < boardWidth; c++) {
            if (board[r][c]) { // If the cell is not empty
                drawBlock(c, r, board[r][c]); // board[r][c] will store the color
            } else {
                // Optionally draw empty cells differently or leave them blank
                // For now, leave blank (background will show)
            }
        }
    }
}

// Function to draw the current falling piece
function drawPiece(piece, x, y) {
    context.fillStyle = piece.color;
    piece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value) {
                drawBlock(x + c, y + r, piece.color);
            }
        });
    });
}

// Function to get a random new tetromino
function newPiece() {
    const pieces = 'ILJOTSZ';
    const randPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPiece = JSON.parse(JSON.stringify(tetrominoes[randPiece])); // Deep copy
    currentX = Math.floor(boardWidth / 2) - Math.floor(currentPiece.shape[0].length / 2);
    currentY = 0;

    // Game Over check (simplified for now)
    if (collision()) {
        console.log("Game Over");
        // Reset board or stop game
        board = [];
        for (let r = 0; r < boardHeight; r++) {
            board[r] = [];
            for (let c = 0; c < boardWidth; c++) {
                board[r][c] = 0;
            }
        }
    }
}

// Collision detection function (basic placeholder)
function collision() {
    // This needs to be implemented properly to check against board boundaries and other pieces
    const shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) { // If it's part of the piece
                let newX = currentX + c;
                let newY = currentY + r;

                // Check board boundaries
                if (newX < 0 || newX >= boardWidth || newY >= boardHeight) {
                    return true;
                }
                // Check if the cell below is occupied (for landing) or if current cell is occupied (for game over)
                if (newY >= 0 && board[newY] && board[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Function to merge the current piece into the board
function mergePiece() {
    currentPiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value) {
                board[currentY + r][currentX + c] = currentPiece.color;
            }
        });
    });
}

// Function to clear completed lines
function clearLines() {
    let linesCleared = 0;
    for (let r = boardHeight - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            // Line is full
            board.splice(r, 1); // Remove the line
            board.unshift(Array(boardWidth).fill(0)); // Add an empty line at the top
            linesCleared++;
            r++; // Re-check the current row index as it's now a new line
        }
    }
    // Add scoring based on linesCleared later
    if (linesCleared > 0) {
        console.log("Lines cleared: " + linesCleared);
    }
}

// Game drop function
function drop() {
    currentY++;
    if (collision()) {
        currentY--; // Move back
        mergePiece();
        clearLines();
        newPiece();
    }
}

let dropCounter = 0;
let dropInterval = 1000; // ms, piece drops every 1 second
let lastTime = 0;

// Main game loop
function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        drop();
        dropCounter = 0;
    }

    // Clear canvas
    context.fillStyle = '#f0f0f0'; // Light grey background
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawBoard();
    if (currentPiece) {
        drawPiece(currentPiece, currentX, currentY);
    }

    requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', event => {
    if (!currentPiece) return;

    if (event.key === 'ArrowLeft') {
        currentX--;
        if (collision()) {
            currentX++; // Revert if collision
        }
    } else if (event.key === 'ArrowRight') {
        currentX++;
        if (collision()) {
            currentX--; // Revert if collision
        }
    } else if (event.key === 'ArrowDown') {
        drop();
    } else if (event.key === 'ArrowUp') { // For rotation
        rotatePiece();
    }
});

// Piece rotation function (basic placeholder)
function rotatePiece() {
    const shape = currentPiece.shape;
    const N = shape.length;
    const newShape = [];

    for (let i = 0; i < N; i++) {
        newShape[i] = [];
        for (let j = 0; j < N; j++) {
            newShape[i][j] = shape[N - 1 - j][i];
        }
    }

    // Before applying, check for collision
    const originalShape = currentPiece.shape;
    currentPiece.shape = newShape;
    if (collision()) {
        currentPiece.shape = originalShape; // Revert if collision
    }
}


// Start the game
newPiece();
gameLoop();

console.log("Tetris game initialized");
