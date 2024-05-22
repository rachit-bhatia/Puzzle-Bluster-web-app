import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAccount } from "../shared";
import "./save-game.css";

const Modal = ({ setIsOpen, board, wordsToFind, wordsFound, timeElapsed}) => {
  const navigate = useNavigate();

  function SaveGame(){
    storeInDB();
    sessionStorage.removeItem('grid');
    setIsOpen(false);
    navigate('/home')
  }
  
  function Leave(){
    sessionStorage.removeItem('grid');
    setIsOpen(false);
    navigate('/home')
  }

  // HAoX2nZWjQWsKsmS3NXaAv6QmT62
  // user id for testing purposes
  async function storeInDB(){
    const storedUser = sessionStorage.getItem('uid');
    const userUID = storedUser ? storedUser: 'HAoX2nZWjQWsKsmS3NXaAv6QmT62';
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
      <div className= "centered">
        <div className= "modal">
          <div className= "modalHeader">
            <h5 className= "heading">Leave game</h5>
          </div>
          <div className="modalContent">
            Are you sure you want to leave the game?
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button className="deleteBtn" onClick={() => SaveGame()}>
                Save and exit
              </button>
              <button className= "exitBtn" onClick={() => Leave()}>
                Exit without saving
              </button>
              <button className="cancelBtn" onClick={() => setIsOpen(false)}>
                Cancel 
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
