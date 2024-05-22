import React, { useState } from 'react';
import { ReactElement } from "react";
import DisplayBoardMedium from "./displayBoardMedium";
import LevelIndicator from './levelIndicator';

const wordsToFindMedium: string[] = [
    "HELLO",
    "WORLD",
    "REACT",
    "JAVA",
    "COMPONENT",
    "FUNCTION",
    "DEVELOP",
    "PROGRAM",
    "FRONTEND",
    "BACKEND",
    "DATABASE",
    "SERVER",
    "CLIENT",
    "FETCH",
    "STATE",
  ];

export function FillBoardGridMedium(): { boardGrid: string[][], wordsToFind: string[] } {


    //solution words that exist in the puzzle
    const wordsToFind = wordsToFindMedium.sort(() => 0.5 - Math.random()).slice(0, 5);

    const boardSize = 12;  //12x12 board

    //set of 4 directions in which letters of solution words can be placed on the board
    const possibleDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    //create 2D array to store the board
    var boardGrid: string[][] = new Array(boardSize);  

    for(let i = 0; i < boardSize; i++){
        boardGrid[i] = new Array(boardSize);

        //fill the board with empty strings
        for(let j = 0; j < boardSize; j++){
            boardGrid[i][j] = "";
        }
    }

    //loop through each solution word and place it on the board
    for(let i = 0; i < wordsToFind.length; i++){
        let word = wordsToFind[i];

        let isWordEntered = false;

        while (!isWordEntered) {
            //get random starting position
            let randomRow = Math.floor(Math.random() * boardSize);
            let randomCol = Math.floor(Math.random() * boardSize);

            //try to enter the word on the board
            isWordEntered = canEnterSolutionWords(randomRow, randomCol, word);
        }

    }

    //fill the rest of the board with random letters 
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){

            //add random letters if the cell is empty
            if(boardGrid[i][j] === ""){
                boardGrid[i][j] = String.fromCharCode(65 + Math.random()*26);
                // boardGrid[i][j] = "-";  //uncomment this line when testing to see exactly where the words are placed
            }
        }
    }

    function canEnterSolutionWords(startRow: number, startCol: number, solutionWord: string): boolean {
        let curRow = startRow;
        let curCol = startCol;
    
        let letterPositions = new Array(solutionWord.length);  //store the positions of the letters
    
        // Randomly choose between horizontal and vertical directions
        const isHorizontal = Math.random() < 0.5;
        const isReverse = Math.random() < 0.5;
    
        for (let i = 0; i < solutionWord.length; i++) {
            let letter = solutionWord.charAt(i);  //get each letter
    
            if (isHorizontal) {
                if (isReverse) {
                    // Right to left
                    if (isDirectionValid(curRow, curCol)) {
                        boardGrid[curRow][curCol] = letter;
                        letterPositions[i] = [curRow, curCol];
                        curCol--;
                    } else {
                        //reset the cells if the word cannot be entered
                        for (let j = 0; j < i; j++) {
                            let row = letterPositions[j][0];
                            let col = letterPositions[j][1];
                            boardGrid[row][col] = "";  //clear the board
                        }
                        return false;
                    }
                } else {
                    // Left to right
                    if (isDirectionValid(curRow, curCol)) {
                        boardGrid[curRow][curCol] = letter;
                        letterPositions[i] = [curRow, curCol];
                        curCol++;
                    } else {
                        //reset the cells if the word cannot be entered
                        for (let j = 0; j < i; j++) {
                            let row = letterPositions[j][0];
                            let col = letterPositions[j][1];
                            boardGrid[row][col] = "";  //clear the board
                        }
                        return false;
                    }
                }
            } else {
                if (isReverse) {
                    // Bottom to top
                    if (isDirectionValid(curRow, curCol)) {
                        boardGrid[curRow][curCol] = letter;
                        letterPositions[i] = [curRow, curCol];
                        curRow--;
                    } else {
                        //reset the cells if the word cannot be entered
                        for (let j = 0; j < i; j++) {
                            let row = letterPositions[j][0];
                            let col = letterPositions[j][1];
                            boardGrid[row][col] = "";  //clear the board
                        }
                        return false;
                    }
                } else {
                    // Top to bottom
                    if (isDirectionValid(curRow, curCol)) {
                        boardGrid[curRow][curCol] = letter;
                        letterPositions[i] = [curRow, curCol];
                        curRow++;
                    } else {
                        //reset the cells if the word cannot be entered
                        for (let j = 0; j < i; j++) {
                            let row = letterPositions[j][0];
                            let col = letterPositions[j][1];
                            boardGrid[row][col] = "";  //clear the board
                        }
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //returns true if the chosen direction of the letter to be placed is valid
    function isDirectionValid(row: number, col: number): boolean {
        if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && boardGrid[row][col] === "") {
            return true;
        }
        return false;
    }

    return { boardGrid, wordsToFind: wordsToFindMedium };
}

//display board UI
const WordSearchBoardMedium = (): ReactElement => {
    const { boardGrid, wordsToFind } = FillBoardGridMedium();

    return (
        <div>
            <h1 className="gameHeading">Word Search</h1>
            <LevelIndicator level="MEDIUM" />
            <DisplayBoardMedium boardGrid={boardGrid} wordsToFind={wordsToFindMedium}/>
        </div>
    )
} 

export default WordSearchBoardMedium;
export { wordsToFindMedium };
