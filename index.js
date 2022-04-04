console.log("This is index.js file")
let blackjackGameObject = {
    'you':{'scoreSpan':'#your-blackjack-result','div':'#yourBox','score':0},
    'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealerBox','score':0},
    'card':['2','3','4','5','6','7','8','9','10','A','J','K','Q'],
    'cardScore':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'K':10,'Q':10,'A':[1,11]},
    'win':0,
    'loose':0,
    'draw':0,
    'isStand':false,
    'turnsOver':false,

}
const you = blackjackGameObject.you;
const dealer = blackjackGameObject.dealer;
const card = blackjackGameObject.card;

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const looseSound = new Audio('sounds/aww.mp3');
let buttons = document.querySelectorAll(".btn");
buttons.forEach((button)=>{
    button.addEventListener("click",(e)=>{
        if(e.target.classList.contains("hit")){
            if(blackjackGameObject['isStand'] === false){
                let randomCardImage = selectingRandomCardImage();
                showCard(you,randomCardImage); 
                updatingScore(you,randomCardImage);  
                showingScore(you);
            }

        }
        if(e.target.classList.contains("deal")){
             removeCard();
             
               
        }
        if(e.target.classList.contains("stand")){
            // console.log("stand clicked");
            dealerSideActivity();
        }
    })
})
function selectingRandomCardImage(){
    let randomIndex =Math.floor(Math.random()*card.length);
    return card[randomIndex];
}
function showCard(activePlayer,randomCardImage){
    if(activePlayer.score<21){
     let cardImage = document.createElement("img");
     cardImage.src = `img/${randomCardImage}.png`;
     document.querySelector(activePlayer.div).appendChild(cardImage);
    hitSound.play();
    }

 }
  function removeCard(){
      if(blackjackGameObject['turnsOver'] === true){
    blackjackGameObject['isStand'] = false;
     let yourImageInsideBox = document.querySelector(you.div).querySelectorAll("img");
     let dealerImageInsideBox = document.querySelector(dealer.div).querySelectorAll("img");
       yourImageInsideBox.forEach((image)=>{
           image.remove();
       })
       dealerImageInsideBox.forEach((image)=>{
           image.remove();
       })
       you.score=0;
       dealer.score = 0;
       document.querySelector(you.scoreSpan).textContent = 0;
       document.querySelector(dealer.scoreSpan).textContent = 0;
       document.querySelector(you.scoreSpan).style.color="white"
       document.querySelector(dealer.scoreSpan).style.color="white"
       document.querySelector("#blackjack-result").innerHTML=`Let's Play`;
       document.querySelector("#blackjack-result").style.color=`black`;
       blackjackGameObject['turnsOver']=true;
    }
 }
 function updatingScore(activePlayer,card){
     if(card==='A'){
        if(activePlayer.score+blackjackGameObject.cardScore[card][1]  <=21){
            activePlayer.score+=blackjackGameObject.cardScore[card][1];
        }else{
            activePlayer.score+=blackjackGameObject.cardScore[card][0];
        }
     }else{
        activePlayer.score+=blackjackGameObject.cardScore[card];
     }
 
 }
 function showingScore(activePlayer){
     if(activePlayer.score>21){
        document.querySelector(activePlayer.scoreSpan).textContent = `!BUST`; 
        document.querySelector(activePlayer.scoreSpan).style.color = 'red';
     }else{
        document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score;
     }
 }
 function sleep(ms){
     return new Promise(resolve=>setTimeout(resolve,ms))
 }
async function dealerSideActivity(){
    blackjackGameObject['isStand']=true;
    while(dealer['score']<16 && blackjackGameObject['isStand']===true){
        let randomCardImage = selectingRandomCardImage();
        showCard(dealer,randomCardImage); 
        updatingScore(dealer,randomCardImage);  
        showingScore(dealer);
        await sleep(1000);
    }
        blackjackGameObject['turnsOver']=true;
        let winner = computeWinner();
        showResult(winner); 
    
    
}
function computeWinner(){
    let winner;
    if(you['score']<=21){
        if(you['score']>dealer['score'] || (dealer['score']>21)){
            winner = you;
            blackjackGameObject['win']++;
        }else if(you['score']<dealer['score']){
           winner = dealer;
           blackjackGameObject['loose']++;
        }else if(you['score']===dealer['score']){
            console.log("you drew");
            blackjackGameObject['draw']++
        }

    }else if(you['score']>21 && dealer['score']<=21){
        winner = dealer;
        blackjackGameObject['loose']++;
    }else if(you['score']>21 && dealer['score']>21){
      blackjackGameObject['draw']++
    }
    return winner;

}
function showResult(winner){
    if(blackjackGameObject['turnsOver'] === true){
    let message,messageColor;
  if(winner===you){
      document.querySelector("#winCount").textContent=blackjackGameObject['win'];
      message = "You Won";
      messageColor="green";
      winSound.play();
  }else if(winner === dealer){
    document.querySelector("#looseCount").textContent=blackjackGameObject['loose'];
      message = "You Lost";
      messageColor = "red";
      looseSound.play();
  }else{
    document.querySelector("#drawCount").textContent=blackjackGameObject['draw'];
      message = "You drew";
      messageColor = "black";
  }
   document.querySelector("#blackjack-result").innerHTML = message;
   document.querySelector("#blackjack-result").style.color = messageColor;
}
}
