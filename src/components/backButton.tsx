import React from "react";
import { useNavigate } from "react-router-dom";
import "./backButton.css"; // Assuming you have some styles for the button

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button className="backButton" onClick={() => navigate(-1)}>
      ←
    </button>
  );
};

export default BackButton;
