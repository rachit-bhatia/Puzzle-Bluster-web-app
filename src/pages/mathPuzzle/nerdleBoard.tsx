import React, { useState } from 'react';

const NerdleBoard = ({ rows = 6, cols = 8 }) => {
    const [board, setBoard] = useState(Array(rows).fill().map(() => Array(cols).fill('')));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');

    const updateGuess = (value) => {
        if (currentGuess.length < cols) {
            setCurrentGuess(currentGuess + value);
            
            const newBoard = [...board];
            newBoard[currentRow] = currentGuess.split('').concat(value).concat(Array(cols - currentGuess.length - 1).fill(''));
            setBoard(newBoard);
        }
    };

    const deleteLastChar = () => {
        if (currentGuess.length > 0) {
            const newGuess = currentGuess.slice(0, -1);
            setCurrentGuess(newGuess);
            
            const newBoard = [...board];
            newBoard[currentRow] = newGuess.split('').concat(Array(cols - newGuess.length).fill(''));
            setBoard(newBoard);
        }
    };

    const submitGuess = () => {
        if (currentGuess.length === cols) {
            // Here you would add logic to check the guess
            setCurrentRow(currentRow + 1);
            setCurrentGuess('');
        }
    };

    return (
        <div className="nerdle-board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row">
                    {row.map((cell, cellIndex) => (
                        <div key={`${rowIndex}-${cellIndex}`} className="board-cell">
                            {cell}
                        </div>
                    ))}
                </div>
            ))}
            
            <div className="input-buttons">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '-', '*', '/', '='].map((value) => (
                    <button key={value} onClick={() => updateGuess(value)}>{value}</button>
                ))}
                <button onClick={deleteLastChar}>Delete</button>
                <button onClick={submitGuess}>Enter</button>
            </div>
        </div>
    );
};

export default NerdleBoard;