// wait for all the elements on the page to load before
// running any JavaScript
// (this is not neccessary CURRENTLY, b/c we have our JS at the very bottom)
window.onload = (event) => {

  // let resetBtn = document.querySelector(".rest");
  let boardCells = document.querySelectorAll(".board__cell");
  let statusLight = document.querySelector(".status__light");
  let lightOnClass = "status__light--on";
  let statusMsgDisplay = document.querySelector(".status__msg");

  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // mark x, at index 0, will always be the starting mark
  const marks = ["x", "o"];

  // determine who starts by randomly generating a num 0-1
  let userMarkIdx = Math.floor(Math.random() * 2);
  // if userMarkIdx is 1, make this 0; if userMarkIdx is 0, make this 1
  let compMarkIdx = 1 - userMarkIdx;

  setStatusMsg(
    `User: ${marks[userMarkIdx].toUpperCase()}, Computer: ${marks[
      compMarkIdx
    ].toUpperCase()} - X Goes First`
  );

  // create an array that will store what mark
  // has been placed at what position on the grid
  // begin with 9 null items
  let boardArr = Array(9).fill(null);

  // this value will determine whether the user is allowed
  // to place a mark on the board at a particular point in time
  let usersTurn = false;

  // initialize the board by assigning an event listener to all the cells
  initBoard();

  // whoever was assigned the "X" mark (index 0) begins the game
  if (userMarkIdx === 0) {
    // user begins the game, so toggle on
    toggleUsersTurn();
  } else {
    // computer begins the game
    placeCompMark();
  }

  // create icon element to place within board cell
  function createMark(markLtr) {
    let mark = document.createElement("i");
    mark.classList.add("fa-solid", "fa-" + markLtr);
    return mark;
  }

  function initBoard() {
    // traverse the NodeList (specialized array) of board cells
    for (let ix = 0; ix < boardCells.length; ix++) {
      // add click event on every single board cell
      boardCells[ix].addEventListener(
        "click",
        (event) => {
          // only allow mark placement when it's the user's turn
          // and the ARRAY ITEM corresponding to the CURRENT CELL
          // is NULL (without a mark)
          if (usersTurn && boardArr[ix] === null) {
            handleUserMarkPlacement(event.target, ix);
          }
        },
        {
          once: true,
        }
      );
    }
  }

  function handleUserMarkPlacement(target, ix) {
    // place the user's mark within the clicked cell
    target.append(createMark(marks[userMarkIdx]));
    // add the mark's index number to the board ARRAY
    boardArr[ix] = userMarkIdx;

    // now, the user has completed their turn
    toggleUsersTurn();

    // check if any player won
    let winStatus = getWinStatus();
    if (winStatus.length === 0) {
      // winStatus being an empty string means that nobody won
      // let computer respond
      placeCompMark();
    } else {
      setStatusMsg(winStatus);
    }
  }

  function toggleUsersTurn() {
    if (usersTurn) {
      // if usersTurn is currently true, remove light class
      statusLight.classList.remove(lightOnClass);
    } else {
      // if usersTurn is currently false, add light class
      statusLight.classList.add(lightOnClass);
    }
    // if true make false, if false make true (flip)
    usersTurn = !usersTurn;
  }

  function generateCompChoice() {
    // function within a function :D
    function rng0to8() {
      return Math.floor(Math.random() * 9);
    }
    // generate a random board cell index for the computer
    // if generated index is NOT NULL (already filled),
    // then continue looking for another value in a loop
    let compChoiceIdx;
    do {
      // generate random index value from 0 to 8
      compChoiceIdx = rng0to8();
    } while (boardArr[compChoiceIdx] !== null);

    return compChoiceIdx;
  }

  function placeCompMark() {
    let compChoiceIdx = generateCompChoice();
    // perform this action after 1000ms (1 second)
    setTimeout(() => {
      // place the computer's mark within the chosen cell
      boardCells[compChoiceIdx].append(createMark(marks[compMarkIdx]));
      // add the computer's mark index number to the board ARRAY
      boardArr[compChoiceIdx] = compMarkIdx;

      // check if any player won
      let winStatus = getWinStatus();
      if (winStatus.length === 0) {
        // winStatus being an empty string means that nobody won
        // allow user to continue
        toggleUsersTurn();
      } else {
        setStatusMsg(winStatus);
      }
    }, 1000);
  }

  function getWinStatus() {
    // if a win has ocurred, this msg won't remain empty
    let winningMsg = "";
    let patternMarks;
    let firstMark;

    let matchFound = winningPatterns.some((pattern) => {
      let patternMarks = pattern.map(
        (patternCell) => boardArr[patternCell]
      );
      firstMark = patternMarks[0];
      // if all three elements are not null and equal
      if (
        firstMark !== null &&
        firstMark === patternMarks[1] &&
        firstMark === patternMarks[2]
      ) {
        return true;
      }
    });

    if (matchFound) {
      winningMsg =
        userMarkIdx === firstMark ? "User Won!" : "Computer Won!";
    }
    // msg may be User Won, Computer Won, or empty str
    return winningMsg;
  }
  function setStatusMsg(statusMsg) {
    statusMsgDisplay.innerText = statusMsg;
  }

     //Restart button
  const resetBtn = document.querySelector(".reset-btn")
  resetBtn.addEventListener("click", () => {
    window.location.reload();
  })
  
};
