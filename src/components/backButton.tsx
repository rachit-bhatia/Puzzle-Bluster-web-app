import React from "react";
import { useNavigate } from "react-router-dom";
import "./backButton.css"; // Assuming you have some styles for the button

const BackButton= ({ returnPath = "/home", color = "#ffffff" }) => {
  const navigate = useNavigate();

  return (
    <button className="backButton" style={{color: color}} onClick={() => navigate(returnPath)}>
      ←
    </button>
  );
};

export default BackButton;
