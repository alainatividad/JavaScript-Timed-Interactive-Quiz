// store in var all relevant HTML elements
var timerEl = document.querySelector(".timer");
var startButton = document.querySelector(".start-button");
var boxEl = document.querySelector(".box");
var questionEl = document.querySelector(".text-heading");
var textEl = document.querySelector(".text-container");
var backButton = document.querySelector(".back-button");
var resetButton = document.querySelector(".reset-button");
var listEl = document.querySelector(".highscore-list-container");
var buttonContainer = document.querySelector(".button-container");

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
        question: "How do you convert string to objects using JSON?",
        choice1: "JSON.parse()",
        choice2: "JSON.stringify()",
        choice3: "JSON.string()",
        choice4: "None of the above",
        answer: "1"
    },
    {
        question: "Which of the following Number object function formats a number with a specific number of digits to the right of the decimal?",
        choice1: "toExponential()",
        choice2: "toFixed()",
        choice3: "toPrecision()",
        choice4: "toLocaleString",
        answer: "2"
    },
    {
        question: "Which built-in method adds one or more elements to the end of an array and returns the new length of the array?",
        choice1: "last()",
        choice2: "put()",
        choice3: "push()",
        choice4: "None of the above",
        answer: "3"
    }
];
var gameStatus = false;
var sortArrayQuestions = [];
var choiceArray = [];
var currentQuestionIndex = 0;
var currentSortArrayIndex = 0;
var score = 0;

// Timer that counts down from 120
function countdown(timeLeft) {
    // made this function so that it could be used whether a number is passed or not
    // if there is no number passed, assume that it is called to initially start the timer
    if (!timeLeft) {
        timeLeft = 120;
    }
  
    timeInterval = setInterval(function () {
        if (timeLeft > -1) {
            timerEl.textContent = timeLeft;
            timeLeft--;
        } else {
            // if timeLeft reaches 0, the game is over
            gameStatus = false;
            gameOver();
        }
    }, 1000);
}

// randomise the questionArray
function randomSort(arr) {
    var count = arr.length;
    var index = 0;

    for (var i = 0; i < count; i++) {
        index = Math.abs(Math.floor(Math.random() * count));
        while (sortArrayQuestions.includes(index)) {
            index = Math.abs(Math.floor(Math.random() * count));
        }
        sortArrayQuestions[i] = index;
    }
}

// "Flashes" the Correct or Incorrect text after clicking the answer 
function flashText() {
    var timeOut = 3;
    var timeFooter;
    var footerQuestionEl = document.querySelector(".question-footer");

    timeFooter = setInterval(function () { 
        if (timeOut > 1) {
            timeOut--;
        } else {
            //once three seconds is over, make the question-footer hide again
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
    var listClass = 0;
    
    // replace header with question and move choices into a separate array
    currentQuestionIndex = sortArrayQuestions[currentSortArrayIndex];
    questionEl.textContent = questionArray[currentQuestionIndex].question;
    choiceArray = [
        questionArray[currentQuestionIndex].choice1,
        questionArray[currentQuestionIndex].choice2,
        questionArray[currentQuestionIndex].choice3,
        questionArray[currentQuestionIndex].choice4
    ];
    
    if (currentSortArrayIndex === 0) {
        // this handles the initial creation of answer buttons
        // remove text-container and add buttons for choices
        boxEl.removeChild(textEl);
        boxEl.setAttribute("style", "text-align: left;");

        ul = document.createElement("ul");
        ul.setAttribute("id", "choices");
        boxEl.appendChild(ul);

        // create 'footer' to show if answer is correct or not
        footerQuestionEl = document.createElement("div");
        footerQuestionEl.setAttribute("class", "question-footer");
        footerQuestionEl.setAttribute("style", "display: none;");
        boxEl.append(footerQuestionEl);
    
        footerHeader = document.createElement("h2");
        footerHeader.setAttribute("class", "question-head");
        footerQuestionEl.append(footerHeader);

        // Create button for every choice
        // add a class for each so that I could get it again later to check it against questionArray[answer]
        choiceArray.forEach(function(element, index) {
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
        choiceArray.forEach(function(element, index) {
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
    // remove button choices
    var ul = document.querySelector("#choices");
    var footer = document.querySelector(".question-footer");
    boxEl.removeChild(ul);
    boxEl.removeChild(footer);

    // replace header new text and depending on the score either put Congrats or Better luck next time
    questionEl.textContent = (score >= Math.round(questionArray.length * 0.70)) ? "Congratulations! All done!" : "Better luck next time! All done!";

    // create the elements for the end-of-game page (form input, form button, and text)
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
    inputForm.setAttribute("type", "text");
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
    // get stored userScores from localStorage
    var userScores = JSON.parse(localStorage.getItem("userScores"));
    
    var userNewScore = {
        name: document.querySelector("input").value.trim(),
        score: score
    };

    // don't accept blank 
    if (userNewScore.name === "") {
        window.alert("Initials cannot be blank");
        return;
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
        scoreArray = scoreArray.sort(function (c1, c2) { return c2.score - c1.score; });
    }

    localStorage.setItem("userScores", JSON.stringify(scoreArray));
    // change webpage
    window.location.href = "./highscores.html";
    
    if (window.onload && window.location.href === './highscores.html') {
        loadScores();   
    } 
}

boxEl.addEventListener("click", function (event) {
    var element = event.target;
    var timeLeft;
    var footerQuestionEl = document.querySelector(".question-footer");
    var footerHeader = document.querySelector(".question-head");
    
    // only care for clicks done on buttons
    if (element.matches("button")) {
        var chosenAnswer = element.getAttribute("class");

        switch (chosenAnswer) {
            case "start-button":
                // do event when start button is clicked.
                sortArrayQuestions = [];    // initialise sort everytime the start button is pressed
                currentQuestionIndex = 0;   // this would be the first element of the randomised array questions
                gameStatus = true;
            
                randomSort(questionArray);
                initQuestion(currentSortArrayIndex);
                
                // initially start counter with timeLeft = 120 seconds
                countdown();
                break;
            case "back-button":
                window.location.href = "./index.html";
                break;
            case "reset-button":
                localStorage.setItem("userScores", null);
        
                // remove ul and li elements
                var ul = document.querySelector("#highscore-list");
                listEl.removeChild(ul);
                // also remove clear highscores
                buttonContainer.removeChild(resetButton);
                break;
            default:
                footerQuestionEl.setAttribute("style", "font-style: italic; border-top: 3px black solid");
                if (chosenAnswer === questionArray[currentQuestionIndex].answer) {
                    footerHeader.textContent = "Correct!";
                    // show footer
                    flashText();
                    score++;
                    if (currentSortArrayIndex < questionArray.length - 1) {
                        // show the next question
                        currentSortArrayIndex++;
                        initQuestion(currentSortArrayIndex);
                    } else {
                        footerQuestionEl.setAttribute("style", "display: none;");
                        gameStatus = false;
                        gameOver();
                    }
                } else {
                    // Stop current timer, adjust timeLeft, and start countdown again with new timeLeft value
                    footerHeader.textContent = "Incorrect!";
                    flashText();

                    clearInterval(timeInterval);
                    timeLeft = timerEl.textContent - 10;
                    if (timeLeft <= 0) {
                        // if time reaches 0, game is over
                        timerEl.textContent = 0;
                        footerQuestionEl.setAttribute("style", "display: none;");
                        gameStatus = false;
                        gameOver();
                    }
                    countdown(timeLeft);
                }
                break;
        }
    }
});

// function to load the scores into highscores.html
function loadScores() {
    // create an unordered list and append every item in the userScores object into a list item
    var ul = document.createElement("ul");
    ul.setAttribute("id", "highscore-list");
    ul.setAttribute("style", "text-align: left;")
    listEl.appendChild(ul);

    var userScores = JSON.parse(localStorage.getItem("userScores"));
    
    //  read each array and get its name and score
    if (userScores !== null) {
        userScores.forEach((element, index) => {
            li = document.createElement("li");
            listClass = index + 1;
            li.setAttribute("class", "li-" + listClass);
            li.textContent = listClass + ". " + element.name + " - " + element.score;
            ul.appendChild(li);    
        });        
    } else {
        // remove the reset button when the userScores is empty
        buttonContainer.removeChild(resetButton);
    }
}