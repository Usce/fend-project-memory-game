/*
 * Create a list that holds all of your cards
 */
let cardClasses = [
    'fa-diamond', 'fa-paper-plane-o',
    'fa-anchor', 'fa-bolt',
    'fa-cube', 'fa-anchor',
    'fa-leaf', 'fa-bicycle',
    'fa-diamond', 'fa-bomb',
    'fa-leaf', 'fa-bomb',
    'fa-bolt', 'fa-bicycle',
    'fa-paper-plane-o', 'fa-cube'];
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
let playAgain = document.querySelector('.play-again');
let time = document.getElementById('time');
let countEl = document.getElementById('countEL');
let star = '<li><i class="fa fa-star"></i></li>';
let openCardsList = [];
let numberTracker = 0;
let seconds = 0;
let isRunning = true;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//Shufflign cards function, where argument is element in which card will be append
function cardShuffler(deck){
    let container = "";
    let cardsShuffled = shuffle(cardClasses);
    for (card of cardsShuffled){
        container += `<li class="card"><i class="fa ${card}"></i></li>`;
    }
    deck.innerHTML=container;
}

cardShuffler(deck);

// Timer function used to increment seconds and display results if game is finished
setInterval(function() {
    if(isRunning){
        seconds++
        countEl.innerHTML=seconds;
    } else {
        countEl.innerHTML=seconds;
        }
    }, 1000);



// Show cards by adding necessary CSS classes
function showCard(elem) {
    elem.classList.add('open', 'show', 'pointer-events-disabled');
}

// Add clicked card to array to track if card is paired
function addCardToList(elem) {
    openCardsList.push(elem);
}

// Check if clicked element is the same as one previously stored(clicked) in array
function cardsMatch(elem) {
    openCardsList[openCardsList.length-1].classList.add('match');
    elem.classList.add('match');
    openCardsList = [];
}

/*
*  If cards don't match, remove all classes and reset to default. While
*  cards are being shown, mouse events are disabled to prevent further cards
*  showing while currents are being shown. SetTimout to 1s so that user can see
*  the cards before classes are removed
*/
function cardsNoMatch(elem) {
    showCard(elem);
    deck.classList.add('pointer-events-disabled');
    elem.classList.add('nomatch');
    openCardsList[openCardsList.length-1].classList.add('nomatch');
    setTimeout(function(){
        openCardsList[openCardsList.length-1].classList.remove('open', 'show', 'pointer-events-disabled', 'nomatch');
        elem.classList.remove('open', 'show', 'pointer-events-disabled', 'nomatch');
        openCardsList = [];
        deck.classList.remove('pointer-events-disabled');
    }, 1000);
}

/*
*  As user opens cards count moves in numberTracker. Adjust move/moves wording depending
*  on count. Remove stars as count goes up (as user wrong moves increment numberTracker)
*/
function trackMoves(){
    numberTracker++;
    movesElem.textContent=numberTracker;
    numberTracker === 1 ? movesText.textContent="Move" : movesText.textContent="Moves";
    // Adjust star rating based on moves
    if (numberTracker === 13) {
        stars.lastElementChild.remove();
    } else if (numberTracker === 17) {
        stars.lastElementChild.remove();
    }
}

/*
*  Initiated on play again button or restart icon.
*  Alert prompt asks user to confirm starting a new game.
*  If user confirms, are settings and variables are reset, and
*  card deck is shuffled again, thus, new set of cards is created and append to deck.
*/
function restartGame() {
    if (window.confirm("You're about to start a new game. Previous result will not be saved.")){
        for (card of cards) {
            card.classList.remove('open', 'show', 'match', 'pointer-events-disabled');
        }
        movesText.textContent="No moves";
        if (movesElem.firstChild){
            movesElem.firstChild.remove();
        }
        winBox.classList.remove('show-popup');
        numberTracker = 0;
        openCardsList = [];
        seconds = 0;
        stars.innerHTML=star.repeat(3);
        cardShuffler(deck);
    }
}

/*
*  Initiated when matched cards array (HTML collection) has 16 items, meaning
*  16 cards have class of 'match', which means game is finished.
*  Pop-up box appear with results, showing number of moves, star rating,
*  time used to finish the game, and a button to reinitiate the game, which if clicked
*  will initiate restartGame()
*/
function allMatch() {
    if (matchedCards.length === 16) {
        movesStats.innerHTML=numberTracker;
        starsStats.innerHTML=stars.childElementCount;
        time.innerHTML=seconds;
        isRunning = false;
        winBox.classList.add('show-popup');
        setTimeout(function(){
            winBox.firstElementChild.classList.remove('dnone');
        }, 100);
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
    // check if event target is actuall card
    if (e.target.nodeName === 'LI'){
        let currentElem = e.target;
        // show card clicked
        showCard(currentElem);
        // If array of open cards has at least 1 item
        if (openCardsList.length > 0){
            // Then check the last item of array and element currently clicked
            if (openCardsList[openCardsList.length-1].innerHTML === currentElem.innerHTML){
                cardsMatch(currentElem);
                trackMoves();
                allMatch();
            } else {
                cardsNoMatch(currentElem);
                trackMoves();
            }
        } else {
            addCardToList(currentElem);
        }
    }
});

// listen for clicks on restart and playAgain elements
restart.addEventListener('click', restartGame);
playAgain.addEventListener('click', restartGame);
