const board = document.getElementById("board");
    const statusText = document.getElementById("status");
    const modeBtn = document.getElementById("modeBtn");
    let currentPlayer = "X";
    let gameOver = false;
    let cells = Array(9).fill("");
    let aiMode = false;

    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    function startGame() {
      board.innerHTML = "";
      cells = Array(9).fill("");
      gameOver = false;
      currentPlayer = "X";
      statusText.textContent = "Player X's Turn";
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleClick);
        board.appendChild(cell);
      }
    }

    function handleClick(e) {
      const idx = e.target.dataset.index;
      if (cells[idx] !== "" || gameOver) return;
      playMove(idx);
      if (aiMode && !gameOver && currentPlayer === "O") {
        setTimeout(aiMove, 500);
      }
    }

    function playMove(idx) {
      cells[idx] = currentPlayer;
      const cell = board.children[idx];
      cell.textContent = currentPlayer;
      cell.classList.add("taken");

      if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        highlightWin();
        gameOver = true;
        return;
      }
      if (cells.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw!";
        gameOver = true;
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function checkWin() {
      return winCombos.some(combo => {
        return combo.every(i => cells[i] === currentPlayer);
      });
    }

    function highlightWin() {
      winCombos.forEach(combo => {
        if (combo.every(i => cells[i] === currentPlayer)) {
          combo.forEach(i => board.children[i].classList.add("highlight"));
        }
      });
    }

    function resetGame() {
      startGame();
    }

    function toggleMode() {
      aiMode = !aiMode;
      modeBtn.textContent = aiMode ? "Switch to 2 Player Mode" : "Switch to AI Mode";
      resetGame();
    }

    function aiMove() {
      // Simple AI: choose random empty cell
      let available = cells.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
      let choice = available[Math.floor(Math.random() * available.length)];
      playMove(choice);
    }

    startGame();