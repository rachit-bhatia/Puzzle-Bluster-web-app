import { db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateDoc, getDoc } from 'firebase/firestore';
import { auth } from "../../firebase/firebase";
import React, { ReactElement, useState } from 'react';
import { useEffect } from 'react';

interface DisplayBoardProps {
  boardGrid: string[][];
  wordsToFind: string[];
}

const DisplayBoardMedium: React.FC<DisplayBoardProps> = ({ boardGrid, wordsToFind }): ReactElement => {
const [selectedLetters, setSelectedLetters] = useState<{ row: number; col: number }[]>([]);
const [foundWords, setFoundWords] = useState<string[]>([]);
const [highlightedPositions, setHighlightedPositions] = useState<{ row: number; col: number }[]>([]);
const wordFoundColor = "rgb(18, 119, 113)";
const [timeElapsed, setTimeElapsed] = useState(0);
const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
      let interval = null;

      if (timerActive) {
          interval = setInterval(() => {
              setTimeElapsed((prevTime) => prevTime + 1);  // Increment the time by 1 second
          }, 1000);
      } else if (!timerActive && timeElapsed !== 0) {
          clearInterval(interval);  // Clear the interval if the timer is not active
      }

      return () => clearInterval(interval);  
    }, [timerActive, timeElapsed]);

    useEffect(() => {
        if (foundWords.length === wordsToFind.length) {
            setTimerActive(false);
            console.log("timer stop");
            // saveGameTimeToUserAccount(timeElapsed);
            storeInDB(timeElapsed);
        }
    }, [foundWords, timeElapsed]);  // This effect listens to changes in foundWords


    async function storeInDB(gameTime) {
      const user = auth.currentUser;
      if (user) {
          const userRef = doc(db, "users", user.uid);
          try {
              const docSnapshot = await getDoc(userRef);
              if (docSnapshot.exists()) {
                  // If the document exists, update it
                  await updateDoc(userRef, {
                      gameTime: gameTime
                  });
                  console.log("Game time updated successfully");
              } else {
                  // If the document does not exist, create it
                  await setDoc(userRef, {
                      gameTime: gameTime
                  });
                  console.log("Game time set successfully");
              }
          } catch (error) {
              console.error("Error saving game time: ", error);
          }
      } else {
          console.error("No authenticated user found");
      }
  }

  // Event handler for when the mouse is held down on a letter
  function letterHeld(event: React.MouseEvent<HTMLButtonElement>): void {
    if (!timerActive) {
        setTimerActive(true);  // Start the timer when the first letter is held
    }
    const row = parseInt(event.currentTarget.dataset.row!);
    const col = parseInt(event.currentTarget.dataset.col!);
    setSelectedLetters([{ row, col }]);
  }

  // Event handler for when the mouse is held down on a letter and moved to another letter
  function letterContinueHeld(event: React.MouseEvent<HTMLButtonElement>): void {
    if (selectedLetters.length > 0) {
      const currentRowIndex = parseInt(event.currentTarget.dataset.row!);
      const currentColIndex = parseInt(event.currentTarget.dataset.col!);

      const lastSelectedIndex = selectedLetters[selectedLetters.length - 1];
      const lastRow = lastSelectedIndex.row;
      const lastCol = lastSelectedIndex.col;

      const diffRow = currentRowIndex - lastRow;
      const diffCol = currentColIndex - lastCol;

      if ((diffRow === 0 && Math.abs(diffCol) === 1) || (diffCol === 0 && Math.abs(diffRow) === 1)) {
        setSelectedLetters((prevSelectedLetters) => [...prevSelectedLetters, { row: currentRowIndex, col: currentColIndex }]);
      }
    }
  }

  // Event handler for when the mouse is released from a letter
  function letterReleased(): void {
    let selectedWord = '';
    selectedLetters.forEach(({ row, col }) => {
      selectedWord += boardGrid[row][col];
    });

    if (wordsToFind.includes(selectedWord)) {
      setFoundWords((prevFoundWords) => [...prevFoundWords, selectedWord]);
      setHighlightedPositions((prevPositions) => [...prevPositions, ...selectedLetters]);
    }

    setSelectedLetters([]);
  }

  return (
    <div className="boardGrid" onMouseLeave={letterReleased}>
    <div className="timerDisplay">Time: {timeElapsed} seconds</div>
      <div className="boardContainer">
        <div className="board">
          {boardGrid.map((boardRow, rowIndex) => (
            <div key={rowIndex} className="boardRow">
              {boardRow.map((wordContent, colIndex) => {
                const isSelected = selectedLetters.some(({ row, col }) => row === rowIndex && col === colIndex);
                const isHighlighted = highlightedPositions.some(({ row, col }) => row === rowIndex && col === colIndex);
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className="boardCell"
                    onMouseDown={letterHeld}
                    onMouseEnter={letterContinueHeld}
                    onMouseUp={letterReleased}
                    data-row={rowIndex}
                    data-col={colIndex}
                    style={{ backgroundColor: isSelected ? "green" : "" || isHighlighted ? wordFoundColor : "" }}
                  >
                    {wordContent}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="wordList">
          <h3>Words to find:</h3>
          <ul>
            {wordsToFind.map((word, index) => (
              <li
                key={index}
                style={{
                  textDecoration: foundWords.includes(word) ? 'line-through' : 'none',
                  color: foundWords.includes(word) ? 'gray' : 'black',
                }}
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisplayBoardMedium;
