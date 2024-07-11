import React from "react";
import PuzzleContainer from "./puzzleContainer";
import { useParams } from 'react-router-dom';
import { WordSearchBoard, FillBoardGrid } from "./fillBoardGrid";
import { wordsToFindEasy, wordsToFindMedium, wordsToFindHard } from "./wordLists";

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

    storedGrid = sessionStorage.getItem('grid');
    // board = storedGrid!=undefined ? JSON.parse(storedGrid) : FillBoardGridHard(); 

    if (difficulty === 'easy') {
        const boardSize = 10 //10x10 board
        const possibleDirections = [[1, 0], [0, 1]] //down, right
        board = FillBoardGrid(boardSize, possibleDirections, wordsToFindEasy, false); 
        boardtype = <WordSearchBoard newBoard={board} levelIndicator={"EASY"}/>
    }

    else if (difficulty === 'medium') {
        const boardSize = 12 //12x12 board
        const possibleDirections = [[1, 0], [0, 1], [-1, 0], [0, -1]] //down, right, up, left
        board = FillBoardGrid(boardSize, possibleDirections, wordsToFindMedium, false); 
        boardtype = <WordSearchBoard newBoard={board} levelIndicator={"MEDIUM"}/>
    }

    else if (difficulty === 'hard') {
        const boardSize = 15 //15x15 board
        const possibleDirections = [[1, 0], [0, 1], [-1, 0], [0, -1]] //down, right, up, left
        board = FillBoardGrid(boardSize, possibleDirections, wordsToFindHard, true); 
        boardtype = <WordSearchBoard newBoard={board} levelIndicator={"HARD"}/>
    }

    wordsFound = []; // replace with the wordsFound from the corresponding difficulty level
    timeElapsed = 30; 

    return (
        <div>
            <PuzzleContainer boardtype={boardtype} wordsToFind1={wordsToFind1} 
            wordsFound={wordsFound} timeElapsed={timeElapsed} board={board} />
        </div>
    )
    }

export default RenderPuzzle;
