import React from "react";
import { ReactElement, useState, useMemo } from "react";
import Modal from "../../models/save/save-game";

const PuzzleContainer = ({
  boardtype,
  board,
  puzzleSolutions,
  solvedPuzzles,
  timeElapsed,
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const memoizedBoardType = useMemo(() => boardtype, [boardtype]);

  return (
    <div className="mathPuzzleContainer">
      <button
        className="leaveBtn"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Leave game
      </button>
      {isOpen && (
        <Modal
          setIsOpen={setIsOpen}
          board={board}
          puzzleSolutions={puzzleSolutions}
          solvedPuzzles={solvedPuzzles}
          timeElapsed={timeElapsed}
        />
      )}
      {memoizedBoardType}
    </div>
  );
};

export default PuzzleContainer;
