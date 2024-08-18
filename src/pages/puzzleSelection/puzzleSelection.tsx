import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./puzzleSelection.css";
import { auth } from "../../firebase/firebase";

const puzzles = [
  { id: 1, name: "Word Puzzles", type: "Word" },
  { id: 2, name: "Math Puzzles", type: "Math" },
];

const PuzzleSelectionPage: React.FC = () => {
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

  const handlePuzzleSelection = () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (currentPuzzle.type === "Word") {
        navigate("/render-word/difficultySelection");
      } else if (currentPuzzle.type === "Math") {
        navigate("/render-math/difficultySelection");
      } else {
        throw new Error("Invalid puzzle type");
      }
    } catch (error) {
      console.error("Error navigating to difficulty selection: ", error);
      setErrorMessage("Failed to navigate. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="container">
      <div className="header">
        <button className="backButton" onClick={() => navigate("/home")}>
          ←
        </button>
        <h4 className="title">Select Puzzle</h4>
        <h6 className="subtitle">Word / Math / Spatial / Logic</h6>
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
        onClick={handlePuzzleSelection}
        disabled={isSubmitting}
      >
        Play
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default PuzzleSelectionPage;
