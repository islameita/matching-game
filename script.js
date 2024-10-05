//LET & CONST

const DECK = document.getElementById("deck");
const CARDS = document.getElementsByClassName("card");
const MATCHED_COUPLE_DISPLAY = document.getElementById("matchedCoupleDisplay");
const MOVES_NUMBER_DISPLAY = document.getElementById("movesNumberDisplay");
const RESTART_BUTTON = document.getElementById("restartButton");
const PREVIOUS_SCORE_TABLE = document.getElementById("previous-score__table");
const PREVIOUS_SCORE_CNT = document.getElementById("previous-score__container");

let openCardsHC = document.getElementsByClassName("open show");
let toBeReflippedHC = document.getElementsByClassName("toBeReflipped");
let matchCardsHC = document.getElementsByClassName("match");
let movesNumber = 0;
let matchedCouplesNumber = 0;
let starRating = 3;
let matchNumber = 1;

//TIMER
let sec = 0;
function myInterval() {
  sec++;
  document.getElementById("secondsElapsed").textContent = sec;
}
let timer = setInterval(myInterval, 1000);

//Call function to shuffle cards and create HTML to display the cards
function newGame() {
  let cardsList = Array.prototype.slice.call(CARDS);
  cardsList = shuffle(cardsList);
  for (var i = 0; i < cardsList.length; i++) {
    DECK.appendChild(cardsList[i]);
    //cardsList[i].setAttribute("id", i);
  }
}
newGame();

//Calls newGame function, reset timer, reset open/shown/matched cards, reset move number and matched cards number, reset star rating.
function restartGame() {
  newGame();
  DECK.classList.add("shake-to-shuffle");

  clearInterval(timer);
  sec = 0;
  document.getElementById("secondsElapsed").textContent = sec;
  timer = setInterval(myInterval, 1000);

  if (matchCardsHC.length > 0 || openCardsHC.length > 0) {
    resetCards();
  }
  if (movesNumber !== 0) {
    movesNumber = 0;
    MOVES_NUMBER_DISPLAY.textContent = movesNumber;
  }
  if (matchedCouplesNumber !== 0) {
    matchedCouplesNumber = 0;
    MATCHED_COUPLE_DISPLAY.textContent = matchedCouplesNumber;
  }

  starRating = 3;
  const ALL_STARS_HC = document.getElementsByClassName("star");
  const ALL_STARS_ARRAY = Array.prototype.slice.call(ALL_STARS_HC);
  ALL_STARS_ARRAY.forEach(function (star) {
    star.className = "fa fa-star star";
  });

  matchNumber++;
}

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function flipCard(evt) {
  let flippedCard = evt.target.closest("li"); // Get the closest <li> element

  if (
    flippedCard &&
    !flippedCard.classList.contains("match") &&
    !flippedCard.classList.contains("open")
  ) {
    flippedCard.classList.add("open", "show"); // Add classes to show the card's image
  }

  let openCardsArray = Array.prototype.slice.call(openCardsHC);
  if (openCardsArray.length === 2) {
    checkIfMatching(); // Check if the two open cards match
  }
  if (openCardsArray.length > 2) {
    flipOpenCards(); // Close extra open cards if necessary
  }
}

function checkIfMatching() {
  let openCardsArray = Array.prototype.slice.call(openCardsHC);

  // Get the <img> elements of the two open cards
  let firstCardImg = openCardsArray[0].querySelector("img");
  let secondCardImg = openCardsArray[1].querySelector("img");

  // Compare the className of the images to check for a match
  if (firstCardImg.className === secondCardImg.className) {
    openCardsArray.forEach(function (card) {
      card.classList.add("match"); // Keep the cards open if they match
    });
    handleMatchedCards();
    incrementMatchedCouples();
    setTimeout(checkIfGameOver, 1200);
  } else {
    openCardsArray.forEach(function (card) {
      card.classList.add("toBeReflipped"); // Mark the cards to be hidden
    });
    setTimeout(flipOpenCards, 1200); // Hide the cards after a delay if they don't match
  }

  incrementMovesNumber();
  setTimeout(checkMovesNumber, 1200);
}

function flipOpenCards() {
  let toBeReflipped = Array.prototype.slice.call(toBeReflippedHC);

  // Hide the cards that didn't match
  toBeReflipped.forEach(function (card) {
    card.classList.remove("open", "show", "toBeReflipped"); // Hide the image by removing classes
  });

  let openCardsArray = Array.prototype.slice.call(openCardsHC);
  if (openCardsArray.length > 1) {
    openCardsArray.forEach(function (card) {
      card.classList.remove("open", "show"); // Close any extra open cards
    });
  }
}


//remove open/show class to the matched couple
function handleMatchedCards() {
  let matchCardsArray = Array.prototype.slice.call(matchCardsHC);
  matchCardsArray.forEach(function (card) {
    card.classList.remove("open", "show");
  });
}

//remove open/show/match class to all matched cards.
function resetCards() {
  let openCardsArray = Array.prototype.slice.call(openCardsHC);
  openCardsArray.forEach(function (card) {
    card.classList.remove("open", "show");
  });
  let matchCardsArray = Array.prototype.slice.call(matchCardsHC);
  matchCardsArray.forEach(function (card) {
    card.classList.remove("match");
  });
}

//Increment moves number and display it
function incrementMovesNumber() {
  movesNumber++;
  MOVES_NUMBER_DISPLAY.textContent = movesNumber;
}

//Increment matched couple number and display it
function incrementMatchedCouples() {
  matchedCouplesNumber++;
  MATCHED_COUPLE_DISPLAY.textContent = matchedCouplesNumber;
}

//Check if all the couples have been matched, return alert according to star rating, stops timer
function checkIfGameOver() {
  let matchCardsArray = Array.prototype.slice.call(matchCardsHC);
  if (matchCardsArray.length === 16) {
    let alertMessage;
    let gameStatsMessage;

    if (starRating === 3) {
      alertMessage = "You won! You have amazing memory skills!!";
    } else if (starRating === 2.5) {
      alertMessage = "You won! You have good memory skills!!";
    } else if (starRating === 2) {
      alertMessage = "You won! Good job!!";
    } else if (starRating === 1.5) {
      alertMessage = "You won! Keep exercising to improve your memory skills!!";
    } else if (starRating === 1) {
      alertMessage =
        "You won! Try finding the matching cards with less moves next time!!";
    } else if (starRating === 0.5) {
      alertMessage =
        "You were close to the maximum number of moves... But you won!!";
    }
    gameStatsMessage =
      "\nTime elapsed: " + sec + " seconds" + "\nTotal moves: " + movesNumber;
    if (starRating >= 2) {
      gameStatsMessage += "\nYour rating: " + starRating + " stars";
    } else if (starRating <= 1.5) {
      gameStatsMessage += "\nYour rating: " + starRating + " star";
    }
    alert(alertMessage + gameStatsMessage);
    recordLastScore();
    clearInterval(timer);
  } else {
    return;
  }
}

//Check moves number to change star rating and check if maximum number of moves has been reached
function checkMovesNumber() {
  const STAR_1 = document.getElementById("star1");
  const STAR_2 = document.getElementById("star2");
  const STAR_3 = document.getElementById("star3");
  if (movesNumber > 14 && movesNumber <= 18) {
    starRating = 2.5;
    STAR_3.classList.remove("fa-star");
    STAR_3.classList.add("fa-star-half-o");
  } else if (movesNumber > 18 && movesNumber <= 22) {
    starRating = 2;
    STAR_3.classList.remove("fa-star-half-o");
    STAR_3.classList.add("fa-star-o");
  } else if (movesNumber > 22 && movesNumber <= 26) {
    starRating = 1.5;
    STAR_2.classList.remove("fa-star");
    STAR_2.classList.add("fa-star-half-o");
  } else if (movesNumber > 26 && movesNumber <= 30) {
    starRating = 1;
    STAR_2.classList.remove("fa-star-half-o");
    STAR_2.classList.add("fa-star-o");
  } else if (movesNumber > 30 && movesNumber <= 34) {
    starRating = 0.5;
    STAR_1.classList.remove("fa-star");
    STAR_1.classList.add("fa-star-half-o");
  } else if (movesNumber > 34) {
    starRating = 0;
    STAR_1.classList.remove("fa-star-half-o");
    STAR_1.classList.add("fa-star-o");
    alert(
      "Game over! You made too many moves! Try again!\nTotal moves: " +
        movesNumber +
        "\nTime elapsed: " +
        sec +
        " seconds" +
        "\nYour rating: " +
        starRating +
        " stars"
    );
    clearInterval(timer);
  } else {
    return;
  }
}

//Short function that removes the shuffle class from deck, so that it can be reapplied the next time the restart button is clicked
function removeDeckShuffleClass() {
  DECK.classList.remove("shake-to-shuffle");
}

//Create a row on the Previous Score table to record the game stats in case of victory
function recordLastScore() {
  let newLineScore =
    "<tr><td>" +
    matchNumber +
    "</td><td>" +
    sec +
    " sec</td><td>" +
    movesNumber +
    "</td><td>" +
    starRating +
    "</td></tr>";
  PREVIOUS_SCORE_TABLE.insertAdjacentHTML("beforeend", newLineScore);
  PREVIOUS_SCORE_CNT.style.display = "block";
}

//EVENT LISTENERS
DECK.addEventListener("click", flipCard);
RESTART_BUTTON.addEventListener("click", restartGame);
RESTART_BUTTON.addEventListener("mouseover", removeDeckShuffleClass);
