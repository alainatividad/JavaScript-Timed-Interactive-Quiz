// store in var all relevant HTML elements
var timerEl = document.querySelector(".timer");
var startButton = document.querySelector(".start-button");
var boxEl = document.querySelector(".box");
var questionEl = document.querySelector(".text-heading");
var textEl = document.querySelector(".text-container");

// variables for gameplay
// questions are from https://www.interviewbit.com/javascript-mcq/ and https://www.interviewbit.com/javascript-interview-questions/
var questionArray = [
    {
        question: "Which of the following keywords are used to define a variable in JavaScript?",
        choice1: "var",
        choice2: "let",
        choice3: "Both A and B",
        choice4: "None of the above",
        answer: "3"
    },
    {
        question: "Which of the following methods can be used to display data in some form using JavaScript?",
        choice1: "document.write()",
        choice2: "console.log",
        choice3: "window.alert()",
        choice4: "All of the above",
        answer: "4"
    },
    {
        question: "Which function is used to serialize an object into a JSON string in JavaScript?",
        choice1: "stringify()",
        choice2: "parse()",
        choice3: "convert()",
        choice4: "None of the above",
        answer: "1"   
    },
    {
        question: "How do you stop an interval timer in JavaScript?",
        choice1: "clearInterval",
        choice2: "clearTimer",
        choice3: "intervalOver",
        choice4: "None of the above",
        answer: "1"   
    },
    {
        question: "How are objects compared when they are checked with the strict equality operator (===)?",
        choice1: "The contents of the objects are compared",
        choice2: "Their references are compared",
        choice3: "Both 1 and 2",
        choice4: "None of the above",
        answer: "2"   
    },
    {
        question: "What is the output of typeof NaN?",
        choice1: "null",
        choice2: "undefined",
        choice3: "number",
        choice4: "string",
        answer: "3"   
    },
    {
        question: "How can a dataytpe be declared to be a constant type?",
        choice1: "var",
        choice2: "let",
        choice3: "constant",
        choice4: "const",
        answer: "4"   
    },
    {
        question: "How are two values compared when they are checked with the strict equality operator (===)?",
        choice1: "Their values are compared",
        choice2: "Their datatypes are compared",
        choice3: "Both 1 and 2",
        choice4: "None of the above",
        answer: "3"   
    },
    {
        question: "How do you convert Objects to string using JSON?",
        choice1: "JSON.parse()",
        choice2: "JSON.stringify()",
        choice3: "JSON.string()",
        choice4: "None of the above",
        answer: "2"   
    }
]
var gameStatus = false;
var sortArrayQuestions = [];
var choiceArray = [];
var currentQuestionIndex = 0;
var currentSortArrayIndex = 0;
var score = 0;

// Timer that counts down from 120
function countdown(timeLeft) {
    if (typeof timeLeft === 'undefined') {
        timeLeft = 120;
    }
  
    timeInterval = setInterval(function () {
        if (timeLeft > -1) {
            timerEl.textContent = timeLeft;
            timeLeft--;
        } else {
            gameStatus = false;
            clearInterval(timeInterval);
            gameOver();
        }
    }, 1000);
}

// randomise the questionArray
function randomSort(arr) {
    var count = arr.length;
    var index = 0;

    for (let i = 0; i < count; i++) {
        index = Math.abs(Math.floor(Math.random() * count));
        while (sortArrayQuestions.includes(index)) {
            index = Math.abs(Math.floor(Math.random() * count));
        }
        sortArrayQuestions[i] = index;
    }
}

// "Flashes" the Correct or Incorrect text after answering a question 
function flashText() {
    var timeOut = 3;
    var timeFooter;
    var footerQuestionEl = document.querySelector(".question-footer");

    timeFooter = setInterval(function () { 
        if (timeOut > 1) {
            timeOut--;
        } else {
            footerQuestionEl.setAttribute("style", "display: none;"); 
            clearInterval(timeFooter);
        }
    }, 1000);
}

function initQuestion(currentSortArrayIndex) {
    // remove the current elements inside boxEl except for H1
    // then dynamically create a list for the button answers
    var ul;
    var li;
    var button;
    var buttonOld;
    var footerQuestionEl;
    var footerHeader;
    
    // replace header with question and move choice into a separate array
    currentQuestionIndex = sortArrayQuestions[currentSortArrayIndex];
    questionEl.textContent = questionArray[currentQuestionIndex].question;
    choiceArray = [
        questionArray[currentQuestionIndex].choice1,
        questionArray[currentQuestionIndex].choice2,
        questionArray[currentQuestionIndex].choice3,
        questionArray[currentQuestionIndex].choice4
    ]
    
    if (currentSortArrayIndex === 0) {
        // remove text-container and add buttons for choices
        boxEl.removeChild(textEl);
        boxEl.setAttribute("style", "text-align: left;")

        ul = document.createElement("ul");
        ul.setAttribute("id", "choices");
        boxEl.appendChild(ul);

        // create 'footer' to show if answer is correct or not
        footerQuestionEl = document.createElement("div");
        footerQuestionEl.setAttribute("class", "question-footer");
        footerQuestionEl.setAttribute("style", "display: none;")
        boxEl.append(footerQuestionEl);
    
        footerHeader = document.createElement("h2");
        footerHeader.setAttribute("class", "question-head");
        footerQuestionEl.append(footerHeader);

        // Create button for every choice
        choiceArray.forEach((element, index) => {
            listClass = index + 1;
            li = document.createElement("li");
            button = document.createElement("button");
            li.setAttribute("class", "li-" + listClass);
            
            button.textContent = listClass + ". " + element + " ";
            button.setAttribute("class", listClass);
            
            ul.appendChild(li);
            li.appendChild(button);
        });
    } else {
        // for the next questions, just replace the current buttons' textContent with the new question's ones
        choiceArray.forEach((element, index) => {
            listClass = index + 1;
            li = document.getElementsByClassName("li-"+listClass);
            buttonOld = document.getElementsByClassName(listClass);
            button = document.createElement("button");
            button.textContent = listClass + ". " + element + " ";
            button.setAttribute("class", listClass);
            li[0].appendChild(button);
            buttonOld[0].replaceWith(button);
        });
    }
    
}

function gameOver() {
    clearInterval(timeInterval);
    // remove ul and li elements
    var ul = document.querySelector("#choices");
    boxEl.removeChild(ul);

    // replace header new text
    questionEl.textContent = (score >= Math.round(questionArray.length * 0.70)) ? "Congratulations! All done!" : "Better luck next time! All done!";

    // create new elements
    var div = document.createElement("div");
    div.setAttribute("class", "text-containter");
    boxEl.appendChild(div);
    
    var text = document.createElement("p");
    text.textContent = "Your final score is " + score +".";
    div.appendChild(text);
    
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    div.appendChild(form);
    
    var labelForm = document.createElement("label");
    labelForm.textContent = "Enter initials: ";
    form.appendChild(labelForm);

    var inputForm = document.createElement("input");
    inputForm.setAttribute("type", "text")
    labelForm.appendChild(inputForm);

    var buttonForm = document.createElement("button");
    buttonForm.setAttribute("class", "submit-button");
    buttonForm.setAttribute("style", "width: 10vw; height: 40px;");
    buttonForm.addEventListener("click", submitClick);
    buttonForm.textContent = " Submit ";
    labelForm.appendChild(buttonForm);
}

function submitClick(event) {
    // prevent refreshing of page when Submit button is clicked
    event.preventDefault();

    var scoreArray = [];
    var userScores = JSON.parse(localStorage.getItem("userScores"));
    
    var userNewScore = {
        name: document.querySelector("input").value.trim(),
        score: score
    }

    if (userNewScore.name === "") {
        displayMessage("error", "Initials cannot be blank");
    }

    // Add new saved initial-score
    if (userScores === null) {
        scoreArray.push(userNewScore);
    } else {
        for (var i = 0; i < userScores.length; i++) {
            scoreArray.push(userScores[i]);
        }
        scoreArray.push(userNewScore);
        // sort scores in descending order
        scoreArray = scoreArray.sort((c1, c2) => (c2.score - c1.score));
    }

    localStorage.setItem("userScores", JSON.stringify(scoreArray));
    // change webpage
    document.location.href = "./highscores.html"
}

// Start button is pressed
startButton.addEventListener("click", function () {    
    sortArrayQuestions = [];    // initialise sort everytime the start button is pressed
    choiceArray = [];
    currentQuestionIndex = 0;
    gameStatus = true;

    randomSort(questionArray);
    initQuestion(currentSortArrayIndex);
    
    // initially start counter with timeLeft = 120
    countdown();
})

boxEl.addEventListener("click", function (event) {
    var element = event.target;
    var timeLeft;
    var footerQuestionEl = document.querySelector(".question-footer");
    var footerHeader = document.querySelector(".question-head");
    
    footerQuestionEl.setAttribute("style", "font-style: italic;");
    
    if (element.matches("button")) {
        var chosenAnswer = element.getAttribute("class");

        if (chosenAnswer !== "start-button") {
            if (chosenAnswer === questionArray[currentQuestionIndex].answer) {
                footerHeader.textContent = "Correct!"
                // show footer
                flashText();
                score++;
                if (currentSortArrayIndex < questionArray.length-1) {
                    currentSortArrayIndex++;
                    initQuestion(currentSortArrayIndex);
                } else {
                    footerQuestionEl.setAttribute("style", "display: none;");  
                    gameStatus = false;
                    gameOver();
                }
            } else {
                // Stop current timer, adjust timeLeft, and start countdown again with new timeLeft value
                footerHeader.textContent = "Incorrect!"
                flashText();

                timeLeft = timerEl.textContent - 10;
                clearInterval(timeInterval);
                if (timeLeft <= 0) {
                    footerQuestionEl.setAttribute("style", "display: none;");  
                    gameStatus = false;
                    gameOver();
                }
                countdown(timeLeft);
            }
            
        }
    }
})
