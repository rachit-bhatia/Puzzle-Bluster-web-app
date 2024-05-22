import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './difficultySelection.css'; // Import the CSS file
import { UserAccount } from '../../models/shared'; // Adjust the import path as needed


const DifficultySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const userUuid = UserAccount.getUserUuid(); // Replace this with the actual user UUID

  const handleDifficultySelection = async (selectedDifficulty: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Store the selection in Firestore
      await UserAccount.storeDifficulty(userUuid, selectedDifficulty);
      console.log("Difficulty selection stored");

      // Navigate based on selection
      navigate(`/render/${selectedDifficulty}`);
    } catch (error) {
      console.error("Error storing difficulty selection: ", error);
      setErrorMessage("Failed to save selection. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="container">
      <div className="header">
        <button className="backButton" onClick={() => navigate('/home')}>←</button>
        <h4 className="title">Select Difficulty</h4>
        <h6 className="subtitle">Word Game</h6>
      </div>
      <div className="content">
        <div className="left-section">
          <img
            className="image"
            src="/img/wordgame.jpg"
            alt="Word Game"
          />
        </div>
        <div className="right-section">
          <div className="buttons">
            <button className="button" onClick={() => handleDifficultySelection('easy')} disabled={isSubmitting}>Easy</button>
            <button className="button" onClick={() => handleDifficultySelection('medium')} disabled={isSubmitting}>Medium</button>
            <button className="button" onClick={() => handleDifficultySelection('hard')} disabled={isSubmitting}>Hard</button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelectionPage;
