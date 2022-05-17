let currentPlayer = "player";
let playerScore = 0;
let computerScore = 0;
let tieCounter = 0;
let board = document.querySelector(".board");
let boxOne = document.querySelector("#box-one");
let boxTwo = document.querySelector("#box-two");
let boxThree = document.querySelector("#box-three");
let boxFour = document.querySelector("#box-four");
let boxFive = document.querySelector("#box-five");
let boxSix = document.querySelector("#box-six");
let boxSeven = document.querySelector("#box-seven");
let boxEight = document.querySelector("#box-eight");
let boxNine = document.querySelector("#box-nine");
let allBoxes = document.querySelectorAll(".boxes");
let overlay = document.querySelectorAll(".overlay");
let playerName = document.querySelector("p");
let nameInput = document.querySelector("input");
let startButton = document.querySelector(".start");
let resetButton = document.querySelector(".reset-btn");
let colOne = document.querySelectorAll(".animate-col-one");
let colTwo = document.querySelectorAll(".animate-col-two");
let colThree = document.querySelectorAll(".animate-col-three");
let scoreboard = document.querySelector(".scoreboard");
let playerScoreElement = document.querySelector(".player-score");
let tieCounterElement = document.querySelector(".tie-counter");
let computerScoreElement = document.querySelector(".computer-score");
let playerSym = document.querySelector(".player-sym");
let compSym = document.querySelector(".comp-sym");
let resetOverlay = document.querySelector(".reset-overlay");
const thudPlayer = document.querySelector("audio");
const thudCPU = document.querySelector("audio");
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function startGame() {
  if (nameInput.value === "") {
    playerName.textContent = "PLAYER";
  } else {
    playerName.textContent = nameInput.value;
  }
  overlay.forEach(function (div) {
    div.classList.add("disabled");
  });
  colOne.forEach(function (box) {
    box.style.opacity = "100%";
    box.classList.add("shadow-pop-br");
    setTimeout(function () {
      box.classList.remove("shadow-pop-br");
      box.classList.add("shadow-pop-br-reverse");
      box.style.backgroundColor = "#181818";
    }, 600);
  });
  colTwo.forEach(function (box) {
    box.style.opacity = "100%";
    box.classList.add("shadow-pop-br-delay");
    setTimeout(function () {
      box.classList.remove("shadow-pop-br-delay");
      box.classList.add("shadow-pop-br-reverse");
      box.style.backgroundColor = "#181818";
    }, 1000);
  });
  colThree.forEach(function (box) {
    box.style.opacity = "100%";
    box.classList.add("shadow-pop-br-delay-1");
    setTimeout(function () {
      box.classList.remove("shadow-pop-br-delay-1");
      box.classList.add("shadow-pop-br-reverse");
      box.style.backgroundColor = "#181818";
    }, 1300);
  });
  setTimeout(function () {
    scoreboard.style.opacity = "100%";
    playerSym.style.textDecoration = "underline";
    board.style.gridGap = "0px 0px";
    allBoxes.forEach(function (box) {
      box.style.opacity = "100%";
    });
  }, 3000);
}

function handleBoxClick(event) {
  let clickedBox = event.target;
  playerPlaceMark(clickedBox);
  if (someoneWon() || boardFull()) {
    if (someoneWon()) {
      prepForReset();
      updateScoreboard();
      console.log(`${detectWinner()} won!`);
    } else if (boardFull()) {
      handleDraw();
      prepForReset();
    }
  } else {
    setTimeout(function () {
      cpuPlaceMark(currentPlayer);
      if (someoneWon()) {
        updateScoreboard();
        prepForReset();
        console.log(`${detectWinner()} won!`);
      } else if (boardFull()) {
        handleDraw();
        prepForReset();
      }
    }, 900);
  }
}

function checkEmptySquare(square) {
  return square.dataset.mark === "";
}

function playerPlaceMark(clickedBox) {
  if ((currentPlayer = "player")) {
    thudPlayer.play();
    thudPlayer.volume = 0.3;
    compSym.style.textDecoration = "underline";
    playerSym.style.textDecoration = "none";
    if (checkEmptySquare(clickedBox)) {
      clickedBox.dataset.mark = "human";
      clickedBox.classList.add("x");
      clickedBox.textContent = "x";
      currentPlayer = "CPU";
    }
  }
}

function cpuPlaceMark(currentPlayer) {
  let selectedBox = undefined;

  if (currentPlayer === "CPU") {
    for (idx = 0; idx < winningLines.length; idx++) {
      selectedBox = findAtRiskSquare(winningLines[idx], "CPU");
      if (selectedBox) {
        break;
      }
    }
    if (!selectedBox) {
      for (idx = 0; idx < winningLines.length; idx++) {
        selectedBox = findAtRiskSquare(winningLines[idx], "human");
        if (selectedBox) {
          break;
        }
      }
    }

    if (!selectedBox) {
      let centerBox = boxFive;
      if (boxFive.dataset.mark === "") {
        selectedBox = centerBox;
      } else {
        let arrOfEmptyBoxes = Array.from(allBoxes).filter(
          (box) => box.dataset.mark === ""
        );
        let randomIndex = Math.floor(Math.random() * arrOfEmptyBoxes.length);
        selectedBox = arrOfEmptyBoxes[randomIndex];
      }
    }
    thudCPU.play();
    thudCPU.volume = 0.3;
    selectedBox.dataset.mark = "CPU";
    selectedBox.textContent = "O";
    selectedBox.classList.add("o");
    compSym.style.textDecoration = "none";
    playerSym.style.textDecoration = "underline";
    currentPlayer = "player";
  }
}

function findAtRiskSquare(line, marker) {
  let winningLinesArr = [
    allBoxes[line[0]],
    allBoxes[line[1]],
    allBoxes[line[2]],
  ];
  if (
    winningLinesArr.filter((winLine) => winLine.dataset.mark === marker)
      .length === 2
  ) {
    return winningLinesArr.filter((winLine) => winLine.dataset.mark === "")[0];
  } else {
    return undefined;
  }
}

function detectWinner() {
  let winningLinesArr;
  for (idx = 0; idx < winningLines.length; idx++) {
    winningLinesArr = [
      allBoxes[winningLines[idx][0]],
      allBoxes[winningLines[idx][1]],
      allBoxes[winningLines[idx][2]],
    ];
    if (winningLinesArr.every((winLine) => winLine.dataset.mark === "human")) {
      highlightWinningMark(winningLinesArr, "human");
      playerScoreElement.textContent = `${playerScore}`;
      return "human";
    } else if (
      winningLinesArr.every((winLine) => winLine.dataset.mark === "CPU")
    ) {
      highlightWinningMark(winningLinesArr, "CPU");
      computerScoreElement.textContent = `${computerScore}`;
      return "CPU";
    }
  }
  return undefined;
}

function someoneWon() {
  return !!detectWinner();
}

function boardFull() {
  let boxesArr = Array.from(allBoxes);
  return boxesArr.every((box) => box.dataset.mark !== "");
}

function highlightWinningMark(winningLinesArr, winner) {
  if (winner === "human") {
    winningLinesArr.forEach(function (winLines) {
      winLines.classList.add("x-win");
    });
  } else if (winner === "CPU") {
    winningLinesArr.forEach(function (winLines) {
      winLines.classList.add("o-win");
    });
  }
}

function updateScoreboard() {
  if (detectWinner() === "human") {
    playerScore += 1;
    playerScoreElement.textContent = `${playerScore}`;
  } else if (detectWinner() === "CPU") {
    computerScore += 1;
    computerScoreElement.textContent = `${computerScore}`;
  }
}

function handleDraw() {
  tieCounter += 1;
  tieCounterElement.textContent = `${tieCounter}`;
  allBoxes.forEach(function (box) {
    box.classList.add("draw");
  });
}

function prepForReset() {
  allBoxes.forEach(function (box) {
    box.removeEventListener("click", handleBoxClick);
  });
  resetOverlay.style.display = "inline-block";
  resetOverlay.addEventListener("click", resetBoard);
}

function resetBoard() {
  resetElements();
  allBoxes.forEach(function (box) {
    box.addEventListener("click", handleBoxClick);
  });
  resetOverlay.style.display = "none";
}

function resetElements() {
  allBoxes.forEach(function (box) {
    box.classList.remove("x");
    box.classList.remove("o");
    box.classList.remove("x-win");
    box.classList.remove("o-win");
    box.classList.remove("draw");
    box.textContent = "";
    box.dataset.mark = "";
  });
  colOne.forEach(function (box) {
    box.classList.remove("shadow-pop-br-reverse");
  });
  colTwo.forEach(function (box) {
    box.classList.remove("shadow-pop-br-reverse");
  });
  colThree.forEach(function (box) {
    box.classList.remove("shadow-pop-br-reverse");
  });
}

allBoxes.forEach(function (box) {
  box.addEventListener("click", handleBoxClick);
});
startButton.addEventListener("click", startGame);
