// ----- Variables -----
let secretNumber;
let maxRange = 10;
let attempts = 5;
let initialAttempts = attempts;
let gameOver = false;

// ----- Functions -----

// Generate a random number
function generateNumber() {
  return Math.floor(Math.random() * maxRange) + 1;
}

// Set difficulty level
function setDifficulty() {
  const difficulty = document.getElementById("difficulty").value;
  const rangeText = document.getElementById("rangeText");
  const attemptsLeft = document.getElementById("attemptsLeft");

  if (difficulty === "easy") {
    maxRange = 10;
    attempts = 5;
    initialAttempts = attempts;
  } else if (difficulty === "medium") {
    maxRange = 50;
    attempts = 7;
    initialAttempts = attempts;
  } else if (difficulty === "hard") {
    maxRange = 100;
    attempts = 10;
    initialAttempts = attempts;
  }

  rangeText.innerText = `Guess a number between 1 and ${maxRange}:`;
  attemptsLeft.innerText = `Attempts left: ${attempts}`;
  restartGame(); // reset everything when difficulty changes
}

// Compare guess with the secret number
function checkGuess(userGuess) {
  if (userGuess === secretNumber) {
    return "🎉 Correct! You guessed the right number!";
  } else if (userGuess > secretNumber) {
    return "📉 Too high!";
  } else {
    return "📈 Too low!";
  }
}

// Play the game
function playGame() {
  if (gameOver) return;

  const guessInput = document.getElementById("userGuess");
  const guess = Number(guessInput.value);
  const message = document.getElementById("message");

  if (!guess || guess < 1 || guess > maxRange) {
    message.innerText = `⚠ Please enter a number between 1 and ${maxRange}.`;
    return;
  }

  const feedback = checkGuess(guess);
  message.innerText = feedback;

  if (guess === secretNumber) {
    endGame(`🎊 You won! The number was ${secretNumber}.`);
    return;
  }

  attempts--;
  document.getElementById("attemptsLeft").innerText = `Attempts left: ${attempts}`;

  if (attempts === 0) {
    endGame(`💀 Game Over! The number was ${secretNumber}.`);
  }

  guessInput.value = "";
}

// End the game
function endGame(finalMessage) {
  document.getElementById("message").innerText = finalMessage;
  document.getElementById("guessBtn").disabled = true;
  document.getElementById("restartBtn").style.display = "inline-block";
  gameOver = true;
}

// Restart the game
function restartGame() {
  // restore attempts to the initial value for the selected difficulty
  attempts = initialAttempts;
  secretNumber = generateNumber();
  gameOver = false;

  document.getElementById("message").innerText = "";
  document.getElementById("guessBtn").disabled = false;
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("attemptsLeft").innerText = `Attempts left: ${attempts}`;
  document.getElementById("userGuess").value = "";
}

// ----- Initialize -----
window.onload = () => {
  setDifficulty(); // sets default (easy)
  secretNumber = generateNumber();
};