import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AchievementManagerMath from "./achievementManagerMath";

const DisplayMathBoard = ({ boardGrid, puzzleSolutions }) => {
  const navigate = useNavigate();
  const { difficulty, levelId } = useParams();

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [cellStatus, setCellStatus] = useState<string[][]>([]);
  const [editableCells, setEditableCells] = useState<boolean[][]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const levelMap = {
    level1: "level2",
    level2: "level3",
    level3: "level3",
  };

  const nextLevelID = levelMap[levelId] || "level3"; // Default to level3 if anything goes wrong

  useEffect(() => {
    resetBoard();
  }, [boardGrid]);

  const resetBoard = () => {
    setCellStatus(boardGrid.map((row) => row.map(() => ""))); // Initialize with empty strings
    setEditableCells(boardGrid.map((row) => row.map((cell) => cell === "?")));
    setTimeElapsed(0);
    setTimerActive(false);
    setSolvedPuzzles([]);
    setSelectedCell(null);
  };

  useEffect(() => {
    let interval;

    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (editableCells[rowIndex] && editableCells[rowIndex][colIndex]) {
      if (!timerActive) {
        setTimerActive(true);
      }
      setSelectedCell([rowIndex, colIndex]);
    }
  };

  const handleInput = (value) => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;
      const updatedGrid = [...boardGrid];
      updatedGrid[rowIndex][colIndex] = value;

      setSelectedCell(null);

      checkSolution(updatedGrid, rowIndex);
    }
  };

  const checkSolution = (grid, rowIndex) => {
    const updatedCellStatus = [...cellStatus];
    const updatedEditableCells = [...editableCells];
    let rowIsCorrect = true;

    // Check each cell in the row
    grid[rowIndex].forEach((cellValue, colIndex) => {
      const correctCellInput = puzzleSolutions[rowIndex][colIndex];

      if (cellValue === correctCellInput) {
        updatedCellStatus[rowIndex][colIndex] = "correct";
        updatedEditableCells[rowIndex][colIndex] = false; // Disable further editing
      } else {
        updatedCellStatus[rowIndex][colIndex] = "incorrect";
        rowIsCorrect = false; // If any cell is incorrect, the row isn't fully correct
      }
    });

    // If the entire row is correct, mark the whole row as correct
    if (rowIsCorrect) {
      updatedCellStatus[rowIndex] = updatedCellStatus[rowIndex].map(
        () => "correct"
      );
    }

    setCellStatus(updatedCellStatus);
    setEditableCells(updatedEditableCells);

    // Check if all rows are solved to show the completion dialog
    const allSolved = updatedCellStatus.every((row) =>
      row.every((status) => status === "correct")
    );
    if (allSolved) {
      setTimerActive(false);
      setDialogOpen(true);
      storeInDB(timeElapsed, difficulty, levelId);
      AchievementManagerMath.checkAndAwardAchievements(
        timeElapsed,
        difficulty,
        levelId
      );
    }
  };

  function difficultyToNumber(difficulty: string): number {
    // Convert the difficulty string to a number
    switch (difficulty) {
      case "easy":
        return 1;
      case "medium":
        return 2;
      case "hard":
        return 3;
      default:
        return 0;
    }
  }

  async function storeInDB(gameTime, difficulty, levelId) {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.email);
      const levelStr = levelId?.match(/\d+/);
      const levelNum = levelStr ? parseInt(levelStr[0]) : 1;
      const score =
        difficultyToNumber(difficulty) * 2 * (levelNum * (100 - gameTime + 1)); // Score calculation

      const fieldKey = `${difficulty}${levelNum}gametime`;
      const scoreKey = `mathScore`;

      try {
        const docSnapshot = await getDoc(userRef);
        const maxScore = Math.max(score, docSnapshot.data()?.[scoreKey]);
        if (docSnapshot.exists()) {
          await updateDoc(userRef, {
            [fieldKey]: gameTime,
            [scoreKey]: maxScore,
          });
        } else {
          await setDoc(userRef, {
            [fieldKey]: gameTime,
            [scoreKey]: maxScore,
          });
        }
      } catch (error) {
        console.error("Error saving game time: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  }

  const formatTime = (curTime) => {
    const seconds = Math.floor(curTime % 60);
    const minutes = Math.floor((curTime / 60) % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const completionPopup = () => {
    return (
      <div>
        <div className="darkBG" onClick={() => setDialogOpen(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Puzzle solved!</h5>
            </div>
            <div className="modalContent">
              Yay! You have solved all the puzzles on this board
            </div>
            <div className="modalActions">
              <div className="actionsContainer">
                <button
                  style={{ width: "250px" }}
                  onClick={() => {
                    setDialogOpen(false);
                    resetBoard(); // Reset the board before navigating
                    if (levelId !== "level3") {
                      navigate(`/render-math/${difficulty}/${nextLevelID}/0`);
                    } else {
                      navigate("/render-math/levelselection");
                    }
                  }}
                >
                  {levelId !== "level3"
                    ? "Next Level"
                    : "Back to level selection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mathPuzzleContainer">
      {isDialogOpen && completionPopup()}
      <div className="gameBoardAndTimer">
        <div className="timerDisplay">{formatTime(timeElapsed)}</div>
        <div className="boardGrid">
          {boardGrid.map((boardRow, rowIndex) => (
            <div className="boardRow" key={rowIndex}>
              {boardRow.map((cellContent, colIndex) => (
                <button
                  className="boardCell"
                  style={{
                    backgroundColor:
                      selectedCell?.[0] === rowIndex &&
                      selectedCell?.[1] === colIndex
                        ? "green"
                        : cellStatus[rowIndex] &&
                          cellStatus[rowIndex][colIndex] === "correct"
                        ? "rgb(18, 119, 113)"
                        : cellStatus[rowIndex] &&
                          cellStatus[rowIndex][colIndex] === "incorrect"
                        ? "lightcoral"
                        : "",
                    cursor:
                      editableCells[rowIndex] &&
                      editableCells[rowIndex][colIndex]
                        ? "pointer"
                        : "not-allowed",
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  key={colIndex}
                  disabled={
                    !editableCells[rowIndex] ||
                    !editableCells[rowIndex][colIndex]
                  }
                >
                  {cellContent}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="inputButtons">
        {[
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "0",
          "+",
          "-",
          "*",
          "/",
        ].map((symbol) => (
          <button
            className="inputButton"
            onClick={() => handleInput(symbol)}
            key={symbol}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisplayMathBoard;
