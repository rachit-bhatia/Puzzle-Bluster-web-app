import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AchievementManagerMath from "./achievementManagerMath";
import HintButton from "../../components/hintButton";
import BackButton from "../../components/backButton";
import LevelIndicator from "../../components/levelIndicator";

const DisplayMathBoard = ({ boardGrid, puzzleSolutions, levelIndicator }) => {
  const navigate = useNavigate();
  const { difficulty, levelId, loadFlag } = useParams();
  const boolLoadFlag = Number(loadFlag) === 1;
  const [completedLevels, setCompletedLevels] = useState({});
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [cellStatus, setCellStatus] = useState<string[][]>([]);
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [editableCells, setEditableCells] = useState<boolean[][]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [remainingHints, setRemainingHints] = useState(0);
  const [isHintDisabled, setHintDisabled] = useState(false);
  const [originalSolutions, setOriginalSolutions] = useState<string[][]>([]); // State for original solutions

  const levelMap = {
    level1: "level2",
    level2: "level3",
    level3: "level3",
  };

  const nextLevelID = levelMap[levelId] || "level3";

  useEffect(() => {
    resetBoard();
    loadProgress();
    loadGameState(); // Load game state including original solutions
  }, [boardGrid]);

  const resetBoard = () => {
    setCellStatus(boardGrid.map((row) => row.map(() => "")));
    setEditableCells(boardGrid.map((row) => row.map((cell) => cell === "?")));
    setTimeElapsed(0);
    setTimerActive(false);
    setSolvedPuzzles([]);
    setSelectedCell(null);
    setHintUsed(false);

    const hintsBasedOnDifficulty =
      difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 2;
    setRemainingHints(hintsBasedOnDifficulty);

    // Ensure that the original solutions are stored separately
    setOriginalSolutions(puzzleSolutions); // Store the original solutions
    console.log(`Ori Puzzle Solutions: `, puzzleSolutions);
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

  const handleHintClick = (setButtonDisabled) => {
    const hintableRows = [];

    // Identify rows that need a hint
    for (let rowIndex = 0; rowIndex < boardGrid.length; rowIndex++) {
      const row = boardGrid[rowIndex];
      if (
        !["+", "-", "*", "/"].includes(row[1]) ||
        cellStatus[rowIndex][1] !== "correct" // Ensure hint is not for a correct column
      ) {
        hintableRows.push(rowIndex);
      }
    }

    if (hintableRows.length > 0) {
      // Select a random row from the hintable rows
      const randomIndex = Math.floor(Math.random() * hintableRows.length);
      const rowIndex = hintableRows[randomIndex];

      const updatedGrid = [...boardGrid];
      updatedGrid[rowIndex][1] = originalSolutions[rowIndex][1]; // Use original solutions for hint

      setHintUsed(true);
      saveHintsToDB();
      checkSolution(updatedGrid, rowIndex);
    }

    if (remainingHints === 1) {
      setHintDisabled(true); // Disable hint button when hints have been used up
    }
  };

  const saveHintsToDB = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        await updateDoc(userRef, {
          [`${difficulty}${levelId}HintsRemaining`]: remainingHints,
        });
        console.log("Remaining hints saved successfully");
      } catch (error) {
        console.error("Error saving remaining hints: ", error);
      }
    }
  };

  const loadGameState = async () => {
    if (boolLoadFlag) {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.email);
        try {
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const puzzleSaveState = data.puzzleSaveState;
            const mathPuzzleSaveState = puzzleSaveState.mathPuzzleSaveState;
  
            if (mathPuzzleSaveState) {
              const savedCellStatus = JSON.parse(mathPuzzleSaveState.cellStatus);
              const savedEditableCells = JSON.parse(mathPuzzleSaveState.editableCells);
              const elapsedTime = mathPuzzleSaveState.gameTime;
  
              setCellStatus(savedCellStatus);
              setEditableCells(savedEditableCells);
              setTimeElapsed(elapsedTime);
              setHintUsed(mathPuzzleSaveState.hintUsed || false);
  
              const savedHints = data[`${difficulty}${levelId}HintsRemaining`];
              const maxHints = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
              if (savedHints !== undefined && savedHints <= maxHints) {
                setRemainingHints(savedHints);
                if (savedHints === 0) {
                  setHintDisabled(true);
                }
              } else {
                setRemainingHints(maxHints);
              }
  
              // Load the original solutions from the database
              const loadedOriginalSolutions = JSON.parse(mathPuzzleSaveState.originalSolutions);
              setOriginalSolutions(loadedOriginalSolutions); // Set the original solutions from saved data
  
              checkAllSolutions(boardGrid, savedCellStatus);
              setTimerActive(true);
            } else {
              console.log("No saved game state found for math puzzle");
            }
          } else {
            console.log("No saved game state found");
          }
        } catch (error) {
          console.error("Error loading game state: ", error);
        }
      } else {
        console.error("No authenticated user found");
      }
    } else {
      setTimerActive(true);
    }
  };

  async function savetoDB() {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      const boardGridString = JSON.stringify(boardGrid);
      const cellStatusString = JSON.stringify(cellStatus);
      const editableCellsString = JSON.stringify(editableCells);
      const originalSolutionsString = JSON.stringify(originalSolutions); // Save the original solutions
  
      const mathPuzzleSaveState = {
        gameTime: timeElapsed,
        board: boardGridString,
        cellStatus: cellStatusString,
        editableCells: editableCellsString,
        difficulty: difficulty,
        levelId: levelId,
        puzzleType: "math",
        hintUsed: hintUsed,
        remainingHints: remainingHints, // Save remaining hints
        originalSolutions: originalSolutionsString, // Save the original solutions
      };
  
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          // If the document exists, update only the mathPuzzleSaveState field
          await updateDoc(userRef, {
            "puzzleSaveState.mathPuzzleSaveState": mathPuzzleSaveState,
            [`${difficulty}${levelId}HintsRemaining`]: remainingHints,
          });
          console.log("Game state saved successfully");
        } else {
          // If the document does not exist, create it with the initial puzzleSaveState structure
          await setDoc(userRef, {
            puzzleSaveState: {
              mathPuzzleSaveState: mathPuzzleSaveState,
            },
            [`${difficulty}${levelId}HintsRemaining`]: remainingHints,
          });
          console.log("Game state saved successfully");
        }
      } catch (error) {
        console.error("Error saving game state: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  }

  const checkAllSolutions = (grid, loadedCellStatus) => {
    const updatedCellStatus = [...loadedCellStatus];
    grid.forEach((row, rowIndex) => {
      let rowIsCorrect = true;
      row.forEach((cellValue, colIndex) => {
        const correctCellInput = originalSolutions[rowIndex][colIndex]; // Check against original solutions
        if (cellValue === correctCellInput) {
          updatedCellStatus[rowIndex][colIndex] = "correct";
        } else {
          updatedCellStatus[rowIndex][colIndex] = "incorrect";
          rowIsCorrect = false;
        }
      });

      if (rowIsCorrect) {
        updatedCellStatus[rowIndex] = updatedCellStatus[rowIndex].map(
          () => "correct"
        );
      }
    });

    setCellStatus(updatedCellStatus);
  };

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

    grid[rowIndex].forEach((cellValue, colIndex) => {
      const correctCellInput = originalSolutions[rowIndex][colIndex]; // Use original solutions for checking

      if (cellValue === correctCellInput) {
        updatedCellStatus[rowIndex][colIndex] = "correct";
        updatedEditableCells[rowIndex][colIndex] = false;
      } else {
        updatedCellStatus[rowIndex][colIndex] = "incorrect";
        rowIsCorrect = false;
      }
    });

    if (rowIsCorrect) {
      updatedCellStatus[rowIndex] = updatedCellStatus[rowIndex].map(
        () => "correct"
      );
    }

    setCellStatus(updatedCellStatus);
    setEditableCells(updatedEditableCells);

    const allSolved = updatedCellStatus.every((row) =>
      row.every((status) => status === "correct")
    );
    if (allSolved) {
      const levelStr = levelId?.match(/\d+/);
      let levelNum;
      if (levelStr) {
        levelNum = parseInt(levelStr[0]);
        completedLevels[difficulty!] = levelNum;
        updateProgress();
      }
      setTimerActive(false);
      setDialogOpen(true);
      setHintDisabled(true);
      storeInDB(timeElapsed, difficulty, levelId);
      removeSave();
      AchievementManagerMath.checkAndAwardAchievements(
        timeElapsed,
        difficulty,
        levelId
      );
    }
  };

  const removeSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          await updateDoc(userRef, {
            "puzzleSaveState.mathPuzzleSaveState": {},
          });
          console.log("Game state removed successfully");
        } else {
          console.log("No saved game state found");
        }
      } catch (error) {
        console.error("Error removing game state: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  };

  const loadProgress = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const completedLevels = JSON.parse(data.Progress.mathCompletedLevels);
          setCompletedLevels(completedLevels);
        } else {
          console.log("No saved game state found");
        }
      } catch (error) {
        console.error("Error loading progress: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  };

  const updateProgress = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          await updateDoc(userRef, {
            "Progress.mathCompletedLevels": JSON.stringify(completedLevels),
          });
        } else {
          console.log("No saved game state found");
        }
      } catch (error) {
        console.error("Error updating progress: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  };

  async function storeInDB(gameTime, difficulty, levelId) {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.email);
      const levelStr = levelId?.match(/\d+/);
      const levelNum = levelStr ? parseInt(levelStr[0]) : 1;
      const score =
        difficultyToNumber(difficulty) * 2 * (levelNum * (100 - gameTime + 1));

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

  function difficultyToNumber(difficulty: string): number {
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

  const formatTime = (curTime) => {
    const seconds = Math.floor(curTime % 60);
    const minutes = Math.floor((curTime / 60) % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  function savePopup(): JSX.Element {
    return (
      <div>
        <div className="darkBG" onClick={() => setDialogOpen(false)} />
        <div className="centered padding" style={{ textAlign: "center" }}>
          <div className="modal">
            <div className="modalHeader padding">
              <h5
                className="heading"
                style={{ fontSize: "20px", paddingTop: "10px" }}
              >
                {auth.currentUser ? "Save Game" : "Leave Game"}
              </h5>
            </div>
            <div
              className="modalContent"
              style={{ paddingBottom: "30px", paddingTop: "10px", fontWeight:"lighter", fontSize:"15px"}}
            >
              {auth.currentUser ? "Do you want to save your progress and leave?" : "Do you want to leave the game?"}
            </div>
            <div className="modalActions">
              <div
                className="saveContainer"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button
                  style={{ width: "220px", margin: "0 20px", height:"15%" , fontSize:"15px" }}
                  onClick={() => {
                    if (auth.currentUser){
                      savetoDB();
                      navigate("/home");
                    } else {
                      navigate("/home-guest")
                    }
                      setTimeElapsed(0);
                      setTimerActive(false);
                      resetBoard();
                      setDialogOpen(false);
                    }}
                  >
                    {auth.currentUser ? "Save and Exit" : "Exit"}
                </button>

                <button
                  style={{ width: "220px", margin: "0 20px", height:"15%" , fontSize:"15px" }}
                  onClick={() => {
                    setTimerActive(true);
                    setSaveDialogOpen(false);
                  }}
                >
                  {"Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    );
  }

  const completionPopup = () => {
    return (
      <div>
        <div className="darkBG" onClick={() => setDialogOpen(false)} />
        <div className="centered padding" style={{ textAlign: "center" }}>
          <div className="modal">
            <div className="modalHeader padding">
              <h5
                className="heading"
                style={{ fontSize: "20px", paddingTop: "10px" }}
              >
                Puzzle solved!
              </h5>
            </div>
            <div
              className="modalContent"
              style={{ paddingBottom: "30px", paddingTop: "10px" }}
            >
              Yay! You have found all the words on this board
            </div>
            <div className="modalActions">
              <div
                className="saveContainer"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  style={{ width: "250px" }}
                  onClick={() => {
                    setDialogOpen(false);
                    setHintDisabled(false);
                    resetBoard();
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
    <div className="puzzle-body">

      <div style={{position: 'absolute', display: 'flex', top: '10px', left: '10px'}}>
        <BackButton returnPath={"/render-math/levelselection"} color="rgb(92, 76, 56)"/>
        <button
            onClick={() => {
              setSaveDialogOpen(true);
              setTimerActive(false);
            }}
          >
            {auth.currentUser ? "Save Game" : "Leave Game"}
          </button>
      </div>
      <h1 className="gameHeading" style={{paddingBottom: "60px"}}>Matrix Frenzy</h1>
      <div className="gameBoardAndTimer">
        <div className="timerDisplay" style={{ display: "flex" }}>
          
          {isSaveDialogOpen && savePopup()}
          <div style={{ flexGrow: 1 }}>{formatTime(timeElapsed)}</div>
        </div>

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
      <div className="inputButtons" style={{paddingTop: "30px"}}>
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
      <div
        style={{
          position: "absolute",
          display: "flex",
          top: "10px",
          right: "10px",
        }}
      >
        <HintButton
          hintFunction={handleHintClick}
          setHintDisabled={setHintDisabled}
          isHintDisabled={isHintDisabled}
          remainingHints={remainingHints} 
          setRemainingHints={setRemainingHints}/>

        <LevelIndicator level={levelIndicator} />
      </div>
      {isDialogOpen && completionPopup()}
    </div>
  );
};

export default DisplayMathBoard;