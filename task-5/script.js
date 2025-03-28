const startArea = document.querySelector(".start-area");
const questionField = document.querySelector(".question-area");
const resultArea = document.querySelector(".result-area");
const startBtn = document.getElementById("start-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

let currentIndex = 0;
let questions = [];
let selectedAnswers = {};

function getQuestions(){
    fetch("./quiz.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion();
        })
}

startBtn.addEventListener("click", () =>{
    startArea.style.display = "none";
    questionField.style.display = "block";
    getQuestions();
});


function displayQuestion(){
    const questionElement = document.getElementById("question");
    const optionsContainer = document.querySelector(".options");

    questionElement.textContent = (currentIndex+1) +". " + questions[currentIndex].question;
    
    optionsContainer.innerHTML = "";

    questions[currentIndex].options.forEach((option, i) => {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "option";
        input.value = option;
        input.id = `option${i}`;

         // To show previously selected answer (if selected already)
         if (selectedAnswers[currentIndex] === option) {
            input.checked = true;
        }

        input.addEventListener("change", () => {
            selectedAnswers[currentIndex] = option; // Store selected answer
        });

        const label = document.createElement("label");
        label.htmlFor = `option${i}`;
        label.classList.add("option");
        label.textContent = option;

        optionsContainer.appendChild(input);
        optionsContainer.appendChild(label);
    });

    prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
    nextBtn.textContent = currentIndex === questions.length - 1 ? "Submit" : "Next";

}


function changeQuestion(direction){    
    if (direction === 1 && selectedAnswers[currentIndex] == null) {
        alert("Please select an answer before proceeding.");
        return;
    }
    
    currentIndex += direction;

    if (currentIndex >= questions.length) {
        showResults();
        return;
    }
    
    displayQuestion();

}

function showResults() {
    questionField.style.display = "none";
    resultArea.style.display = "block";

    let score = 0;
    questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.answer) {
            score++;
        }
    });

    document.getElementById("score").textContent = `${score}/${questions.length}`;
}


prevBtn.addEventListener("click", () => changeQuestion(-1));
nextBtn.addEventListener("click", () => changeQuestion(1));

restartBtn.addEventListener("click", () => {
    currentIndex = 0;
    selectedAnswers = {};
    resultArea.style.display = "none";
    startArea.style.display = "flex";
});


