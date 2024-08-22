import React from "react";
import PuzzleContainer from "./mathPuzzleContainer";
import { useParams } from 'react-router-dom';
import { MathPuzzleBoard, FillMathBoardGrid } from "./fillMathBoardGrid";
import { solutionsEasy, solutionsMedium, solutionsHard } from "./puzzleSolutions";


function RenderMathPuzzle() {
    const { difficulty, levelId } = useParams();
    console.log(`Difficulty: ${difficulty}, Level ID: ${levelId}`);

    let storedGrid: string | null;
    let gridHeight: number;
    let puzzleSolutions: { level1: string[]; level2: string[]; level3: string[]; } | undefined;
    let levelSolutions: string[] | undefined;
    let levelIndicator: string;
    let isHardLevel: boolean = false;
    let isMediumLevel: boolean = false;

    storedGrid = sessionStorage.getItem('grid');

    // Assign the puzzle solutions based on difficulty
    if (difficulty === 'easy') {
        gridHeight = 3;
        levelIndicator = "EASY";
        puzzleSolutions = solutionsEasy;
    } else if (difficulty === 'medium') {
        gridHeight = 5;
        levelIndicator = "MEDIUM";
        puzzleSolutions = solutionsMedium;
        isMediumLevel = true;
    } else if (difficulty === 'hard') {
        gridHeight = 7;
        levelIndicator = "HARD";
        puzzleSolutions = solutionsHard;
        isHardLevel = true;
    } else {
        console.error(`Unknown difficulty level: ${difficulty}`);
        return <div>Error: Unknown difficulty level.</div>;
    }

    console.log(`Puzzle Solutions: `, puzzleSolutions);

    // Verify that puzzleSolutions is properly initialized
    if (!puzzleSolutions) {
        console.error("Puzzle solutions are not defined.");
        return <div>Error: Puzzle solutions are not defined.</div>;
    }

    // Assign levelSolutions based on levelId
    switch (levelId) {
        case "level1":
            levelSolutions = puzzleSolutions.level1;
            break;
        case "level2":
            levelSolutions = puzzleSolutions.level2;
            break;
        case "level3":
            levelSolutions = puzzleSolutions.level3;
            break;
        default:
            console.error(`Invalid level ID: ${levelId}`);
            return <div>Error: Invalid level ID.</div>;
    }

    console.log(`Level Solutions: `, levelSolutions);

    if (!levelSolutions) {
        console.error("Level solutions are undefined.");
        return <div>Error: Level solutions are undefined.</div>;
    }

    const board = FillMathBoardGrid(gridHeight, levelSolutions, isHardLevel,isMediumLevel);
    const boardtype = <MathPuzzleBoard newBoard={board} levelIndicator={levelIndicator!}/>

    const solvedPuzzles = []; // replace with the solvedPuzzles from the corresponding difficulty level
    const timeElapsed = 30;

    return (
        <div>
            <PuzzleContainer boardtype={boardtype} puzzleSolutions={levelSolutions!} 
            solvedPuzzles={solvedPuzzles} timeElapsed={timeElapsed} board={board} />
        </div>
    )
}

export default RenderMathPuzzle;