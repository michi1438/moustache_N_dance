const configMenu = document.getElementById('config-menu');
const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');

const questions = [
    {
        question: "Mode de jeu",
        options: ["Jeu local", "Jeu en ligne"]
    },
    {
        question: "Nombre de joueurs",
        options: ["1 joueur", "2 joueurs", "3 joueurs", "4 joueurs", "5 joueurs", "6 joueurs"]
    },
    {
        question: "Vitesse du jeu",
        options: ["Lente", "Normale", "Rapide"]
    },
    {
        question: "Map",
        options: ["Classique", "Simpson"]
    }
];

let currentQuestionIndex = 0;
let configuration = {};

export function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', () => selectOption(option));
        optionsContainer.appendChild(li);
    });
}

function selectOption(option) {
    const currentQuestion = questions[currentQuestionIndex];
    configuration[currentQuestion.question] = option;

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        configMenu.style.display = 'none';
        // Start the game with the selected configuration
        console.log('Configuration:', configuration);
        startGame(configuration);
    }
}

configMenu.style.display = 'block';
showQuestion();

export function startGame(config) {
    console.log('Starting game with configuration:', config);
    // This function will be implemented in main.js
    // You can call any initialization functions here
    window.startGame(config);
}
