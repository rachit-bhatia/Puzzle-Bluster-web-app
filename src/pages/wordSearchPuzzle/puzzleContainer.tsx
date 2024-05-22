import React from 'react';
import { ReactElement, useState, useMemo } from "react";
import Modal from '../../models/save/save-game';

//Parameters for the game state such as difficulty and words found may be added
const PuzzleContainer = ( { boardtype, board, wordsToFind1, wordsFound, timeElapsed}): ReactElement => {

    // let storedGrid = sessionStorage.getItem('grid');
    // let newboard = storedGrid ? JSON.parse(storedGrid) : board; 
    const [isOpen, setIsOpen] = useState(false);
    const memoizedBoardType = useMemo(() => boardtype, [boardtype]);

    // useEffect(() => {
    //     sessionStorage.setItem('grid', JSON.stringify(newboard));
    // }, [newboard]);

    return(
        <div>
            <button className="leaveBtn"onClick={() => {setIsOpen(true);}}>
                Leave game
            </button>
            {isOpen && <Modal setIsOpen={setIsOpen} board={board} wordsToFind={wordsToFind1} wordsFound={wordsFound} timeElapsed={timeElapsed}/>}
            {/* {boardtype && React.cloneElement(boardtype)} */}
            {memoizedBoardType}
        </div>
    )
}
export default PuzzleContainer;
