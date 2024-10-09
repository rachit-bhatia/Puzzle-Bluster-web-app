import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./levelSelection.css"; // Import the CSS file
import { auth } from "../../firebase/firebase";
import { db } from "../../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import BackButton from "../../components/backButton";
import { User } from "firebase/auth";

const LevelSelection: React.FC = () => {
  const navigate = useNavigate();
  const { puzzleType } = useParams<{ puzzleType: string }>();
  const slicedPuzzleType = puzzleType?.slice(7) ?? "";
  const [completedLevelsList, setCompletedLevelsList] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [difficulty, setDifficulty] = useState(() => {
    const savedDifficulty = localStorage.getItem('savedDifficulty');
    return savedDifficulty !== null ? JSON.parse(savedDifficulty) : "easy";
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const puzzleName = slicedPuzzleType=="word" ? "Word Search" : "Matrix Frenzy";
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  
    // Listen for auth state changes
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, retrieve their info
          setFirebaseUser(user);
        } else {
          // User is signed out or not logged in
          console.log("User is not logged in");
          setFirebaseUser(null); // Optional: Reset user state when logged out
        }
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

  async function initializeProgress() {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const progressField = `${slicedPuzzleType}CompletedLevels`;

          if (data?.Progress?.[progressField]) {
            const completedLevels = JSON.parse(data.Progress[progressField]);
            const savedDifficulty = data.Progress?.savedDifficulty || "easy";
            setCompletedLevelsList(completedLevels);
            // setDifficulty(savedDifficulty);
          } else {
            await updateDoc(userRef, {
              [`Progress.${progressField}`]: JSON.stringify(completedLevelsList),
              "Progress.savedDifficulty": difficulty,
            });
          }
        }
      } catch (error) {
        console.error("Error loading game state: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  }

  async function updateProgress() {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const progressField = `${slicedPuzzleType}CompletedLevels`;

        await updateDoc(userRef, {
          "Progress.savedDifficulty": difficulty,
          [`Progress.${progressField}`]: JSON.stringify(completedLevelsList),
        });
      } catch (error) {
        console.error("Error updating progress: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  }


  function DiffcultyDropdown() {
    return (
      <FormControl
        variant="filled"
        className="difficultyDropdown"
        style={{ position: "absolute" }}
      >
        <InputLabel style={{ fontSize: "18px" }}>Difficulty</InputLabel>
        <Select
          value={difficulty}
          label="Difficulty"
          onChange={async (event) => {
            setDifficulty(event.target.value);
            localStorage.setItem('savedDifficulty', JSON.stringify(event.target.value));
            await updateProgress();
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
    const prevCompletedLevel = completedLevelsList[difficulty];
    return curLevel - prevCompletedLevel > 1;
  }

  useEffect(() => {
    initializeProgress();
  }, [firebaseUser]);

  return (
    <div className="container" style={{backgroundColor: "rgb(198, 169, 134)", color: "rgb(92, 76, 56)"}}>
      <div className="header" style={{color: "rgb(92, 76, 56)"}}>
        <BackButton returnPath={"/puzzleselection"} color="rgb(92, 76, 56)"/>
        <h4 className="title">
          {puzzleName}
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
                navigate(`/${puzzleType}/${difficulty}/level1/0`);
              }}
              disabled={isPrevLevelComplete(1)}
            >
              Level 1
            </button>
            <button
              className="button"
              onClick={() =>
                navigate(`/${puzzleType}/${difficulty}/level2/0`)
              }
              disabled={isPrevLevelComplete(2)}
            >
              Level 2
            </button>
            <button
              className="button"
              onClick={() =>
                navigate(`/${puzzleType}/${difficulty}/level3/0`)
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
