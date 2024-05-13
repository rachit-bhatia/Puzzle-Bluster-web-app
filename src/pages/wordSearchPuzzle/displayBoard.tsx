import React from 'react';
import { ReactElement, useState } from 'react';

const DisplayBoard = ({ boardGrid }): ReactElement => {

    const [isLetterSelected, setIsLetterSelected] = useState(false);

    //event handler for when the mouse is held down on a letter
    function letterHeld(event): void {
        setIsLetterSelected(true);  
        event.target.style.backgroundColor = "green";
    }

    //event handler for when the mouse is held down on a letter and moved to another letter
    function letterContinueHeld(event): void {
        if (isLetterSelected) {
            event.target.style.backgroundColor = "green";
        } 
    }

    //event handler for when the mouse is released from a letter
    function letterReleased(): void {
        setIsLetterSelected(false);  
        
        //reset the color of all selected letters once mouse is released
        const selectedLetters = Array.from(document.getElementsByClassName("boardCell") as HTMLCollectionOf<HTMLElement>);
        selectedLetters.forEach((letter) => {
            letter.style.backgroundColor = "";
        });
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
