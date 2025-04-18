const fileInput = document.getElementById("fileInput");
const app = document.getElementById("app");
const quizContainer = document.getElementById("quizContainer");
const homeBtn = document.getElementById("homeBtn");

let quizData = null;
let currentLesson = null;
let currentQuestionIndex = 0;

homeBtn.onclick = () => showHome();

fileInput.addEventListener("change", function () {
  const reader = new FileReader();
  reader.onload = function () {
    quizData = JSON.parse(reader.result);
    localStorage.setItem("quizana_data", reader.result);
    showHome();
  };
  reader.readAsText(this.files[0]);
});

function showHome() {
  homeBtn.classList.add("hidden");
  quizContainer.innerHTML = "";
  if (!quizData) return;

  quizData.chapitres.forEach((chapitre, cIndex) => {
    chapitre.leçons.forEach((lecon, lIndex) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${chapitre.titre} - ${lecon.titre}</h2>
        <button onclick="startQuiz(${cIndex}, ${lIndex})">Commencer</button>
      `;
      quizContainer.appendChild(card);
    });
  });
}

function startQuiz(cIndex, lIndex) {
  homeBtn.classList.remove("hidden");
  currentLesson = quizData.chapitres[cIndex].leçons[lIndex];
  currentQuestionIndex = 0;
  showQuestion();
}

function showQuestion() {
  const question = currentLesson.questions[currentQuestionIndex];
  quizContainer.innerHTML = "";
  const card = document.createElement("div");
  card.className = "card";

  if (!question) {
    card.innerHTML = `
      <h2>Quiz terminé !</h2>
      <button onclick="showHome()">Retour à l'accueil</button>
      <button onclick="restartQuiz()">Refaire le quiz</button>
    `;
    quizContainer.appendChild(card);
    return;
  }

  if (question.type === "info") {
    card.innerHTML = `
      <p>${question.contenu}</p>
      <button onclick="nextQuestion()">Continuer</button>
    `;
  } else if (question.type === "qcm") {
    let options = question.choix.map(
      (choice, i) => `<button onclick="checkAnswer('${choice}', '${question.reponse}')">${choice}</button>`
    ).join("");
    card.innerHTML = `<p>${question.question}</p>${options}`;
  }

  quizContainer.appendChild(card);
}

function nextQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

function checkAnswer(choice, correct) {
  const card = document.createElement("div");
  card.className = "card";
  if (choice === correct) {
    card.innerHTML = `<p>✅ Bonne réponse !</p>`;
  } else {
    card.innerHTML = `<p>❌ Mauvaise réponse. Réponse correcte : ${correct}</p>`;
  }
  quizContainer.innerHTML = "";
  quizContainer.appendChild(card);
  setTimeout(() => {
    nextQuestion();
  }, 1000);
}

function restartQuiz() {
  currentQuestionIndex = 0;
  showQuestion();
}

window.onload = () => {
  const saved = localStorage.getItem("quizana_data");
  if (saved) {
    quizData = JSON.parse(saved);
    showHome();
  }
};