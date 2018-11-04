/*
 * Create a list that holds all of your cards
 */
let cards = document.getElementsByClassName('card');
let matchedCards = document.getElementsByClassName('match');
let deck = document.querySelector('.deck');
let restart = document.querySelector('.restart');
let movesElem = document.querySelector('.moves');
let movesText = document.querySelector('.movestext');
let stars = document.querySelector('.stars');
let movesStats = document.querySelector('.moves-stats');
let starsStats = document.querySelector('.stars-stats');
let winBox = document.querySelector('.win-popup');
let openCardsList = [];
let numberTracker = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function cardShuffler(){
   let shuffleCards = shuffle(cards);
   for(let card of shuffleCards){
     deck.appendChild(card);
   }
}

cardShuffler();

function showCard(elem) {
    elem.classList.add('open', 'show', 'pointer-events-disabled');
}

function addCardToList(elem) {
    openCardsList.push(elem);
}

function cardsMatch(elem) {
    openCardsList[openCardsList.length-1].classList.add('match');
    elem.classList.add('match');
    openCardsList = [];
}

function cardsNoMatch(elem) {
    showCard(elem);
    deck.classList.add('pointer-events-disabled');
    // set timeout to prolongate time for .open and .show class removal to maintain visiblity of cards for user
    setTimeout(function(){
        openCardsList[openCardsList.length-1].classList.remove('open', 'show', 'pointer-events-disabled');
        elem.classList.remove('open', 'show', 'pointer-events-disabled');
        openCardsList = [];
        deck.classList.remove('pointer-events-disabled');
    }, 1000);
}

function trackMoves(){
    numberTracker++;
    movesElem.textContent=numberTracker;
    numberTracker === 1 ? movesText.textContent="Move" : movesText.textContent="Moves";
    // Adjust star rating based on moves
    if(numberTracker === 13) {
        stars.lastElementChild.remove();
    } else if (numberTracker === 17) {
        stars.lastElementChild.remove();
    }
}

function restartGame() {
    if(window.confirm('NOTE: If you restart, you will lose all your progress!')){
        for(card of cards) {
            card.classList.remove('open', 'show', 'match', 'pointer-events-disabled');
        }
        movesText.textContent="No moves";
        movesElem.firstChild.remove();
        numberTracker = 0;
        openCardsList = [];
        cardShuffler();
    }
}

function allMatch() {
    if(matchedCards.length === 16) {
        movesStats.innerHTML=numberTracker;
        starsStats.innerHTML=stars.childElementCount;
        winBox.classList.add('show-popup');
        setTimeout(function(){
            winBox.firstElementChild.classList.remove('dnone');
        }, 100);
        console.log("you won");
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
// adding event lister to whole deck, so we don't have to add 16 of them (one for each card)
deck.addEventListener('click', function(e){
    if(e.target.nodeName === 'LI'){
        let currentElem = e.target;
        showCard(currentElem);
        if(openCardsList.length > 0){
            if(openCardsList[openCardsList.length-1].innerHTML === currentElem.innerHTML){
                cardsMatch(currentElem);
                trackMoves();
                allMatch();
            } else {
                cardsNoMatch(currentElem);
                trackMoves();
            }
        }
        else {
            addCardToList(currentElem);
        }
    }
});

restart.addEventListener('click', restartGame);
