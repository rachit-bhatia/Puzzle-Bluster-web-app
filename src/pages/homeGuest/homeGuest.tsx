import React from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserAccount } from "../../models/shared";
import "../home/home.css";

function HomePageGuest() {
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

  // REMOVE THIS ( JUST FOR TESTING)
  const getUsers = async (event) => {
    event.preventDefault();

    await UserAccount.getCollection();
    console.log(UserAccount.users);
  };
  return (
    <div>
      <div className="home-container">
      <div className="home-decor" style={{top: "-150px", left: "-20px", transform: "rotate(120deg)"}}></div>
      <div className="home-decor" style={{bottom: "-120px", right: "-20px", transform: "rotate(70deg)"}}></div>
      <div className="home-decor2" style={{top: "50vh", left: "-100px", transform: "rotate(10deg)"}}></div>
      <div className="home-decor2" style={{top: "100px", right: "-100px", transform: "rotate(-25deg)"}}></div>
        {isSignOutSuccessful && <Navigate to="/signin" replace={true} />}
        <div className="content">
          <img
            src="/img/homepageani.gif"
            alt="Puzzle Game"
            className="game-image"
          />
          <div className="PuzzleGame">Puzzle Bluster</div>
          <div className="button-container" style={{ paddingTop: "20px" }}>
            <button onClick={() => navigate("/puzzleselection")}>
              Start Game
            </button>
            <button onClick={() => navigate("/signin")}>Login / Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageGuest;
