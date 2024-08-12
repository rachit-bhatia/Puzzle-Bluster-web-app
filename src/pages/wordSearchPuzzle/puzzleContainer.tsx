import React from 'react';
import { ReactElement, useState, useMemo } from "react";
import Modal from '../../models/save/save-game';
import SaveModal from '../../models/save/save-game';

//Parameters for the game state such as difficulty and words found may be added
const PuzzleContainer = ( { boardtype, board, wordsToFind, wordsFound, timeElapsed}): ReactElement => {

    // let storedGrid = sessionStorage.getItem('grid');
    // let newboard = storedGrid ? JSON.parse(storedGrid) : board; 
    const [isOpen, setIsOpen] = useState(false);
    const memoizedBoardType = useMemo(() => boardtype, [boardtype]);

    // useEffect(() => {
    //     sessionStorage.setItem('grid', JSON.stringify(newboard));
    // }, [newboard]);

    return(
        <div>
            {/* <button className="leaveBtn"onClick={() => {setIsOpen(true);}}>
                Leave game
            </button>
            {isOpen && <SaveModal setIsOpen={setIsOpen} board={board} wordsToFind={wordsToFind} wordsFound={wordsFound} timeElapsed={timeElapsed}/>}
            {boardtype && React.cloneElement(boardtype)} */}
            {memoizedBoardType}
        </div>
    )
}
export default PuzzleContainer;
