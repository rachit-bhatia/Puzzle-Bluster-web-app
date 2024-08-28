import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./puzzleSelection.css";
import { auth } from "../../firebase/firebase";
import BackButton from "../../components/backButton";

const puzzles = [
  { id: 1, name: "Word Search", type: "word" },
  { id: 2, name: "Matrix Frenzy", type: "math" },
];

const PuzzleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  // const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(() => {
  //   const savedPuzzle = localStorage.getItem('savedPuzzle');
  //   return savedPuzzle !== null ? JSON.parse(savedPuzzle) : 1;
  // });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const userUuid = auth.currentUser?.uid;
  const user = auth.currentUser;
  const homePath = user ? "/home" : "/home-guest";

  const goToPreviousPuzzle = () => {
    setCurrentPuzzleIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : puzzles.length - 1
    );
    localStorage.setItem('savedPuzzle', JSON.stringify(currentPuzzleIndex));
    console.log("Puzzle: ", localStorage.getItem('savedPuzzle'));
  };

  const goToNextPuzzle = () => {
    setCurrentPuzzleIndex((prevIndex) =>
      prevIndex < puzzles.length - 1 ? prevIndex + 1 : 0
    );
    localStorage.setItem('savedPuzzle', JSON.stringify(currentPuzzleIndex));
    console.log("Puzzle: ", localStorage.getItem('savedPuzzle'));
  };

  const currentPuzzle = puzzles[currentPuzzleIndex];

  return (
    <div className="container">
      <div className="home-decor" style={{bottom: "-120px", right: "-20px", transform: "rotate(20deg)"}}></div>
      <div className="home-decor2" style={{top: "30vh", left: "-110px", transform: "rotate(10deg)"}}></div>
      <div className="home-decor2" style={{top: "-20px", right: "-100px", transform: "rotate(-10deg)"}}></div>
      <div className="header">
        <BackButton returnPath={homePath}/>
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
