
import React from "react";
import PuzzleContainer from "./puzzleContainer";
import { useParams } from 'react-router-dom';
import WordSearchBoard from './fillBoardGridHard';
import WordSearchBoardMedium from './fillBoardGridMedium';
import { ReactElement, useEffect } from "react";
import { wordsToFindEasy, FillBoardGridEasy } from "./fillBoardGridEasy";
import { wordsToFindMedium, FillBoardGridMedium } from "./fillBoardGridMedium";
import { wordsToFindHard, FillBoardGridHard } from './fillBoardGridHard';

function RenderPuzzle() {
  
    const { difficulty } = useParams();
    {console.log(difficulty)}

    let storedGrid;
    let board; 
    let boardtype;
    let wordsToFind1;
    let wordsFound;
    let timeElapsed; 

    // useEffect(() => {
    //     sessionStorage.setItem('grid', JSON.stringify(board));
        
    // }, [board]);

    
    if (difficulty === 'easy') {
        storedGrid = sessionStorage.getItem('grid');
        // board = storedGrid!=undefined ? JSON.parse(storedGrid) : FillBoardGridHard(); 
        board = FillBoardGridEasy(); 
        boardtype = <WordSearchBoard newBoard={board}/>
        wordsToFind1 = wordsToFindEasy;
        wordsFound = []; // replace with the wordsFound from the corresponding difficulty level
        timeElapsed = 30; 
    }
    else if (difficulty === 'medium') {
        storedGrid = sessionStorage.getItem('grid');
        // board = storedGrid!=undefined ? JSON.parse(storedGrid) : FillBoardGridHard(); 
        board = FillBoardGridMedium(); 
        boardtype = <WordSearchBoardMedium/>
        wordsToFind1 = wordsToFindMedium;
        wordsFound = []; // replace with the wordsFound from the corresponding difficulty level
        timeElapsed = 30; 
    }
    else if (difficulty === 'hard') {
        storedGrid = sessionStorage.getItem('grid');
        // board = storedGrid!=undefined ? JSON.parse(storedGrid) : FillBoardGridHard(); 
        board = FillBoardGridHard(); 
        boardtype = <WordSearchBoard newBoard={board}/>
        wordsToFind1 = wordsToFindHard;
        wordsFound = []; // replace with the wordsFound from the corresponding difficulty level
        timeElapsed = 30; 
    }

    

    
    return (
        <div>
            <PuzzleContainer boardtype={boardtype} wordsToFind1={wordsToFind1} 
            wordsFound={wordsFound} timeElapsed={timeElapsed} board={board} />
        </div>
    )
    }

export default RenderPuzzle;
