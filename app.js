let players = [
  {
    currentScore: 0,
    globalScore: 0,
    wins: 0
  },
  {
    currentScore: 0,
    globalScore: 0,
    wins: 0
  }
];
let currentPlayer = 0; 
let winningScore = 100;


document.getElementById('start-game-button').disabled = true;
document.getElementById('start-game-button').style.backgroundColor = 'grey'

let final = document.getElementById('final-score')

final.addEventListener('input', function(){
  const finalScore = parseInt(final.value);

  if ( finalScore > 20) {
      document.getElementById('start-game-button').disabled = false;
      document.getElementById('start-game-button').style.backgroundColor = '#4caf50';
     document.getElementById('global-score').innerText = `Global Score: ${finalScore}`;


  }else{
      document.getElementById('start-game-button').style.backgroundColor = 'grey'
      document.getElementById('start-game-button').disabled = true;

  }

} )

let aiMode = false; 

function toggleAI() {
    const gameModeSelect = document.getElementById('game-mode');
    aiMode = gameModeSelect.value === 'ai';
}

function simulateAITurn() {
  const threshold = 20;  
  let aiRolls = 0;
  while (aiRolls < 2) {
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const roll = document.getElementById('roll-btn');
    
  

    roll.click();

    if (dice1 === 1 || dice2 === 1 || players[currentPlayer].currentScore + dice1 + dice2 >= threshold) {
      
      return dice1 + dice2;
    }
   
    aiRolls++;
  }

  return 0;
}


function aiPlay() {
  const aiRoll = simulateAITurn();
  
  if (aiRoll > 0) {
    alert(`AI rolled ${aiRoll}.`);  
    hold();
  } else {
    alert(`AI rolled 1, switching to human's turn.`);
    switchPlayer();
  }
}

function rollDice() {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;

  const dice1Image = `./Dice_Game_Starter-main/dice-${dice1}.png`;
  const dice2Image = `./Dice_Game_Starter-main/dice-${dice2}.png`;

  document.getElementById('dice1').src = dice1Image;
  document.getElementById('dice2').src = dice2Image;
 

  if (dice1 === 6 && dice2 === 6) {
    setTimeout(() => {
      alert('You rolled 6 and 6!');
    }, 1000);
    
    document.getElementById('roll-btn').disabled = true;
    document.getElementById('hold-btn').disabled = true;

    
    setTimeout(() => {
      document.getElementById('roll-btn').disabled = false;
      document.getElementById('hold-btn').disabled = false;
    }, 1000);
    players[currentPlayer].currentScore = 0;
    switchPlayer();
  } else {

    players[currentPlayer].currentScore += dice1 + dice2;
    document.getElementById(`player${currentPlayer + 1}-current-score`).innerText = `Current Score: ${players[currentPlayer].currentScore}`;

    if(players[currentPlayer].currentScore >= winningScore){

      alert(`Player ${currentPlayer + 1} wins!`);
      players[currentPlayer].wins += 1;
      document.getElementById('game-container').style.display = 'none';
      document.getElementById('score-container').style.display = 'block';

      
      
    }
  }
  handleGameStateChange();
}




function rematch() {
  const player1Wins = players[0].wins;
  const player2Wins = players[1].wins;


  players = [
    { currentScore: 0, globalScore: 0, wins: player1Wins }, 
    { currentScore: 0, globalScore: 0, wins: player2Wins }  
  ];


  document.getElementById('player1-wins').innerText = `Player 1 Wins: ${players[0].wins}`;
  document.getElementById('player2-wins').innerText = `Player 2 Wins: ${players[1].wins}`;

    
  for (let i = 0; i < players.length; i++) {
      document.getElementById(`player${i + 1}-current-score`).innerText = 'Current Score: 0';
      document.getElementById(`player${i + 1}-global-score`).innerText = 'Global Score: 0';
    }
  
    document.getElementById('score-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';

   
 
    document.getElementById(`player${currentPlayer + 1}-panel`).classList.remove('active');
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    document.getElementById(`player${currentPlayer +1}-panel`).classList.add('active');
    
   if (aiMode && currentPlayer === 1) {
    const aiPlayEvent = new Event('aiPlay');
    document.dispatchEvent(aiPlayEvent);
  }
  handleGameStateChange();
}



function hold() {
  players[currentPlayer].globalScore += players[currentPlayer].currentScore;
  document.getElementById(`player${currentPlayer + 1}-global-score`).innerText = `Global Score: ${players[currentPlayer].globalScore}`;

  if (players[currentPlayer].globalScore >= winningScore) {
    alert(`Player ${currentPlayer + 1} wins!`);
    players[currentPlayer].wins += 1;
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';
  } else {
    players[currentPlayer].currentScore = 0;
    switchPlayer();
  }

  handleGameStateChange();
  
}

function switchPlayer() {
  players[currentPlayer].currentScore = 0;
  document.getElementById(`player${currentPlayer + 1}-current-score`).innerText = `Current Score: ${players[currentPlayer].currentScore}`;
  document.getElementById(`player${currentPlayer + 1}-panel`).classList.remove('active');

  currentPlayer = currentPlayer === 0 ? 1 : 0;

  document.getElementById(`player${currentPlayer + 1}-panel`).classList.add('active');

  if (aiMode && currentPlayer === 1) {
    setTimeout(() => {
      const aiPlayEvent = new Event('aiPlay');
      document.dispatchEvent(aiPlayEvent);
    }, 1000);
  }
  handleGameStateChange();
}

function handleAIPlay() {
  // document.getElementById('roll-btn').disabled = true;
  //   document.getElementById('hold-btn').disabled = true;
  aiPlay();
}


document.addEventListener('aiPlay', handleAIPlay);


function resetGame() {
  players = [
      { currentScore: 0, globalScore: 0 ,wins: 0},
      { currentScore: 0, globalScore: 0 ,wins: 0}
    ];
    currentPlayer = 0;
  for (let i = 0; i < players.length; i++) {
      document.getElementById(`player${i + 1}-current-score`).innerText = 'Current Score: 0';
      document.getElementById(`player${i + 1}-global-score`).innerText = 'Global Score: 0';
    }
  
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('start-game-section').style.display = 'flex';
    document.getElementById('score-container').style.display = 'none';

    clearGameState()
}



function startGame() {
  // clearGameState()
  const gameContainer = document.getElementById('game-container');
  const startContainer = document.getElementById('start-game-section');

  gameContainer.style.display = (gameContainer.style.display === 'none' || gameContainer.style.display === '') ? 'flex' : 'none';
  startContainer.style.display = 'none';
  
  const score = parseInt(final.value) ;
  winningScore = score;

  document.getElementById(`player${currentPlayer + 1}-panel`).classList.add('active');
  updatePlayerTurn()
  handleGameStateChange();
  
   

  
}



function updatePlayerTurn() {
  const currentPlayerTurn = currentPlayer === 0 ? 1 : 2;
  document.getElementById('turn').innerText = `Player ${currentPlayerTurn}'s turn`;
}



function saveGameState() {
  const gameState = {
    players,
    currentPlayer,
    winningScore,
    aiMode,
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Load game state from local storage
function loadGameState() {
  const savedGameState = localStorage.getItem('gameState');
  
  if (savedGameState) {
    const gameState = JSON.parse(savedGameState);
    players = gameState.players;
    currentPlayer = gameState.currentPlayer;
    winningScore = gameState.winningScore;
    aiMode = gameState.aiMode;
    
    for (let i = 0; i < players.length; i++) {
      document.getElementById(`player${i + 1}-current-score`).innerText = `Current Score: ${players[i].currentScore}`;
      document.getElementById(`player${i + 1}-global-score`).innerText = `Global Score: ${players[i].globalScore}`;
      document.getElementById(`player${i + 1}-wins`).innerText = `Wins: ${players[i].wins}`;

    }
    document.getElementById(`player${currentPlayer }-panel`).classList.remove('active');

    document.getElementById(`player${currentPlayer + 1}-panel`).classList.add('active');
    //document.getElementById('turn').innerText = `Player ${currentPlayer}'s turn`;
    updatePlayerTurn();
  }



}

function handleGameStateChange() {
  saveGameState();
  saveContainerState()
}

window.onload = () => {
  loadGameState();
  loadContainerState();
 
};







function saveContainerState() {
  const gameContainer = document.getElementById('game-container');
  const scoreContainer =document.getElementById('score-container').style.display === 'block';

  const isGameContainerVisible = gameContainer.style.display !== 'none';
  localStorage.setItem('gameContainerState', JSON.stringify(isGameContainerVisible));
  localStorage.setItem('scoreContainer', JSON.stringify(scoreContainer));

}

function loadContainerState() {
  const savedGameContainerState = localStorage.getItem('gameContainerState');
  const scoreContainerState = localStorage.getItem('scoreContainer');

  if (savedGameContainerState ) {
    const isGameContainerVisible = JSON.parse(savedGameContainerState);
    const gameContainer = document.getElementById('game-container');
    gameContainer.style.display = isGameContainerVisible ? 'flex'  : 'none';
    document.getElementById('start-game-section').style.display = 'none'
  }
  if(scoreContainerState && savedGameContainerState){
    const isScoreContainerVisible = JSON.parse(scoreContainerState);
    const scoreContainer =document.getElementById('score-container');
    scoreContainer.style.display =  'block'
    document.getElementById('start-game-section').style.display = 'none'
  }
}

function clearGameState() {
  localStorage.removeItem('gameState');
  localStorage.removeItem('gameContainerState');
  localStorage.removeItem('scoreContainer');

}