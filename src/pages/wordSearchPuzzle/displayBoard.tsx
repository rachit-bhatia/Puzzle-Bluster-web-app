
import { db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateDoc, getDoc } from 'firebase/firestore';
import { auth } from "../../firebase/firebase";
import React, { useEffect } from 'react';
import { ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DisplayBoard = ({ boardGrid, wordsToFind }): ReactElement => {

    let selection = ""
    const wordFoundColor = "rgb(18, 119, 113)";

    const navigate = useNavigate();
    const [isLetterSelected, setIsLetterSelected] = useState(false);
    let [selectedWord, setSelectedWord] = useState("");  //record the letters selected by the player
    const [timeElapsed, setTimeElapsed] = useState(0);  //milliseconds
    const [timerActive, setTimerActive] = useState(false);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);   //dialog box for level completion
    const [nextLevelID, setLevelID] = useState(""); //setting ID of next level
    const { difficulty, levelId } = useParams();


    useEffect(() => {
        let interval;

        if (timerActive) {
            interval = setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 1);  // Increment the time by 1 second
            }, 1000);
        } else if (!timerActive && timeElapsed !== 0) {
            clearInterval(interval);  // Clear the interval if the timer is not active
        }

        return () => clearInterval(interval);  
    }, [timerActive, timeElapsed]);

    //format time in mm:ss format
    const formatTime = (curTime: number) => {
        const seconds = Math.floor(curTime % 60);
        const minutes = Math.floor((curTime / 60) % 60);
    
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

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
    // const saveGameTimeToUserAccount = async (time) => {
    //     console.log("Saving game time to user account");
    //     console.log(time);
    // };


    //event handler for when the mouse is held down on a letter
    function letterHeld(event): void {
        if (!timerActive && foundWords.length < wordsToFind.length) {
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

            //save the level ID upon completion of level to unlock next level
            if (foundWords.length >= wordsToFind.length-1) {
                const completedLevels = JSON.parse(localStorage.getItem('completedLevels')!);
                const levelStr = levelId?.match(/\d+/);
                let levelNum: number;
                if (levelStr) {
                    levelNum = parseInt(levelStr[0])
                    completedLevels[difficulty!] = levelNum;
                    localStorage.setItem("completedLevels", JSON.stringify(completedLevels));

                    setLevelID(`level${levelNum+1}`)  //id of next level
                }

                //display completed level message
                setDialogOpen(true);

            }
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


    //popup message for level completion 
    function completionPopup(): JSX.Element {

        return (
            <div>
                <div className="darkBG"  onClick={() => setDialogOpen(false)}/>
                <div className= "centered">
                    <div className= "modal">
                    <div className= "modalHeader">
                        <h5 className= "heading">Puzzle solved!</h5>
                    </div>
                    <div className="modalContent">
                        Yay! You have found all the words on this board
                    </div>
                    <div className="modalActions">
                        <div className="actionsContainer">
                            <button 
                                style={{width: '250px'}}
                                onClick={() => {
                                    //TODO: call save to db here
                                    //navigate back to level selection if last level
                                    levelId!="level3" ? navigate(`/render/${difficulty}/${nextLevelID}`) : navigate("/difficultyselection")
                                    //reset required state variables
                                    setTimeElapsed(0);
                                    setTimerActive(false);
                                    setFoundWords([])
                                    setDialogOpen(false);
                                }}>
                                {levelId!="level3" ? "Next Level" : "Back to level selection"}
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
            <div className="timerDisplay" key={levelId}>{formatTime(timeElapsed)}</div>
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
         <div>
          {/* <h3>Words to find:</h3> */}
          <ul style={{display: 'flex', padding: '10px', justifyContent: 'center'}}> 
            {wordsToFind.map((word, index) => (
              <li
                key={index}
                className='wordList'
                style={{
                  backgroundColor: foundWords.includes(word) ? 'rgb(217, 152, 67)' : 'rgb(230, 176, 107)',
                  color: foundWords.includes(word) ? 'gray' : 'black',
                  transition: 'color 0.2s, background-color 0.2s'
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