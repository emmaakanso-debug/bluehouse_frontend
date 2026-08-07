// Quiz Questions (array of objects)
const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Transfer Markup Language",
      "Home Tool Multi Language",
      "Hyper Tool Markup Language"
    ],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    answer: "CSS"
  },
  {
    question: "Which is not a JavaScript data type?",
    options: ["Undefined", "Number", "Float", "String"],
    answer: "Float"
  },
  {
    question: "Which of the following is a JavaScript framework?",
    options: ["React", "Laravel", "Django", "Flask"],
    answer: "React"
  },
  {
    question: "Which symbol is used for single-line comments in JavaScript?",
    options: ["//", "<!-- -->", "#", "/* */"],
    answer: "//"
  }
];

// Get elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timeEl = document.getElementById("time");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const remarkEl = document.getElementById("remark");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let selected = false;

// Start quiz
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);
nextBtn.addEventListener("click", nextQuestion);

function startQuiz() {
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  selected = false;
  nextBtn.disabled = true;
  updateTimer();

  const current = quizData[currentIndex];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = option;
    btn.addEventListener("click", () => checkAnswer(btn, current.answer));
    optionsEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

function checkAnswer(button, correctAnswer) {
  if (selected) return;
  selected = true;

  const options = document.querySelectorAll(".option");
  options.forEach(opt => {
    opt.disabled = true;
    if (opt.textContent === correctAnswer) opt.classList.add("correct");
    else opt.classList.add("wrong");
  });

  if (button.textContent === correctAnswer) score++;

  nextBtn.disabled = false;
  clearInterval(timer);
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoRevealAnswer();
    }
  }, 1000);
}

function updateTimer() {
  timeEl.textContent = timeLeft;
}

function autoRevealAnswer() {
  const current = quizData[currentIndex];
  const options = document.querySelectorAll(".option");
  options.forEach(opt => {
    opt.disabled = true;
    if (opt.textContent === current.answer) opt.classList.add("correct");
  });
  nextBtn.disabled = false;
}

function updateProgress() {
  const progressPercent = ((currentIndex) / quizData.length) * 100;
  progressEl.style.width = `${progressPercent}%`;
}

function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  scoreEl.innerHTML = `You scored <strong>${score}</strong> out of <strong>${quizData.length}</strong>`;

  if (score === quizData.length) remarkEl.textContent = "💯 Excellent!";
  else if (score >= 3) remarkEl.textContent = "👍 Good job!";
  else remarkEl.textContent = "😅 Keep practicing!";
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  resultScreen.classList.remove("active");
  quizScreen.classList.add("active");
  loadQuestion();
}
