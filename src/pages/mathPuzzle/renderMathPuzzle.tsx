import React, { useState, useEffect } from "react";
import PuzzleContainer from "./mathPuzzleContainer";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase/firebase";
import { MathPuzzleBoard, FillMathBoardGrid } from "./fillMathBoardGrid";
import { solutionsEasy, solutionsMedium, solutionsHard } from "./puzzleSolutions";
import { randomizeSolutions } from "./utils"; // Import the randomizer

function RenderMathPuzzle() {
    const { difficulty, levelId, loadFlag } = useParams();
    const boolLoadFlag = Number(loadFlag) === 1;
    console.log(`Difficulty: ${difficulty}, Level ID: ${levelId}`);
    const [loadBoardGrid, setBoardGrid] = useState<string[][]>([]);

    let storedGrid: string | null;
    let gridHeight: number;
    let puzzleSolutions: string[] | undefined;
    let levelIndicator: string;
    let isHardLevel: boolean = false;
    let isMediumLevel: boolean = false;

    storedGrid = sessionStorage.getItem('grid');

    useEffect(() => {
        const loadGameState = async () => {
          if (boolLoadFlag) {
            const user = auth.currentUser;
            if (user) {
              const userRef = doc(db, "users", user.email);
              try {
                const docSnapshot = await getDoc(userRef);
                if (docSnapshot.exists()) {
                  const data = docSnapshot.data();
                  const puzzleSaveState = data.puzzleSaveState;
                  const mathPuzzleSaveState = puzzleSaveState.mathPuzzleSaveState;
      
                  if (mathPuzzleSaveState) {
                    const boardGrid = JSON.parse(mathPuzzleSaveState.board);
      
                    console.log("Game state loaded successfully", {
                      boardGrid,
                      difficulty: mathPuzzleSaveState.difficulty,
                      levelId: mathPuzzleSaveState.levelId,
                    });
      
                    setBoardGrid(boardGrid);
                  } else {
                    console.log("No saved game state found for math puzzle");
                  }
                } else {
                  console.log("No saved game state found");
                }
              } catch (error) {
                console.error("Error loading game state: ", error);
              }
            } else {
              console.error("No authenticated user found");
            }
          }
        };
        loadGameState();
      }, [boolLoadFlag]);

    if (difficulty === 'easy') {
      gridHeight = 3; // Adjust based on your game settings
      levelIndicator = "EASY";
      puzzleSolutions = randomizeSolutions(solutionsEasy).slice(0, gridHeight);
  } else if (difficulty === 'medium') {
      gridHeight = 5; // Adjust based on your game settings
      levelIndicator = "MEDIUM";
      puzzleSolutions = randomizeSolutions(solutionsMedium).slice(0, gridHeight);
      isMediumLevel = true;
  } else if (difficulty === 'hard') {
      gridHeight = 7; // Adjust based on your game settings
      levelIndicator = "HARD";
      puzzleSolutions = randomizeSolutions(solutionsHard).slice(0, gridHeight);
      isHardLevel = true;
    } else {
        console.error(`Unknown difficulty level: ${difficulty}`);
        return <div>Error: Unknown difficulty level.</div>;
    }

    console.log(`Puzzle Solutions: `, puzzleSolutions);

    // Verify that puzzleSolutions is properly initialized
    if (!puzzleSolutions || puzzleSolutions.length === 0) {
        console.error("Puzzle solutions are not defined.");
        return <div>Error: Puzzle solutions are not defined.</div>;
    }

    let board: String[][] = [];
    if (!boolLoadFlag) {
        board = FillMathBoardGrid(gridHeight, puzzleSolutions, isHardLevel, isMediumLevel);
    } else {
        board = loadBoardGrid;
    }

    const boardtype = <MathPuzzleBoard newBoard={board} levelIndicator={levelIndicator!} />

    const solvedPuzzles = []; // replace with the solvedPuzzles from the corresponding difficulty level
    const timeElapsed = 0;

    return (
        <div>
            <PuzzleContainer boardtype={boardtype} puzzleSolutions={puzzleSolutions}
                solvedPuzzles={solvedPuzzles} timeElapsed={timeElapsed} board={board} />
        </div>
    )
}

export default RenderMathPuzzle;