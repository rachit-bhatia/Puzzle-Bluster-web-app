import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

const HintButton = ({ hintFunction, setHintDisabled, isHintDisabled, remainingHints, setRemainingHints }) => {
  return (
    <button 
      disabled={isHintDisabled} 
      onClick={() => {hintFunction(setHintDisabled);
                      setRemainingHints((prevHints) => prevHints - 1);
                      }} 
      style={{fontSize: '17px', marginRight: '20px'}}>
        <FaLightbulb /> Hint ({remainingHints})
    </button>
  );
};

export default HintButton;