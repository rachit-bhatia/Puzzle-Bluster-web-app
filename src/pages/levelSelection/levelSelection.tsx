import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./levelSelection.css"; // Import the CSS file
import { UserAccount } from "../../models/shared"; // Adjust the import path as needed
import { auth } from "../../firebase/firebase";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const LevelSelection: React.FC = () => {
  const navigate = useNavigate();
  const { puzzleType } = useParams<{ puzzleType: string }>();
  const slicedPuzzleType = puzzleType?.slice(7) ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //get current level progress
  const completedLevels = () => {
    if (localStorage.getItem("completedLevels") != null) {
      return JSON.parse(localStorage.getItem("completedLevels")!);
    } else {
      const levelProgress = { easy: 0, medium: 0, hard: 0 };
      localStorage.setItem("completedLevels", JSON.stringify(levelProgress));
      return levelProgress;
    }
  };

  const [selectedDifficulty, setSelectedDifficulty] = useState(() => {
    const savedDifficulty = localStorage.getItem("savedDifficulty");
    return savedDifficulty !== null ? JSON.parse(savedDifficulty) : "easy";
  });

  async function HandleDifficultySelection() {
    const userUuid = auth.currentUser?.uid; // Replace this with the actual user UUID

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Store the selection in Firestore
      await UserAccount.storeDifficulty(userUuid, selectedDifficulty);
      console.log("Difficulty selection stored - ", selectedDifficulty);

      // Navigate based on selection
      // navigate(`/render/${selectedDifficulty}`);
    } catch (error) {
      console.error("Error storing difficulty selection: ", error);
      setErrorMessage("Failed to save selection. Please try again.");
    }

    setIsSubmitting(false);
  }

  function DiffcultyDropdown() {
    return (
      <FormControl
        variant="filled"
        className="difficultyDropdown"
        style={{ position: "absolute" }}
      >
        <InputLabel style={{ fontSize: "18px" }}>Diffculty</InputLabel>
        <Select
          value={selectedDifficulty}
          label="Difficulty"
          onChange={(event) => {
            setSelectedDifficulty(event.target.value);
            localStorage.setItem(
              "savedDifficulty",
              JSON.stringify(event.target.value)
            );
            HandleDifficultySelection();
          }}
          style={{
            color: "rgb(92, 76, 56)",
            fontWeight: "bold",
            fontSize: "17px",
            border: "1px groove rgb(121, 97, 63)",
            borderRadius: "10px",
          }}
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>
    );
  }

  function isPrevLevelComplete(curLevel: number): boolean {
    const prevCompletedLevel = completedLevels()[selectedDifficulty];
    if (curLevel - prevCompletedLevel <= 1) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    console.log("Current puzzle type value:", puzzleType); // This should now log either "word" or "math" based on the URL
  }, [puzzleType]);

  return (
    <div className="container">
      <div className="header">
        <button className="backButton" onClick={() => navigate("/home")}>
          ←
        </button>
        <h4 className="title">
          {slicedPuzzleType.charAt(0).toUpperCase() +
            slicedPuzzleType.slice(1) +
            " Puzzle"}
        </h4>
        <DiffcultyDropdown />
      </div>

      <div className="content">
        <div className="left-section">
          <img
            className="image"
            src={`/img/${slicedPuzzleType}game.jpg`}
            alt={`${slicedPuzzleType} Game`}
          />
        </div>
        <div className="right-section">
          <div className="buttons">
            <button
              className="button"
              onClick={() => {
                console.log("Level 1 button clicked");
                navigate(`/${puzzleType}/${selectedDifficulty}/level1/0`);
              }}
              disabled={isPrevLevelComplete(1)}
            >
              Level 1
            </button>
            <button
              className="button"
              onClick={() =>
                navigate(`/${puzzleType}/${selectedDifficulty}/level2/0`)
              }
              disabled={isPrevLevelComplete(2)}
            >
              Level 2
            </button>
            <button
              className="button"
              onClick={() =>
                navigate(`/${puzzleType}/${selectedDifficulty}/level3/0`)
              }
              disabled={isPrevLevelComplete(3)}
            >
              Level 3
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;
