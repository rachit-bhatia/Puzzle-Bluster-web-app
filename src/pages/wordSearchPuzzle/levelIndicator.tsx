import React from 'react';


interface LevelIndicatorProps {
    level: string;
  }
  
  const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level }) => {
    const indicatorStyle: React.CSSProperties = {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(53, 42, 27, 0.6)',
      padding: '5px 10px',
      borderRadius: '5px',
      color: 'white',
      fontWeight: 'bold',
      opacity: '0.6',
    };
  
    return (
      <div style={indicatorStyle}>
        {level}
      </div>
    );
  };
  
  export default LevelIndicator;

