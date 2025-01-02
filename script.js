//fucntion to return "rock", "paper", or "scissors" randomly
function getComputerChoice() {
    const choice = (Math.random() * 10) + 1;
    if (choice > 7) {
        return "rock";
    }
    else if(choice > 4) {
        return "paper";
    }
    else {
        return "scissors";
    }
}

//function to get the human choice
function getHumanChoice() {
    const choice = Number(prompt("Enter your choice: 1 for rock, 2 for paper, 3 for scissors"));
    if (choice == 1) {
        return "rock";
    }if (choice == 2) {
        return "paper";
    }if (choice == 3) {
        return "scissors";
    }
}

let humanScore = 0;
let computerScore = 0;

function playRound(humanChoice, computerChoice) {
  humanChoice = humanChoice.toLowerCase();
  if (humanChoice == "rock") {
      if (computerChoice == "paper") {
          console.log("You lose! Paper beats rock.");
          computerScore++;
      }
      if (computerChoice == "scissors") {
          console.log("You win! Rock beats scissors.");
          humanScore++;
      }
  }
    if (humanChoice == "paper") {
      if (computerChoice == "rock") {
          console.log("You win! Paper beats rock.");
          humanScore++;
      }
      if (computerChoice == "scissors") {
          console.log("You lose! Paper loses to scissors.");
          computerScore++;
      }
  }
    if (humanChoice == "scissors") {
      if (computerChoice == "paper") {
          console.log("You win! Scissors beats paper.");
          humanScore++;
      }
      if (computerChoice == "rock") {
          console.log("You lose! Rock beats scissors.");
          humanScore++;
      }
  }
}



function playGame() {
    let i = 0;
    while (i < 5) {
        const humanSelection = getHumanChoice();
        const computerSelection = getComputerChoice();
        playRound(humanSelection, computerSelection);
        i++;
    }
    if (humanScore > computerScore) {
        console.log("You win!");
    }
    else {
        console.log("You lose!");
    }
}

playGame();
