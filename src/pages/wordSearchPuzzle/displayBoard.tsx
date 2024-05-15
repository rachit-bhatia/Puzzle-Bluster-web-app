import React from 'react';
import { ReactElement, useState } from 'react';
import { wordsToFind } from './fillBoardGrid';

const DisplayBoard = ({ boardGrid }): ReactElement => {

    const [isLetterSelected, setIsLetterSelected] = useState(false);
    let [selectedWord, setSelectedWord] = useState("");  //record the letters selected by the player
    let selection = ""

    const wordFoundColor = "rgb(18, 119, 113)";

    //event handler for when the mouse is held down on a letter
    function letterHeld(event): void {
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

            //highlight the found solution word
            boardLetters.forEach((letter) => {
                if (letter.style.backgroundColor == "green") {
                    letter.style.backgroundColor = wordFoundColor;
                }
            });
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
        </div>
    )
}

export default DisplayBoard;
