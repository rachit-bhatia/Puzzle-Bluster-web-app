import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

const HintButton = ({ hintFunction, setHintDisabled, isHintDisabled, remainingHints }) => {
  return (
    <button disabled={isHintDisabled} onClick={() => {hintFunction(setHintDisabled)}} style={{fontSize: '17px', marginRight: '20px'}}>
      <FaLightbulb /> Hint ({remainingHints})
    </button>
  );
};

export default HintButton;