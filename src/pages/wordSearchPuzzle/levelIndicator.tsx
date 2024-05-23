import React from 'react';


interface LevelIndicatorProps {
    level: string;
  }
  
  const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level }) => {
    const indicatorStyle: React.CSSProperties = {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'lightgray',
      padding: '5px 10px',
      border: '0.5px solid black',
      borderRadius: '5px',
      color: 'black',
      fontWeight: 'bold',
    };
  
    return (
      <div style={indicatorStyle}>
        LEVEL: {level}
      </div>
    );
  };
  
  export default LevelIndicator;

