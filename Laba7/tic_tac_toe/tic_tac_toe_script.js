const cells = document.querySelectorAll('.cell');
const message = document.querySelector('.message');
let board = Array(9).fill(null);
let currentPlayer = 'X'; // Гравець починає з "X"
let gameActive = true;

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Оновлюємо клітинку
function updateCell(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

// Перевіряємо переможця
function checkWinner(player) {
    return winCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

// Перевіряємо на нічию
function checkDraw() {
    return board.every(cell => cell !== null);
}

// Функція для ходу комп'ютера
function computerMove() {
    let availableCells = board.map((val, index) => val === null ? index : null).filter(val => val !== null);
    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    updateCell(randomIndex, 'O');
    if (checkWinner('O')) {
        message.textContent = 'Computer wins!';
        gameActive = false;
    } else if (checkDraw()) {
        message.textContent = 'It\'s a draw!';
        gameActive = false;
    }
}

// Основна функція для ходу гравця
function playerMove(index) {
    if (board[index] === null && gameActive) {
        updateCell(index, 'X');
        if (checkWinner('X')) {
            message.textContent = 'You win!';
            gameActive = false;
        } else if (checkDraw()) {
            message.textContent = 'It\'s a draw!';
            gameActive = false;
        } else {
            setTimeout(computerMove, 500); // Хід комп'ютера через 0.5 сек
        }
    }
}

// Додаємо обробники подій до кожної клітинки
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => playerMove(index));
});