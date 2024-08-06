import React from "react";
import PuzzleContainer from "./puzzleContainer";
import { useParams } from 'react-router-dom';
import { WordSearchBoard, FillBoardGrid } from "./fillBoardGrid";
import { wordsToFindEasy, wordsToFindMedium, wordsToFindHard } from "./wordLists";

function RenderPuzzle() {
  
    const { difficulty, levelId } = useParams();
    {console.log(difficulty)}

    let storedGrid: string | null;
    let boardSize: number;
    let wordsToFind: {level1: string[]; level2: string[]; level3: string[];};
    let levelWords: string[];
    let possibleDirections: number[][];
    let levelIndicator: string;
    let isHardLevel: boolean = false;

    // useEffect(() => {
    //     sessionStorage.setItem('grid', JSON.stringify(board));
    // }, [board]);

    storedGrid = sessionStorage.getItem('grid');
    // board = storedGrid!=undefined ? JSON.parse(storedGrid) : FillBoardGridHard(); 

    //set board options based on difficulty
    if (difficulty === 'easy') {
        boardSize = 10; //10x10 board
        possibleDirections = [[1, 0], [0, 1]]; //down, right
        levelIndicator = "EASY";
        wordsToFind = wordsToFindEasy;
    }
    else if (difficulty === 'medium') {
        boardSize = 12; //12x12 board
        possibleDirections = [[1, 0], [0, 1], [-1, 0], [0, -1]]; //down, right, up, left
        levelIndicator = "MEDIUM";
        wordsToFind = wordsToFindMedium;
    }
    else if (difficulty === 'hard') {
        boardSize = 15; //15x15 board
        possibleDirections = [[1, 0], [0, 1], [-1, 0], [0, -1]]; //down, right, up, left
        levelIndicator = "HARD";
        wordsToFind = wordsToFindHard;
        isHardLevel = true;
    }

    //set options based on level ID
    if (levelId === "level1") {
        levelWords = wordsToFind!.level1;
    }
    else if (levelId === "level2") {
        levelWords = wordsToFind!.level2;
    }
    else if (levelId === "level3") {
        levelWords = wordsToFind!.level3;
    }

    const board = FillBoardGrid(boardSize!, possibleDirections!, levelWords!, isHardLevel); 
    const boardtype = <WordSearchBoard newBoard={board} levelIndicator={levelIndicator!}/>

    const wordsFound = []; // replace with the wordsFound from the corresponding difficulty level
    const timeElapsed = 30; 

    return (
        <div>
            <PuzzleContainer boardtype={boardtype} wordsToFind={levelWords!} 
            wordsFound={wordsFound} timeElapsed={timeElapsed} board={board} />
        </div>
    )
    }

export default RenderPuzzle;
