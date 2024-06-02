// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let currentIndex = 0;
let rightAnswers = 0;
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownInterval;
let countDownSpan = document.querySelector('.countdown')

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      createBullets(qCount);
      // add questions data
      addQuestionData(questionsObject[currentIndex], qCount);
      countDown(3, qCount)
      submitButton.onclick = () => {
        // get right answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], qCount);

        handleBullets();
        clearInterval(countDownInterval)
        countDown(3, qCount)
        // show results
        showResults(qCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();
function createBullets(num) {
  countSpan.innerHTML = num;
  // Create Spans
  for (i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    for (i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.name = "questions";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  console.log(`right answer is ${rAnswer}`);
  console.log(`theChosen answer is ${theChosenAnswer}`);
  if (rAnswer == theChosenAnswer) {
    rightAnswers++;
    console.log("Good Answer");
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class = "good" >Good</span>, ${rightAnswers} From ${count} Is Good.`;
    } else if (rightAnswers === count) {
      theResults = `<span class = "perfect" >Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class = "bad" >Bad</span>, ${rightAnswers} From ${count} Is BAD.`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}`: minutes;
      seconds = seconds < 10 ? `0${seconds}`: seconds;
      countDownSpan.innerHTML = `${minutes}:${seconds}`
      if(--duration < 0) {
        clearInterval(countDownInterval)
        submitButton.click();
      }
    }, 1000);
  }
}
