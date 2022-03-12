// store in var all relevant HTML elements
var timerEl = document.querySelector(".timer");
var startButton = document.querySelector(".start-button");
var boxEl = document.querySelector(".box");
var questionEl = document.querySelector(".text-heading");
var textEl = document.querySelector(".text-container");

// variables for gameplay
// questions are from https://www.interviewbit.com/javascript-mcq/
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
    }
]
var gameStatus = false;
var sortArrayQuestions = [];
var choiceArray = [];
var currentQuestionIndex = 0;
var currentSortArrayIndex = 0;
var score = 0;

// Timer that counts down from 10
function countdown(timeLeft) {
    if (typeof timeLeft === 'undefined') {
        timeLeft = 120;
    }
  
    // Use the `setInterval()` method to call a function to be executed every 1000 milliseconds
    timeInterval = setInterval(function () {
      // As long as the `timeLeft` is greater than 1
      if (timeLeft > -1) {
        // Set the `textContent` of `timerEl` to show the remaining seconds
        timerEl.textContent = timeLeft;
        // Decrement `timeLeft` by 1
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

function initQuestion(currentSortArrayIndex) {
    // remove the current elements inside boxEl except for H1
    // thendynamically create a list for the button answers
    var ul;
    var li;
    var button;
    var buttonOld;
    currentQuestionIndex = sortArrayQuestions[currentSortArrayIndex];

    // replace header with question and move choice into a separate array
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
    
        choiceArray.forEach((element, index) => {
            li = document.createElement("li");
            button = document.createElement("button");
            listClass = index+1;
            // li.setAttribute("style","margin: 2px;")
            li.setAttribute("class", "li-"+listClass);
            button.textContent = listClass + ". " + element + " ";
            button.setAttribute("class", listClass);
            button.setAttribute("style", "height: 25px;");  //width: 30vw; 
            ul.appendChild(li);
            li.appendChild(button);

        });
    } else {
        // if next questions are loaded, just replace the current buttons' textContent with the new question's ones
        choiceArray.forEach((element, index) => {
            listClass = index + 1;
            li = document.getElementsByClassName("li-"+listClass);
            button = document.createElement("button");
            buttonOld = document.getElementsByClassName(listClass);
            // li.setAttribute("style","margin: 2px;")
            button.textContent = listClass + ". " + element + " ";
            button.setAttribute("class", listClass);
            button.setAttribute("style", "height: 25px;"); //width: 30vw; 
            li[0].appendChild(button);
            buttonOld[0].replaceWith(button)

        });
    }
}

function gameOver() {
    clearInterval(timeInterval);
    // remove ul and li elements
    var ul = document.querySelector("#choices");
    boxEl.removeChild(ul);

    // replace header new text
    questionEl.textContent = "Congratulations! All done!"
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
    buttonForm.setAttribute("style", "width: 10vw; height: 25px;");
    buttonForm.textContent = " Submit ";
    labelForm.appendChild(buttonForm);
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

    if (element.matches("button")) {
        var chosenAnswer = element.getAttribute("class");

        if (chosenAnswer !== "start-button") {
            if (chosenAnswer === questionArray[currentQuestionIndex].answer) {
                window.alert("Correct!");
                score++;
                if (currentSortArrayIndex < questionArray.length-1) {
                    currentSortArrayIndex++;
                    initQuestion(currentSortArrayIndex);
                } else {
                    gameStatus = false;
                    gameOver();
                }
            } else {
                // Stop current timer, adjust timeLeft, and start countdown again with new timeLeft value
                clearInterval(timeInterval);
                timeLeft = timerEl.textContent;
                timeLeft -= 10;
                if (timeLeft === 0) {
                    gameStatus = false;
                    gameOver();
                }
                countdown(timeLeft);
            }
            
        }
    }
})

document.addEventListener('click',function(e){
    if(e.target.className === 'submit-button'){
        e.preventDefault();

        var userObject = {
            name: document.querySelector("input").value.trim(),
            score: score
        }

        if (userObject.name === "") {
            displayMessage("error", "Initials cannot be blank");
        }

        localStorage.setItem("userObject", JSON.stringify(userObject));
        document.location = "./highscores.html"
     }
 });