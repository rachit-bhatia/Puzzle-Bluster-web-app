import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAccount } from "../shared";
import "./save-game.css";

const SaveModal = ({
  setIsOpen,
  board,
  wordsToFind,
  wordsFound,
  timeElapsed,
}) => {
  const navigate = useNavigate();

  function SaveGame() {
    storeInDB();
    sessionStorage.removeItem("grid");
    setIsOpen(false);
    navigate("/home");
  }

  function Leave() {
    sessionStorage.removeItem("grid");
    setIsOpen(false);
    navigate("/home");
  }

  // user id for testing purposes
  async function storeInDB() {
    const storedUser = sessionStorage.getItem("uid");
    const userUID = storedUser ? storedUser : "HAoX2nZWjQWsKsmS3NXaAv6QmT62";
    const user = await UserAccount.getUserByUuid(userUID);
    user.board = JSON.stringify(board);
    user.wordsToFind = JSON.stringify(wordsToFind);
    user.wordsFound = JSON.stringify(wordsFound);
    user.timeElapsed = timeElapsed;

    UserAccount.updateUser(user);
  }

  return (
    <>
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h3 className="heading">Leave game</h3>
          </div>
          <div className="modalContent">
            Are you sure you want to leave the game?
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button
                className="deleteBtn"
                style={{ width: "200px" }}
                onClick={() => SaveGame()}
              >
                Save and exit
              </button>
              <button
                className="exitBtn"
                style={{ width: "200px" }}
                onClick={() => Leave()}
              >
                Exit without saving
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveModal;
