import React from "react";
import { auth } from "../../firebase/firebase";
import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { UserAccount } from "../../models/shared";

function HomePage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignOutSuccessful, setIsSignOutSuccessful] = useState(false);
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
        <button onClick={() => navigate("/account-details")}>
          Account Details
        </button>
        <button onClick={() => navigate("/puzzleselection")}>Start Game</button>
      </div>
    </div>
  );
}

export default HomePage;
