import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { updateDoc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase/firebase";
import React, { useEffect } from "react";
import { ReactElement, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AchievementManager from "./achievementManager";
import LevelIndicator from '../../components/levelIndicator';
import HintButton from '../../components/hintButton';
import { wordsToFind, allWordsCoordinates } from "./fillBoardGrid";

const wordFoundColor = "rgb(18, 119, 113)";
const hintColor = "rgb(18, 118, 113)";
let hintedLetters: string[] = [];  //keep track of letters shown from hints

const DisplayBoard = ({ boardGrid, wordsToFind, setHintDisabled, setRemainingHints }): ReactElement => {
  let selection = "";

  const navigate = useNavigate();
  const [isLetterSelected, setIsLetterSelected] = useState(false);
  let [selectedWord, setSelectedWord] = useState(""); //record the letters selected by the player
  const [timeElapsed, setTimeElapsed] = useState(0); //milliseconds
  const [timerActive, setTimerActive] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [completedLevels, setCompletedLevels] = useState({});
  const [isDialogOpen, setDialogOpen] = useState(false); //dialog box for level completion
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false); //dialog box for saving game state
  const [nextLevelID, setLevelID] = useState(""); //setting ID of next level
  const { difficulty, levelId, loadFlag } = useParams();
  const boolLoadFlag = Number(loadFlag) === 1;
  const [selectedPositions, setSelectedPositions] = useState<
    Array<{ row: number; col: number }>
  >([]);
  const [foundPositions, setFoundPositions] = useState<
    Array<{ row: number; col: number }>
  >([]);

  // hintedLetters = []; //reset hinted letters on new level

  //set remaining number of hints
  if ((difficulty!="hard" && hintedLetters.length >= 2) || (difficulty=="hard" && hintedLetters.length >= 4)) {
    setRemainingHints(0);
    setHintDisabled(true);
  } else if (difficulty=="hard") {
    setRemainingHints(2 - hintedLetters.length/2);
  } else {
    setRemainingHints(2 - hintedLetters.length);
  }

  useEffect(() => {
    setTimerActive(true);
  }, [levelId, boardGrid]);


  useEffect(() => {
    let interval;

    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1); // Increment the time by 1 second
      }, 1000);
    } else if (!timerActive && timeElapsed !== 0) {
      clearInterval(interval); // Clear the interval if the timer is not active
    }

    return () => clearInterval(interval);
  }, [timerActive, timeElapsed]);

  //format time in mm:ss format
  const formatTime = (curTime: number) => {
    const seconds = Math.floor(curTime % 60);
    const minutes = Math.floor((curTime / 60) % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (foundWords.length === wordsToFind.length) {
      setTimerActive(false);
      console.log("timer stop");
      // saveGameTimeToUserAccount(timeElapsed);
      AchievementManager.checkAndAwardAchievements(
        timeElapsed,
        difficulty,
        levelId,
        foundWords,
        wordsToFind
      );
      storeInDB(timeElapsed, difficulty, levelId);
    }
  }, [foundWords, timeElapsed]); // This effect listens to changes in foundWords

  // Load game state from user account
  useEffect(() => {
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
              const foundWords = JSON.parse(puzzleSaveState.foundWords);
              const foundPositions = JSON.parse(puzzleSaveState.foundPositions);
              const elapsedTime = puzzleSaveState.gameTime;

              // Now you can use these deserialized values in your application
              console.log("Game state loaded successfully", {
                foundWords,
                elapsedTime,
              });

              setFoundWords(foundWords);
              setTimeElapsed(elapsedTime);
              setFoundPositions(foundPositions);
            } else {
              console.log("No saved game state found");
            }
          } catch (error) {
            console.error("Error loading game state: ", error);
          }
        } else {
          console.error("No authenticated user found");
        }
      }
    };
    loadGameState();
  }, [boolLoadFlag]);

  // Mark the words found in the board
  function markAsFound(foundPositions: Array<{ row: number; col: number }>) {
    if (!Array.isArray(boardGrid) || boardGrid.length === 0) {
      console.error("Error: boardGrid is not initialized or is empty.");
      return;
    }

    // Get the number of columns in the boardGrid
    const numCols = boardGrid[0].length;

    foundPositions.forEach(({ row, col }) => {
      // Calculate the index of the board cell based on row and col
      const index = row * numCols + col;

      // Find the corresponding board cell element
      const boardCell = document.querySelectorAll(".boardCell")[
        index
      ] as HTMLElement;

      // Change the background color of the board cell
      if (boardCell) {
        boardCell.style.backgroundColor = wordFoundColor;
      }
    });
  }

  useEffect(() => {
    // Call markAsFound after the component has been rendered
    loadProgress();
    markAsFound(foundPositions);
  }, [boardGrid]); // Dependency array to ensure it runs after boardGrid is initialized

  // async function storeInDB(gameTime) {
  //     const user = auth.currentUser;

  //     if (user) {
  //         const userRef = doc(db, "users", user.uid);
  //         console.log(user.uid);
  //         console.log(user.email);
  //         console.log(userRef);
  //         try {
  //             const docSnapshot = await getDoc(userRef);
  //             if (docSnapshot.exists()) {
  //                 // If the document exists, update it
  //                 await updateDoc(userRef, {
  //                     gameTime: gameTime
  //                 });
  //                 console.log("Game time updated successfully");
  //             } else {
  //                 // If the document does not exist, create it
  //                 await setDoc(userRef, {
  //                     gameTime: gameTime
  //                 });
  //                 console.log("Game time set successfully");
  //             }
  //         } catch (error) {
  //             console.error("Error saving game time: ", error);
  //         }
  //     } else {
  //         console.error("No authenticated user found");
  //     }
  // }

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

  //Function for serializing game state and storing to user account
  async function savetoDB(
    gameTime,
    boardGrid,
    foundWords,
    difficulty,
    levelId
  ) {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      const boardGridString = JSON.stringify(boardGrid);
      const foundWordsString = JSON.stringify(foundWords);
      const foundPositionsString = JSON.stringify(foundPositions);

      const puzzleSaveState = {
        gameTime: gameTime,
        board: boardGridString,
        foundWords: foundWordsString,
        foundPositions: foundPositionsString,
        difficulty: difficulty,
        levelId: levelId,
        puzzleType: "word"
      };
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          // If the document exists, update it
          await updateDoc(userRef, {
            puzzleSaveState: puzzleSaveState,
          });
          console.log("Game state saved sucessfully");
        } else {
          // If the document does not exist, create it
          await setDoc(userRef, {
            puzzleSaveState: puzzleSaveState,
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


  //Function for removing saved game state from user account
  async function removeSave() {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          // If the document exists, update it
          await updateDoc(userRef, {
            puzzleSaveState: {},
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
  }

  async function loadProgress(){
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const completedLevels = JSON.parse(data.Progress.wordCompletedLevels);
          setCompletedLevels(completedLevels);
        } else {
          console.log("No saved game state found");
        }
      } catch (error) {
        console.error("Error removing game state: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  }

  async function updateProgress() {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          await updateDoc(userRef, {
            "Progress.wordCompletedLevels": JSON.stringify(completedLevels),
          });
        } else {
          console.log("No saved game state found");
        }
      } catch (error) {
        console.error("Error removing game state: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  }


  async function storeInDB(
    gameTime: number,
    difficulty: string,
    levelId: string
  ) {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.email); // Using user.email as the reference key
      const levelStr = levelId?.match(/\d+/);
      const levelNum = levelStr ? parseInt(levelStr[0]) : 1;
      const score =
        difficultyToNumber(difficulty) * 2 * (levelNum * (100 - gameTime + 1)); // Score calculation
      const fieldKey = `${difficulty}${levelNum}gametime`; // e.g., easy1gametime
      const scoreKey = `wordScore`;

      try {
        const docSnapshot = await getDoc(userRef);
        //Max score is decided between the current score and the previous score
        const maxScore = Math.max(score, docSnapshot.data()?.[scoreKey]);
        console.log("Document snapshot:", docSnapshot.exists());
        console.log("Document data:", docSnapshot.data());
        console.log("Field value:", docSnapshot.data()?.[fieldKey]);
        if (docSnapshot.exists()) {
          // Check if the specific field exists in the document
          const data = docSnapshot.data();
          if (data[fieldKey] !== undefined) {
            // If the field exists, update it
            await updateDoc(userRef, {
              [fieldKey]: gameTime,
              [scoreKey]: maxScore,
            });
            console.log(`${fieldKey} updated successfully`);
          } else {
            // If the field does not exist, create it
            await updateDoc(userRef, {
              [fieldKey]: gameTime,
              [scoreKey]: maxScore,
            });
            console.log(`${fieldKey} created successfully`);
          }

          // // Update the word score field
          // if (data[scoreKey] !== undefined) {
          //     // If the field exists, update it
          //     await updateDoc(userRef, {
          //         [scoreKey]: score
          //     });
          //     console.log(`${scoreKey} updated successfully`);
          // } else {
          //     // If the field does not exist, create it
          //     await updateDoc(userRef, {
          //         [scoreKey]: score
          //     });
          //     console.log(`${scoreKey} created successfully`);
          // }
        } else {
          // If the document does not exist, create it with the specific field
          await setDoc(userRef, {
            [fieldKey]: gameTime,
            [scoreKey]: score,
          });
          console.log(`${fieldKey} set successfully`);
        }
      } catch (error) {
        console.error("Error saving game time: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  }

  // const saveGameTimeToUserAccount = async (time) => {
  //     console.log("Saving game time to user account");
  //     console.log(time);
  // };

  //event handler for when the mouse is held down on a letter
  function letterHeld(event, row, col): void {
    // if (!timerActive && foundWords.length < wordsToFind.length) {
    //   setTimerActive(true); // Start the timer when the first letter is held
    // }
    if (event.target.style.backgroundColor != wordFoundColor) {
      setIsLetterSelected(true);
      event.target.style.backgroundColor = "green";

      //record user selections
      selection += event.target.innerHTML;
      setSelectedWord(selection);
      setSelectedPositions([{ row, col }]);
    }
  }

  //event handler for when the mouse is held down on a letter and moved to another letter
  function letterContinueHeld(event, row, col): void {
    if (event.target.style.backgroundColor == wordFoundColor) {
      letterReleased(); //stop highlighting if the word is already found
    } else if (isLetterSelected) {
      event.target.style.backgroundColor = "green";

      //record user selections
      selection = selectedWord;
      selection += event.target.innerHTML;
      setSelectedWord(selection);
      setSelectedPositions((prevSelectedPositions) => [
        ...prevSelectedPositions,
        { row, col },
      ]);
    }
  }

  //event handler for when the mouse is released from a letter
  function letterReleased(): void {
    setIsLetterSelected(false);

    const boardLetters = Array.from(
      document.getElementsByClassName(
        "boardCell"
      ) as HTMLCollectionOf<HTMLElement>
    );

    //check if the selected word is one of the words to find
    if (wordsToFind.includes(selectedWord)) {
      setFoundWords((prevFoundWords) => [...prevFoundWords, selectedWord]);
      setFoundPositions((prevFoundPositions) => [
        ...prevFoundPositions,
        ...selectedPositions,
      ]);

      //highlight the found solution word
      boardLetters.forEach((letter) => {
        if (letter.style.backgroundColor == "green") {
          letter.style.backgroundColor = wordFoundColor;
        }
      });

      //save the level ID upon completion of level to unlock next level
      if (foundWords.length >= wordsToFind.length - 1) {
        const levelStr = levelId?.match(/\d+/);
        let levelNum: number;
        if (levelStr) {
          levelNum = parseInt(levelStr[0]);
          completedLevels[difficulty!] = levelNum;
          updateProgress();
          setLevelID(`level${levelNum + 1}`); //id of next level
        }

        //display completed level message
        setDialogOpen(true);
        setHintDisabled(true);
        removeSave();
      }
      // checkCompletion();
    }

    //reset the color of all selected letters if not the correct solution word
    else {
      boardLetters.forEach((letter) => {
        if (letter.style.backgroundColor == "green") {
          letter.style.backgroundColor = "";
        }

        if (hintedLetters.includes(letter.id)) {
            letter.style.backgroundColor = hintColor;
        }
      });
    }

    //reset selection
    console.log(selectedWord);
    selection = "";
    setSelectedWord(selection);
  }

  //popup message for saving game state
  function savePopup(): JSX.Element {
    return (
      <div>
        <div className="darkBG" onClick={() => setDialogOpen(false)} />
        <div className="centered padding" style={{ textAlign: "center" }}>
          <div className="modal">
            <div className="modalHeader padding">
              <h5 className="heading">Save Game</h5>
            </div>
            <div className="modalContent">
              Do you want to save your progress and leave?
            </div>
            <div className="modalActions">
              <div
                className="saveContainer"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button
                  style={{ width: "220px", margin: "0 20px" }}
                  onClick={() => {
                    savetoDB(
                      timeElapsed,
                      boardGrid,
                      foundWords,
                      difficulty,
                      levelId
                    );
                    navigate("/home");
                    setTimeElapsed(0);
                    setTimerActive(false);
                    setFoundWords([]);
                    setDialogOpen(false);
                  }}
                >
                  {"Save and Exit"}
                </button>
                <button
                  style={{ width: "220px", margin: "0 20px" }}
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

  //popup message for level completion
  function completionPopup(): JSX.Element {
    return (
      <div>
        <div className="darkBG" onClick={() => setDialogOpen(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Puzzle solved!</h5>
            </div>
            <div className="modalContent">
              Yay! You have found all the words on this board
            </div>
            <div className="modalActions">
              <div
                className="actionsContainer"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  style={{ width: "250px" }}
                  onClick={() => {
                    //TODO: call save to db here
                    //navigate back to level selection if last level
                    setFoundPositions([]);
                    hintedLetters = [];
                    setHintDisabled(false);
                    levelId != "level3"
                      ? navigate(`/render-word/${difficulty}/${nextLevelID}/0`)
                      : navigate("/render-word/levelselection");
                    //reset required state variables
                    setTimeElapsed(0);
                    setTimerActive(false);
                    setFoundWords([]);
                    setDialogOpen(false);
                  }}
                >
                  {levelId != "level3"
                    ? "Next Level"
                    : "Back to level selection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="boardGrid" key={levelId} onMouseLeave={letterReleased}>
      {isDialogOpen && completionPopup()}
      <div className="timerDisplay" key={levelId}>
        {formatTime(timeElapsed)}
      </div>
      <button
        onClick={() => {
          setSaveDialogOpen(true);
          setTimerActive(false);
        }}
      >
        {"Save Game"}
      </button>
      {isSaveDialogOpen && savePopup()}
      {boardGrid.map((boardRow, rowIndex) => (
        <div className="boardRow" key={rowIndex}>
          {boardRow.map((wordContent, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              id={`${rowIndex}-${colIndex}`}
              className="boardCell"
              onMouseDown={(event) => letterHeld(event, rowIndex, colIndex)}
              onMouseEnter={(event) =>
                letterContinueHeld(event, rowIndex, colIndex)
              }
              onMouseUp={letterReleased}
            >
              {wordContent}
            </button>
          ))}
        </div>
      ))}
      <div>
        {/* <h3>Words to find:</h3> */}
        <ul
          style={{ display: "flex", padding: "10px", justifyContent: "center" }}
        >
          {wordsToFind.map((word, index) => (
            <li
              key={index}
              className="wordList"
              style={{
                backgroundColor: foundWords.includes(word)
                  ? "rgb(217, 152, 67)"
                  : "rgb(230, 176, 107)",
                color: foundWords.includes(word) ? "gray" : "black",
                transition: "color 0.2s, background-color 0.2s",
              }}
            >
              {word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


function getRandomHintLetter(): [number, string, HTMLElement] {
    let randID = Math.floor(Math.random() * allWordsCoordinates.length);
    const hintLetterPosition = allWordsCoordinates[randID][0];
    const letterID = `${hintLetterPosition[0]}-${hintLetterPosition[1]}`;
    const letterElem = document.getElementById(letterID)!;

    return [randID, letterID, letterElem];
}


//reveal a letter of any unfound word upon clicking hint
function showLetterOnHint(setButtonDisabled) {
  
  console.log("Hint Pressed");
  let [randID, letterID, letterElem] = getRandomHintLetter();
  let letterStyle = window.getComputedStyle(letterElem)
  
  //find a new letter to show for hint if the user has already found this one
  while (letterStyle.backgroundColor == wordFoundColor || letterStyle.backgroundColor == hintColor) {
    [randID, letterID, letterElem] = getRandomHintLetter();
    letterStyle = window.getComputedStyle(letterElem)
  }
  
  hintedLetters.push(letterID);
  letterElem.style.backgroundColor = hintColor;
  
  const path = window.location.pathname;
  //show last letter of word also if difficulty is hard (two letter for each hint)
  if (path.includes("hard")) {
      const hintWord = allWordsCoordinates[randID];
      const lastLetterPosition = hintWord[hintWord.length - 1];
      const lastLetterID = `${lastLetterPosition[0]}-${lastLetterPosition[1]}`;
      const lastLetterElem = document.getElementById(lastLetterID)!;
      
      hintedLetters.push(lastLetterID);
      lastLetterElem.style.backgroundColor = hintColor;
  }

  //limit to 2 hints for easy and medium, and hard
  if ((!path.includes("hard") && hintedLetters.length >= 2) || (path.includes("hard") && hintedLetters.length >= 4)) {
    setButtonDisabled(true);
    console.log("All hints have been found", hintedLetters)
  }
    
}


//display board UI
const WordSearchBoard = ({newBoard, levelIndicator}): ReactElement => {

  const [isHintDisabled, setHintDisabled] = useState(false);
  const [remainingHints, setRemainingHints] = useState(0);

    return (
        <div>
            <h1 className="gameHeading">Word Search</h1>
            <div style={{position: 'absolute', display: 'flex', top: '10px', right: '10px'}}>
                <HintButton 
                  isHintDisabled={isHintDisabled} 
                  setHintDisabled={setHintDisabled} 
                  hintFunction={showLetterOnHint} 
                  remainingHints={remainingHints}/>
                <LevelIndicator level={levelIndicator} />
            </div>
            <DisplayBoard 
              boardGrid={newBoard} 
              wordsToFind={wordsToFind} 
              setHintDisabled={setHintDisabled}
              setRemainingHints={setRemainingHints}/>
        </div>
    )
}


export default WordSearchBoard;
