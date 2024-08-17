import React from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { UserAccount } from "../../models/shared";

function HomePage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignOutSuccessful, setIsSignOutSuccessful] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [levelID, setLevelID] = useState("");
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const navigate = useNavigate();

  const onSignOut = async (event) => {
    event.preventDefault();
    try {
      await auth.signOut();
      console.log("sign out successful");
      setIsSignOutSuccessful(true);
    } catch (error) {
      setErrorMessage(errorMessage);
      console.log(error);
    }
  };

  useEffect(() => {
    const checkSavedGame = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.email);
        try {
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const puzzleSaveState = data.puzzleSaveState;
            console.log(puzzleSaveState);
            if (puzzleSaveState && Object.keys(puzzleSaveState).length > 0) {
              setHasSavedGame(true);
              const difficulty = puzzleSaveState.difficulty;
              const levelId = puzzleSaveState.levelId;

              setDifficulty(difficulty);
              setLevelID(levelId);
            } else {
              console.log("No saved game state found");
            }
          } else {
            console.log("No saved game state found");
          }
        } catch (error) {
          console.error("Error loading game state: ", error);
        }
      } else {
        console.error("No authenticated user found");
      }
    };
    checkSavedGame();
  }, [isDialogOpen]);

  function loadPopup(): JSX.Element {
    return (
      <div>
        <div className="darkBG" onClick={() => setDialogOpen(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Load Game</h5>
            </div>
            <div className="modalContent">
              Do you want to load a previous saved game?
            </div>
            <div className="modalActions">
              <div
                className="modalContainer"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button
                  style={{ width: "220px", margin: "0 20px" }}
                  onClick={() => {
                    if (hasSavedGame) {
                      navigate(`/render/${difficulty}/${levelID}/1`);
                      setDialogOpen(false);
                    } else {
                      setDialogOpen(false);
                      setErrorMessage("No saved game found");
                    }
                  }}
                >
                  {"Load Game"}
                </button>
                <button
                  style={{ width: "220px", margin: "0 20px" }}
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                >
                  {"Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REMOVE THIS ( JUST FOR TESTING)
  const getUsers = async (event) => {
    event.preventDefault();

    await UserAccount.getCollection();
    console.log(UserAccount.users);
  };
  return (
    <div>
      {isSignOutSuccessful && <Navigate to="/signin" replace={true} />}
      <h1>Puzzle Bluster</h1>
      <h3>Let's solve some Word Search Puzzles!</h3>
      <div style={{ paddingTop: "100px" }}>
        <button onClick={onSignOut}>Sign Out</button>
        <button onClick={() => navigate("/accountPage")}>
          Account Details
        </button>
        <button onClick={() => navigate("/difficultyselection")}>
          Start Game
        </button>
      </div>
    </div>
  );
}

export default HomePage;
