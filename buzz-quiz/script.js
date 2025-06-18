const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "Home Tool Markup Language", correct: false },
      { text: "Hyperlinks and Text Markup Language", correct: false },
      { text: "None of these", correct: false }
    ]
  },
  {
    question: "Which tag is used for JavaScript?",
    answers: [
      { text: "<script>", correct: true },
      { text: "<js>", correct: false },
      { text: "<javascript>", correct: false },
      { text: "<code>", correct: false }
    ]
  },
  {
    question: "What does CSS stand for?",
    answers: [
      { text: "Cascading Style Sheets", correct: true },
      { text: "Colorful Style Sheets", correct: false },
      { text: "Creative Style Sheets", correct: false },
      { text: "Computer Style Sheets", correct: false }
    ]
  },
  {
    question: "Which one is not a JavaScript data type?",
    answers: [
      { text: "Boolean", correct: false },
      { text: "Undefined", correct: false },
      { text: "Float", correct: true },
      { text: "String", correct: false }
    ]
  },
  {
    question: "Which method converts JSON to a JavaScript object?",
    answers: [
      { text: "JSON.parse()", correct: true },
      { text: "JSON.stringify()", correct: false },
      { text: "JSON.convert()", correct: false },
      { text: "JSON.objectify()", correct: false }
    ]
  }
];

const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const progressEl = document.getElementById("progress");
const resultBox = document.getElementById("result-box");
const finalScore = document.getElementById("final-score");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const themeToggleBtn = document.getElementById("theme-toggle");
const timeLeftEl = document.getElementById("time-left");

let currentQuestionIndex = 0;
let score = 0;
let wrong = 0;
let timeLeft = 10;
let timerId = null;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  wrong = 0;
  resultBox.classList.add("hidden");
  nextBtn.innerText = "Next";
  nextBtn.style.display = "none";
  showQuestion();
}

function showQuestion() {
  resetState();
  startTimer();
  const currentQuestion = questions[currentQuestionIndex];
  progressEl.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  const progressPercent = (currentQuestionIndex / questions.length) * 100;
  document.getElementById("progress-fill").style.width = `${progressPercent}%`;

  questionEl.innerText = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer.text;
    btn.classList.add("btn");
    if (answer.correct) {
      btn.dataset.correct = true;
    }
    btn.addEventListener("click", selectAnswer);
    answerButtons.appendChild(btn);
  });
}

function resetState() {
  clearInterval(timerId);
  timeLeftEl.innerText = "";
  nextBtn.style.display = "none";
  answerButtons.innerHTML = "";
}

function startTimer() {
  timeLeft = 10;
  timeLeftEl.innerText = timeLeft;

  timerId = setInterval(() => {
    timeLeft--;
    timeLeftEl.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeOut();
    }
  }, 1000);
}

function handleTimeOut() {
  wrong++;
  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else {
      button.classList.add("wrong");
    }
  });
  wrongSound.play();
  nextBtn.style.display = "block";
}

function selectAnswer(e) {
  clearInterval(timerId);
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    score++;
    correctSound.play();
  } else {
    wrong++;
    wrongSound.play();
  }

  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else {
      button.classList.add("wrong");
    }
  });

  nextBtn.style.display = "block";
}

function showScore() {
  questionEl.innerText = "";
  progressEl.innerText = "";
  answerButtons.innerHTML = "";
  finalScore.innerText = `You scored ${score} out of ${questions.length}! 🎉`;

  const levelBadge = document.getElementById("level-badge");
  const percent = (score / questions.length) * 100;

  let levelHTML = "";
  if (percent === 100) {
    levelHTML = `<span class="badge-master">🌟 Quiz Master</span>`;
  } else if (percent >= 80) {
    levelHTML = `<span class="badge-expert">🏆 Expert</span>`;
  } else if (percent >= 50) {
    levelHTML = `<span class="badge-intermediate">🎓 Intermediate</span>`;
  } else {
    levelHTML = `<span class="badge-beginner">📘 Beginner</span>`;
  }
  levelBadge.innerHTML = levelHTML;

  resultBox.classList.remove("hidden");
  nextBtn.style.display = "none";

  showScoreChart(score, wrong);
}

function showScoreChart(correct, wrong) {
  const ctx = document.getElementById('scoreChart').getContext('2d');

  const gradientCorrect = ctx.createLinearGradient(0, 0, 0, 400);
  gradientCorrect.addColorStop(0, '#00c6ff');
  gradientCorrect.addColorStop(1, '#0072ff');

  const gradientWrong = ctx.createLinearGradient(0, 0, 0, 400);
  gradientWrong.addColorStop(0, '#f77062');
  gradientWrong.addColorStop(1, '#fe5196');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Correct ✅', 'Wrong ❌'],
      datasets: [{
        label: 'Your Performance',
        data: [correct, wrong],
        backgroundColor: [gradientCorrect, gradientWrong],
        borderRadius: 15,
        borderSkipped: false,
        barThickness: 50
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#222',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#444',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff',
            font: {
              family: 'Poppins',
              weight: '600'
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255,255,255,0.1)'
          },
          ticks: {
            color: '#ffffff',
            font: {
              family: 'Poppins',
              weight: '500'
            },
            stepSize: 1
          }
        }
      }
    }
  });
}

function handleNext() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextBtn.addEventListener("click", handleNext);

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  themeToggleBtn.innerText = isLight ? "🌞 Light Mode" : "🌙 Dark Mode";
});

startQuiz();
