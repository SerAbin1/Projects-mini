//fucntion to return "rock", "paper", or "scissors" randomly
function getComputerChoice() {
    const choice = Math.floor(Math.random() * 3) + 1;
    if (choice == 1) {
        return "rock";
    }
    else if(choice == 2) {
        return "paper";
    }
    else {
        return "scissors";
    }
}

let humanScore = 0;
let computerScore = 0;

//Decide who wins and increment tye corresponding score
function playRound(humanChoice, computerChoice) {
  if (humanChoice == "rock") {
      if (computerChoice == "paper") {
          div.textContent = "You lose! Paper beats rock.";
          computerScore++;
      }
      if (computerChoice == "scissors") {
          div.textContent = "You win! Rock beats scissors.";
          humanScore++;
      }
  }
    if (humanChoice == "paper") {
      if (computerChoice == "rock") {
          div.textContent = "You win! Paper beats rock.";
          humanScore++;
      }
      if (computerChoice == "scissors") {
          div.textContent = "You lose! Paper loses to scissors.";
          computerScore++;
      }
  }
    if (humanChoice == "scissors") {
      if (computerChoice == "paper") {
          div.textContent = "You win! Scissors beats paper.";
          humanScore++;
      }
      if (computerChoice == "rock") {
          div.textContent = "You lose! Rock beats scissors.";
          computerScore++;
      }
  }
}

const rock = document.createElement("button");
const paper = document.createElement("button");
const scissors = document.createElement("button");

rock.textContent = "Rock";
paper.textContent = "Paper";
scissors.textContent = "Scissors";

rock.style.margin = "100% 15px 0px 18%";
paper.style.margin = "15px";
scissors.style.margin = "15px";

document.body.appendChild(rock);
document.body.appendChild(paper);
document.body.appendChild(scissors);

const div = document.createElement("div");
document.body.appendChild(div);

let previousButton;

document.body.addEventListener("click", function(event) {
    if (previousButton) {
        previousButton.style.backgroundColor = "";
    }   
    event.target.style.backgroundColor = "green";
    previousButton = event.target;
    switch(event.target.textContent){
        case "Rock":
            playRound("rock", getComputerChoice());
            break;
        case "Paper":
            playRound("paper", getComputerChoice());
            break;
        case "Scissors":
            playRound("scissors", getComputerChoice());
            break;
    }
   
    if (humanScore > 4) {
        div.innerHTML = `You win!<br>Your score: ${humanScore}<br>Computer score: ${computerScore}`;
    }
    else if (computerScore > 4) {
    div.innerHTML = `You lose!<br>Your score: ${humanScore}<br>Computer score: ${computerScore}`;
    }
});
