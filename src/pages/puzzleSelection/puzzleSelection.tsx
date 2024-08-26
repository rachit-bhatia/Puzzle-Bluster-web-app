import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./puzzleSelection.css";
import { auth } from "../../firebase/firebase";
import BackButton from "../../components/backButton";

const puzzles = [
  { id: 1, name: "Word Puzzles", type: "word" },
  { id: 2, name: "Math Puzzles", type: "math" },
];

const PuzzleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const userUuid = auth.currentUser?.uid;

  const goToPreviousPuzzle = () => {
    setCurrentPuzzleIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : puzzles.length - 1
    );
  };

  const goToNextPuzzle = () => {
    setCurrentPuzzleIndex((prevIndex) =>
      prevIndex < puzzles.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentPuzzle = puzzles[currentPuzzleIndex];

  return (
    <div className="container">
      <div className="header">
        <BackButton />
        <div className="title">Select Puzzle</div>
        <div className="subtitle">Word / Math</div>
      </div>
      <div className="puzzle-carousel">
        <div className="arrow left" onClick={goToPreviousPuzzle}>
          <div className="arrow-content"> ‹ </div>
        </div>

        <div className="puzzle-display">
          <div className="puzzle-grid"></div>
          <img
            className="image"
            src={`/img/${currentPuzzle.type.toLowerCase()}game.jpg`}
            alt={`${currentPuzzle.name}`}
          />
          <h3 className="puzzle-name">{currentPuzzle.name}</h3>
        </div>
        <div className="arrow right" onClick={goToNextPuzzle}>
          <div className="arrow-content"> › </div>
        </div>
      </div>
      <button
        className="play-button"
        onClick={() => navigate(`/render-${currentPuzzle.type}/levelselection`)}
      >
        Play
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default PuzzleSelection;
