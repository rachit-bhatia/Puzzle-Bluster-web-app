import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

const HintButton = ({ hintFunction }) => {
  return (
    <button onClick={() => {hintFunction()}} style={{fontSize: '17px', marginRight: '20px'}}>
      <FaLightbulb /> Hint
    </button>
  );
};

export default HintButton;