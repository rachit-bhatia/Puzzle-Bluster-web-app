import React from 'react';


const HintButton = ({ hintFunction }) => {
  return (
    <button onClick={() => {hintFunction()}} style={{marginRight: '20px'}}>
      Show Hint
    </button>
  );
};

export default HintButton;