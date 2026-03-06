const quizQuestions = [
  {
    question: "Which method adds an element at the end of an array?",
    options: ["push()", "shift()", "pop()", "slice()"],
    correctAnswer: "push()"
  },
  {
    question: "Which property is commonly used to change text in a DOM element?",
    options: ["nodeValue", "innerHTML", "target", "styleSheet"],
    correctAnswer: "innerHTML"
  },
  {
    question: "What does addEventListener() do?",
    options: [
      "Saves data in localStorage",
      "Adds CSS classes",
      "Attaches an event handler",
      "Loads external JavaScript"
    ],
    correctAnswer: "Attaches an event handler"
  },
  {
    question: "Which statement creates a block-scoped variable?",
    options: ["var x = 1", "let x = 1", "x := 1", "constx = 1"],
    correctAnswer: "let x = 1"
  },
  {
    question: "Which event is fired when a user clicks an element?",
    options: ["hover", "submit", "click", "load"],
    correctAnswer: "click"
  },
  {
    question: "Which method converts JSON text into a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.object()"],
    correctAnswer: "JSON.parse()"
  }
];

const questionCounter = document.querySelector("#questionCounter");
const questionText = document.querySelector("#questionText");
const optionsContainer = document.querySelector("#optionsContainer");
const progressBar = document.querySelector("#progressBar");

const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const submitBtn = document.querySelector("#submitBtn");

const quizSection = document.querySelector("#quizSection");
const resultSection = document.querySelector("#resultSection");
const scoreboardBody = document.querySelector("#scoreboardBody");
const totalScoreText = document.querySelector("#totalScoreText");

let currentQuestionIndex = 0;
const selectedAnswers = new Array(quizQuestions.length).fill(null);

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function updateNavButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  nextBtn.classList.toggle("hidden", isLastQuestion);
  submitBtn.classList.toggle("hidden", !isLastQuestion);
}

function createOptionElement(optionText, optionIndex) {
  const wrapper = document.createElement("label");
  wrapper.className = "quiz-option";
  wrapper.setAttribute("for", `option-${optionIndex}`);

  const input = document.createElement("input");
  input.type = "radio";
  input.id = `option-${optionIndex}`;
  input.name = "quizOption";
  input.value = optionText;
  input.checked = selectedAnswers[currentQuestionIndex] === optionText;

  input.addEventListener("change", () => {
    selectedAnswers[currentQuestionIndex] = input.value;
  });

  wrapper.appendChild(input);
  wrapper.append(` ${optionText}`);

  return wrapper;
}

function renderQuestion() {
  const item = quizQuestions[currentQuestionIndex];
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${
    quizQuestions.length
  }`;
  questionText.textContent = item.question;

  optionsContainer.innerHTML = "";
  item.options.forEach((optionText, optionIndex) => {
    optionsContainer.appendChild(createOptionElement(optionText, optionIndex));
  });

  updateNavButtons();
  updateProgressBar();
}

function renderScoreboard() {
  scoreboardBody.innerHTML = "";
  let totalMarks = 0;

  quizQuestions.forEach((item, index) => {
    const userAnswer = selectedAnswers[index];
    const isCorrect = userAnswer === item.correctAnswer;
    const marks = isCorrect ? 1 : 0;
    totalMarks += marks;

    const row = document.createElement("tr");
    row.className = isCorrect ? "correct-row" : "wrong-row";

    row.innerHTML = `
      <td>${item.question}</td>
      <td>${userAnswer || "Not answered"}</td>
      <td>${item.correctAnswer}</td>
      <td>${marks}</td>
    `;

    scoreboardBody.appendChild(row);
  });

  totalScoreText.textContent = `Total Score: ${totalMarks} / ${quizQuestions.length}`;
}

prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex -= 1;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
  }
});

submitBtn.addEventListener("click", () => {
  renderScoreboard();
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
});

renderQuestion();
