"use strict;"
let countdownTimer;
let duration = 30;
let originalDuration = 30;
let matches = 0;
let numOfPokemon = 3;
let clicks = 0;
let powerupCounter = 3;
let gameGridWidth = 600;
let gameGridHeight = 400;
let cardWidth = 33.3;
let cardMatched = [];

function easySettings() {
  originalDuration = 30;
  duration = 30;
  gameGridWidth = 600;
  gameGridHeight = 400;
  numOfPokemon = 3;
  cardWidth = 33.3;
  reset();
}

function mediumSettings(){
  originalDuration = 90;
  duration = 90;
  gameGridWidth = 1000;
  gameGridHeight = 1000;
  numOfPokemon = 8;
  cardWidth = 25;
  reset();
}

function hardSettings(){
  originalDuration = 210;
  duration = 210;
  gameGridWidth = 1700;
  gameGridHeight = 1700;
  numOfPokemon = 18;
  cardWidth = 16.6;
  reset();
}

function updateStatus(){
  let pairsRemaining = numOfPokemon - matches;
  let numOfMatches = document.getElementById("numOfMatches");
  numOfMatches.innerHTML = "Cards Matched: " + matches;
  let numOfPairs = document.getElementById("numOfPairs");
  numOfPairs.innerHTML = "Number of pairs left: " + pairsRemaining;
  let numOfClicks = document.getElementById("numOfClicks");
  numOfClicks.innerHTML = "Total Clicks: " + clicks;
  
  // let numOfUses = document.getElementById("powerup");
  // numOfUses.innerText = "Uses left: " + powerupCounter;

  if (pairsRemaining == 0) {
    clearInterval(countdownTimer);
    let message = document.getElementById("timer");
    message.innerHTML = ("You win!");
  }
  let powerupButton = document.getElementById("powerupButton");
  powerupButton.innerText = `Power Up (${powerupCounter})`;
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showAllCards() {
  powerupCounter--;
  const cards = document.querySelectorAll('.card');
  const powerUpButton = document.getElementById("powerupButton");
  cards.forEach(element => {    
    element.classList.add("flip");
  });
  setTimeout(() => {
   hideAllCards();
  }, 2000);
  updateStatus();
  if (powerupCounter == 0) {
    powerUpButton.setAttribute("disabled", true);
  }

}

function hideAllCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(element => {
    if (cardMatched.indexOf(element.children[0].src) == -1 ) {
      element.classList.remove("flip");
    }
  });
}

function reset() {
  document.getElementById("game_grid").innerHTML = "";
  powerupCounter = 3;
  clicks = 0;
  matches = 0;
  duration = originalDuration;
  clearInterval(countdownTimer);
  let message = document.getElementById("timer");
  message.innerHTML = "";
  const powerUpButton = document.getElementById("powerupButton");
  powerUpButton.removeAttribute('disabled');
  // powerUpButton.setAttribute("disabled", false);
  setup();
}

function darkMode(){
  document.getElementById("game_grid").classList.add('dark');
}

function lightMode(){
  document.getElementById("game_grid").classList.remove('dark');
}

function timer(){
    countdownTimer = setInterval(function(){
        let time = document.getElementById('timer');
        time.innerHTML = duration + " seconds left";
        duration--;
        if (duration < 0) {
          if (numOfPokemon - matches != 0){
            time.innerHTML = "You lose!";
            clearInterval(countdownTimer);
          }
          
            
        }
    }, 1000);
}

function start(){
  addOnClickEventToCard();
  timer();
}

async function setup() {
  let pokemonArray = [];
  for (let i = 1; i <= numOfPokemon; i++) {
    let randomNum = Math.floor(Math.random() * 1025) + 1;
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`);
    let pokemonInfoObj = await response.json();
    pokemonArray.push(pokemonInfoObj);
    pokemonArray.push(pokemonInfoObj);

    console.log(pokemonArray);
  }

  shuffle(pokemonArray);
  for (let i = 0; i < pokemonArray.length; i++) {
    let gameGrid = document.getElementById("game_grid");
    let divCard = document.createElement("div");
    gameGrid.style.width = `${gameGridWidth}px`;
    gameGrid.style.height =`${gameGridHeight}px`;
    divCard.className = "card";
    divCard.style.width = `${cardWidth}%`;

    let frontImage = document.createElement("img");
    frontImage.className = "front_face";
    frontImage.setAttribute("id", `img${i}`);
    frontImage.src = pokemonArray[i].sprites.other['official-artwork'].front_default;

    let backImage = document.createElement("img");
    backImage.className = "back_face";
    backImage.src = "back.webp";

    divCard.appendChild(frontImage);
    divCard.appendChild(backImage);
    gameGrid.appendChild(divCard);
  }
  
  updateStatus();
}

function addOnClickEventToCard(){
  let firstCard = undefined
  let secondCard = undefined
  $(".card").on(("click"), function () {

    console.log("clicked");
    if (!firstCard){
      firstCard = $(this).find(".front_face")[0]
      $(this).toggleClass("flip");
    } else {
      secondCard = $(this).find(".front_face")[0]
      console.log(firstCard.id, secondCard.id);
      if (firstCard.id == secondCard.id) {
        return;
      }
      $(this).toggleClass("flip");
      clicks++;
      updateStatus();
      if (firstCard.src == secondCard.src) {
        console.log("match");
        matches++;
        cardMatched.push(firstCard.src);
        updateStatus();
       
        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
        firstCard = undefined;
        secondCard = undefined;
      } else {
        console.log("no match");
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip")
          $(`#${secondCard.id}`).parent().toggleClass("flip")
          firstCard = undefined;
          secondCard = undefined;
        }, 1000);
        updateStatus();
      }
    }
  });
}
