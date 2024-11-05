// script.js

let secretCode = [];
let currentAttempt = 0;
const maxAttempts = 5;

function startGame() {
    generateSecretCode();
    createAttempts();
    currentAttempt = 0;
    document.getElementById("check-button").style.display = "block";
    console.log("Secret Code:", secretCode);  // For debugging
}

function generateSecretCode() {
    secretCode = [];
    for (let i = 0; i < 5; i++) {
        secretCode.push(Math.floor(Math.random() * 10)); // Random digit between 0-9
    }
}

function createAttempts() {
    const container = document.getElementById('attempts-container');
    container.innerHTML = '';  // Clear previous attempts

    for (let i = 0; i < maxAttempts; i++) {
        const attemptRow = document.createElement('div');
        attemptRow.classList.add('attempt');

        for (let j = 0; j < 5; j++) {
            const inputBox = document.createElement('input');
            inputBox.classList.add('input-box');
            inputBox.maxLength = 1;
            inputBox.setAttribute('data-index', `${i}-${j}`);
            inputBox.disabled = i !== 0; // Enable only the first row initially
            attemptRow.appendChild(inputBox);
        }
        container.appendChild(attemptRow);
    }
}

function checkAttempt() {
    if (currentAttempt >= maxAttempts) {
        alert("Game Over! Out of attempts.");
        return;
    }

    const rowInputs = document.querySelectorAll(`.attempt:nth-child(${currentAttempt + 1}) .input-box`);
    const guess = Array.from(rowInputs).map(input => parseInt(input.value) || 0);

    let hints = Array(5).fill('red'); // Default all to red
    const usedInSecret = Array(5).fill(false); // Track used positions in the secret code
    const usedInGuess = Array(5).fill(false); // Track used positions in the guess

    // First pass: Mark correct numbers in correct positions as green
    for (let i = 0; i < 5; i++) {
        if (guess[i] === secretCode[i]) {
            hints[i] = 'green';
            usedInSecret[i] = true;
            usedInGuess[i] = true;
        }
    }

    // Second pass: Mark remaining numbers as yellow if they exist in another position
    for (let i = 0; i < 5; i++) {
        if (!usedInGuess[i]) {
            for (let j = 0; j < 5; j++) {
                if (guess[i] === secretCode[j] && !usedInSecret[j]) {
                    hints[i] = 'yellow';
                    usedInSecret[j] = true;
                    break;
                }
            }
        }
    }

    // Apply colors to inputs
    rowInputs.forEach((input, i) => {
        input.classList.add(hints[i]);
        input.disabled = true; // Lock the row after checking
    });

    // Check for win condition
    if (hints.every(color => color === 'green')) {
        alert("Congratulations! You've guessed the code.");
        return;
    }

    // Increment attempt counter and enable next row if available
    currentAttempt++;
    if (currentAttempt < maxAttempts) {
        const nextRowInputs = document.querySelectorAll(`.attempt:nth-child(${currentAttempt + 1}) .input-box`);
        nextRowInputs.forEach(input => (input.disabled = false));
    } else {
        alert(`Game Over! The code was ${secretCode.join('')}.`);
    }
}
