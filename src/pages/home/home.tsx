import React from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { UserAccount } from "../../models/shared";
import "./home.css";

function HomePage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignOutSuccessful, setIsSignOutSuccessful] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [levelID, setLevelID] = useState("");
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [puzzleType, setPuzzleType] = useState("");
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
              const puzzleType = puzzleSaveState.puzzleType;

              setDifficulty(difficulty);
              setLevelID(levelId);
              setPuzzleType(puzzleType);
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
              <h5 className="heading" style={{fontSize : "20px" , paddingTop : "10px"}}>Load Game</h5>
            </div>
            <div className="modalContent" style={{ paddingBottom : "30px" ,paddingTop : "10px" }}>
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
                      // Assuming the saved game is always a word puzzle. If not, you'll need to store and retrieve the puzzle type as well.
                      navigate(`/render-${puzzleType}/${difficulty}/${levelID}/1`);
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
    <div className="home-container">
      <div className="home-decor" style={{top: "-150px", left: "-20px", transform: "rotate(120deg)"}}></div>
      <div className="home-decor" style={{bottom: "-120px", right: "-20px", transform: "rotate(70deg)"}}></div>
      <div className="home-decor2" style={{top: "50vh", left: "-100px", transform: "rotate(10deg)"}}></div>
      <div className="home-decor2" style={{top: "100px", right: "-100px", transform: "rotate(-25deg)"}}></div>
      {isSignOutSuccessful && <Navigate to="/signin" replace={true} />}
      <div className="content">
        <img
          src="/img/homepageani.gif"
          alt="Puzzle Bluster"
          className="game-image"
        />
        <div className="PuzzleGame">Puzzle Bluster</div>
        <div className="button-container" style={{ paddingTop: "20px" }}>
          <button
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            Load Game
          </button>
          <button onClick={() => navigate("/puzzleselection")}>
            Start Game
          </button>

          <button onClick={() => navigate("/accountPage")}>
            Account Details
          </button>

          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
          <button onClick={onSignOut}>Sign Out</button>
        </div>
        {isDialogOpen && loadPopup()}
      </div>
    </div>
  );
}

export default HomePage;
