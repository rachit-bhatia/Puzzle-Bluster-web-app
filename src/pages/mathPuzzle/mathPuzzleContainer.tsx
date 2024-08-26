import React from "react";
import { ReactElement, useState, useMemo } from "react";
import Modal from "../../models/save/save-game";

const PuzzleContainer = ({ boardtype, board, puzzleSolutions, solvedPuzzles, timeElapsed }): ReactElement => {

    const memoizedBoardType = useMemo(() => boardtype, [boardtype]);

    return (
        <div>
            {memoizedBoardType}
        </div>
    );
}

export default PuzzleContainer;

