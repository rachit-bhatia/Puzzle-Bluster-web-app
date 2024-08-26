import React from 'react';
import { ReactElement, useState, useMemo } from "react";
import Modal from '../../models/save/save-game';
import SaveModal from '../../models/save/save-game';

//Parameters for the game state such as difficulty and words found may be added
const PuzzleContainer = ( { boardtype, board, wordsToFind, wordsFound, timeElapsed}): ReactElement => {

    const memoizedBoardType = useMemo(() => boardtype, [boardtype]);

    return(
        <div>
            {memoizedBoardType}
        </div>
    )
}
export default PuzzleContainer;
