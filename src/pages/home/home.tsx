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
  const [isPuzzleTypeDialogOpen, setPuzzleTypeDialogOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
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

  

  const checkSavedWordPuzzle = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const puzzleSaveState = data.puzzleSaveState;
          const wordPuzzleSaveState = puzzleSaveState.wordPuzzleSaveState;
          console.log(puzzleSaveState);
          if (wordPuzzleSaveState && Object.keys(wordPuzzleSaveState).length > 0) {
            const difficulty = wordPuzzleSaveState.difficulty;
            const levelId = wordPuzzleSaveState.levelId;
            const puzzleType = wordPuzzleSaveState.puzzleType;

            navigate(`/render-${puzzleType}/${difficulty}/${levelId}/1`);
          } else {
            setErrorDialogOpen(true);
            console.log("No saved game state found");

          }
        } else {
          setErrorDialogOpen(true);
          console.log("No saved game state found");
        }
      } catch (error) {
        console.error("Error loading game state: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  };

  const checkSavedMathPuzzle = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.email);
      try {
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const puzzleSaveState = data.puzzleSaveState;
          const mathPuzzleSaveState = puzzleSaveState.mathPuzzleSaveState;
          console.log(puzzleSaveState);
          if (mathPuzzleSaveState && Object.keys(mathPuzzleSaveState).length > 0) {
            const difficulty = mathPuzzleSaveState.difficulty;
            const levelId = mathPuzzleSaveState.levelId;
            const puzzleType = mathPuzzleSaveState.puzzleType;

            navigate(`/render-${puzzleType}/${difficulty}/${levelId}/1`);
          } else {
            setErrorDialogOpen(true);
            console.log("No saved game state found");
          }
        } else {
          setErrorDialogOpen(true);
          console.log("No saved game state found");
        }
      } catch (error) {
        console.error("Error loading game state: ", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  };

  function errorPopup(): JSX.Element {
    return (
      <div>
        <div className="darkBG" onClick={() => setErrorDialogOpen(false)} />
        <div className="centered">
          <div className="modal" style={{height: "100px", width: "400px"}}>
            <div className="modalHeader">
              <h5 className="heading" style={{fontSize : "20px" , paddingTop : "10px"}}>Error: No save found</h5>
            </div>
            <div className="modalActions">
              <div
                className="modalContainer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <button
                  style={{ width: "220px", margin: "0 20px", paddingTop: "10px" }}
                  onClick={() => {
                    setErrorDialogOpen(false);
                  }}
                >
                  {"Okay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

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
                      setDialogOpen(false);
                      setPuzzleTypeDialogOpen(true);
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

  function selectPuzzleLoad(): JSX.Element {
    return (
      <div>
        <div className="darkBG" onClick={() => setPuzzleTypeDialogOpen(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading" style={{fontSize : "20px" , paddingTop : "10px"}}>Select Puzzle to Load</h5>
            </div>
            <div className="modalContent" style={{ paddingBottom : "30px" ,paddingTop : "10px" }}>
              Select saved game
            </div>
            <div className="modalActions">
              <div
                className="modalContainer"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button
                  style={{ width: "220px", margin: "0 10px" }}
                  onClick={() => {
                    setPuzzleTypeDialogOpen(false);
                    checkSavedWordPuzzle();
                  }}
                >
                  {"Word Puzzle"}
                </button>
                <button
                  style={{ width: "220px", margin: "0 10px" }}
                  onClick={() => {
                    setPuzzleTypeDialogOpen(false);
                    checkSavedMathPuzzle();
                  }}
                >
                  {"Math Puzzle"}
                </button>
                <button
                  style={{ width: "220px", margin: "0 10px" }}
                  onClick={() => {
                    setPuzzleTypeDialogOpen(false);
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
        {isPuzzleTypeDialogOpen && selectPuzzleLoad()}
        {isErrorDialogOpen && errorPopup()}
      </div>
    </div>
  );
}

export default HomePage;
