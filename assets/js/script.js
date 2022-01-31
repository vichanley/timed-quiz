//The Questions
var questions = [
    { 
        question: "How do you write 'Hello World' in an alert box?", 
        answers: [
            { text: "msg('Hello World')", correct: false },
            { text: "alert('Hello World')" , correct: true },
            { text: "prompt('Hello World')", correct: false },
            { text: "alertBox('Hello World')", correct: false }
        ]
    },
    { 
        question: "Which of the following function of Array object calls a function for each element in the array?", 
        answers: [
            { text: "concat()", correct: false },
            { text: "filter()", correct: false },
            { text: "forEach()", correct: true },
            { text: "split()", correct: false }
        ]
    },
    { 
        question: "How to write an IF statement for executing some code if 'i' is NOT equal to 8?", 
        answers: [
            { text: "if (i != 8)", correct: true },
            { text: "if i =! 8", correct: false },
            { text: "if (i <> 8)", correct: false },
            { text: "if (i !=== 8)", correct: false }
        ]
    },
    { 
        question: "What is the correct way to write a JavaScript array?", 
        answers: [
            { text: "var vegetable = (0:'kale', 1:'lettuce', 2:'spinach')", correct: false },
            { text: "var vegetable = ['kale', 'lettuce', 'spinach']", correct: true },
            { text: "var vegetable = (kale, lettuce, spinach)", correct: false },
            { text: "None of the above", correct: false }
        ]
    },
    { 
        question: "How do you round the number 102.456, to the nearest integer?",
        answers: [
            { text: "Math.random(102.456)", correct: false },
            { text: "Math.rnd(102.456)", correct: false },
            { text: "round(102.456)", correct: false },
            { text: "None of the above", correct: true }
        ]
    },
];

var timeLeft = 75;
var timerID;
var timerEl = document.getElementById("timer");
var startButton = document.getElementById("start-btn");
var nextButton = document.getElementById("next-btn");
var questionPageEl = document.getElementById("question-page");
var startPageEl = document.getElementById("start-page");
var questionEl = document.getElementById("question");
var answerButtonEl = document.getElementById("answer-btn");
var checkAnswerEl = document.getElementById("check-answer");
var viewHighScores = document.getElementById("highscores-link");
var submitButton = document.getElementById("submit-btn");
var clearButton = document.getElementById("clear-btn");
var initialsField = document.getElementById("initials-field");
var backButton = document.getElementById("back-btn");
var scoreField = document.getElementById("player-score");
var scores = JSON.parse(localStorage.getItem("scores"));
var shuffledQuestions;
var currentQuestionIndex;


//Start & Next Button Event Listeners
startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", () => {
    currentQuestionIndex++
    setNextQuestion()
});

//Countdown Timer function
function countdownTimer() {
    timeLeft--;
    timerEl.textContent = "Time: " + timeLeft;
    if (timeLeft <= 0){
        saveScore();
    }
}

//Start Quiz function

function startQuiz() {
    timerID = setInterval (countdownTimer, 1000);
    startPageEl.classList.add("hide");
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0;
    questionPageEl.classList.remove("hide");

    countdownTimer();
    setNextQuestion();
}

//Next Question function
function setNextQuestion()
{
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

//Displaying questions
function showQuestion(question) {
    questionEl.innerText = question.question
    question.answers.forEach(answer => {
        var button = document.createElement("button")
        button.innerText = answer.text
        button.classList.add("btn")
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click", selectAnswer)
        answerButtonEl.appendChild(button)
    })
};

//Reset function 
function resetState() {
    nextButton.classList.add("hide")
    checkAnswerEl.classList.add("hide")
    while (answerButtonEl.firstChild) {
        answerButtonEl.removeChild
            (answerButtonEl.firstChild)
    }
};

//Select answer function
function selectAnswer(e) {
    var selectedButton = e.target;
    var correct = selectedButton.dataset.correct;
    checkAnswerEl.classList.remove("hide")
    if (correct) {
        checkAnswerEl.innerHTML = "Correct!";
    } else {
        checkAnswerEl.innerHTML = "Wrong!";
        if (timeLeft <= 10) {
            timeLeft = 0;
        } else {
            timeLeft -= 10;
        }
    }

    Array.from(answerButtonEl.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("hide")
        checkAnswerEl.classList.remove("hide")
    } else {
        startButton.classList.remove("hide")
        saveScore();
    }
};

//Check and show the correct answer 
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add("correct");
    } else {
        element.classList.add("wrong");
    }
};


// Remove all the classes
function clearStatusClass(element) {
    element.classList.remove("correct");
    element.classList.remove("wrong");
};


// Save scores
function saveScore() {
    clearInterval(timerID);
    timerEl.textContent = "Time: " + timeLeft;
    setTimeout(function () {
        questionPageEl.classList.add("hide");
        document.getElementById("scores-page").classList.remove("hide");
        document.getElementById("your-score").textContent = "Your final score is " + timeLeft;

    }, 2000)
};


var loadScores = function () {
    if (!savedScores) {
        return false;
    }

    savedScores = JSON.parse(savedScores);
    var initials = document.querySelector("#initials-field").value;
    var newScore = {
        score: timeLeft,
        initials: initials
    }
    savedScores.push(newScore);
    console.log(savedScores)

    savedScores.forEach(score => {
        initialsField.innerText = score.initials
        scoreField.innerText = score.score
    })
};


// Show high scores
function showHighScores(initials) {
    document.getElementById("highscores").classList.remove("hide")
    document.getElementById("scores-page").classList.add("hide");
    startPageEl.classList.add("hide");
    questionPageEl.classList.add("hide");
    if (typeof initials == "string") {
        var score = {
            initials, timeLeft
        }
        scores.push(score)
    }

    var highScoreEl = document.getElementById("highscore");
    highScoreEl.innerHTML = "";

    for (i = 0; i < scores.length; i++) {
        var div1 = document.createElement("div");
        div1.setAttribute("class", "name-div");
        div1.innerText = scores[i].initials;
        var div2 = document.createElement("div");
        div2.setAttribute("class", "score-div");
        div2.innerText = scores[i].timeLeft;

        highScoreEl.appendChild(div1);
        highScoreEl.appendChild(div2);
    }

    localStorage.setItem("scores", JSON.stringify(scores));

};


// View high scores link
viewHighScores.addEventListener("click", showHighScores);


submitButton.addEventListener("click", function (event) {
    event.preventDefault()
    var initials = document.querySelector("#initials-field").value;
    showHighScores(initials);
});


// Restart or reload the page
restartButton.addEventListener("click", function () {
    window.location.reload();
});


// Clear localStorage items 
clearScoreButton.addEventListener("click", function () {
    localStorage.clear();
    document.getElementById("highscore").innerHTML = "";
});
