
import { db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { auth } from "../../firebase/firebase";
import React, { useEffect } from 'react';
import { ReactElement, useState } from 'react';

const DisplayBoard = ({ boardGrid, wordsToFind  }): ReactElement => {

    const [isLetterSelected, setIsLetterSelected] = useState(false);
    let [selectedWord, setSelectedWord] = useState("");  //record the letters selected by the player
    let selection = ""
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [foundWords, setFoundWords] = useState<string[]>([]);

    const wordFoundColor = "rgb(18, 119, 113)";

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
                await updateDoc(userRef, {
                    gameTime: gameTime
                });
                console.log("Game time updated successfully");
            } catch (error) {
                console.error("Error updating game time: ", error);
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
    function letterHeld(event): void {
        if (!timerActive) {
            setTimerActive(true);  // Start the timer when the first letter is held
        }
        if (event.target.style.backgroundColor != wordFoundColor) {
            setIsLetterSelected(true);  
            event.target.style.backgroundColor = "green";

            //record user selections
            selection += event.target.innerHTML;  
            setSelectedWord(selection);
        }
    }

    //event handler for when the mouse is held down on a letter and moved to another letter
    function letterContinueHeld(event): void {
        
        if (event.target.style.backgroundColor == wordFoundColor) {
            letterReleased();   //stop highlighting if the word is already found
        } else if (isLetterSelected) {
            event.target.style.backgroundColor = "green";

            //record user selections
            selection = selectedWord;
            selection += event.target.innerHTML;  
            setSelectedWord(selection);
        } 
    }

    //event handler for when the mouse is released from a letter
    function letterReleased(): void {
        setIsLetterSelected(false);  

        const boardLetters = Array.from(document.getElementsByClassName("boardCell") as HTMLCollectionOf<HTMLElement>);

        //check if the selected word is one of the words to find
        if (wordsToFind.includes(selectedWord)) {
            setFoundWords((prevFoundWords) => [...prevFoundWords, selectedWord])

            //highlight the found solution word
            boardLetters.forEach((letter) => {
                if (letter.style.backgroundColor == "green") {
                    letter.style.backgroundColor = wordFoundColor;
                }
            });
            // checkCompletion();
        } 
        
        //reset the color of all selected letters if not the correct solution word
        else {
            boardLetters.forEach((letter) => {
                if (letter.style.backgroundColor == "green") {
                    letter.style.backgroundColor = "";
                }
            });

        }
        
        //reset selection
        console.log(selectedWord);
        selection = "";
        setSelectedWord(selection);
    }
    

    return (
        <div className="boardGrid" onMouseLeave={letterReleased}>
            <div className="timerDisplay">Time: {timeElapsed} seconds</div>
            {boardGrid.map((boardRow) => (
                <div className="boardRow">

                    {boardRow.map((wordContent) => (
                        <button 
                            className="boardCell"
                            onMouseDown={letterHeld}
                            onMouseEnter={letterContinueHeld}
                            onMouseUp={letterReleased}
                        >
                            {wordContent}
                        </button>
                    ))}
                </div>
        ))}
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
    )
}

export default DisplayBoard;