import React, { useState, useEffect } from "react";
import PuzzleContainer from "./puzzleContainer";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase/firebase";
import { useParams } from "react-router-dom";
import { FillBoardGrid } from "./fillBoardGrid";
import WordSearchBoard from "./displayBoard";
import {
  wordsToFindEasy,
  wordsToFindMedium,
  wordsToFindHard,
} from "./wordLists";

function RenderPuzzle() {
  const { difficulty, levelId, loadFlag } = useParams();
  const boolLoadFlag = Number(loadFlag) === 1;
  const [loadBoardGrid, setBoardGrid] = useState<string[][]>([]);
  {
    console.log(difficulty);
  }

  let storedGrid: string | null;
  let boardSize: number;
  let wordsToFind: { level1: string[]; level2: string[]; level3: string[] };
  let levelWords: string[];
  let possibleDirections: number[][];
  let levelIndicator: string;
  let isHardLevel: boolean = false;

// Checks if the game state is to be loaded
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
            const wordPuzzleSaveState = puzzleSaveState.wordPuzzleSaveState;

            if (wordPuzzleSaveState) {
              const boardGrid = JSON.parse(wordPuzzleSaveState.board);

              // Now you can use these deserialized values in your application
              console.log("Game state loaded successfully", {
                boardGrid,
                difficulty: wordPuzzleSaveState.difficulty,
                levelId: wordPuzzleSaveState.levelId,
              });

              setBoardGrid(boardGrid);
            } else {
              console.log("No saved game state found for word puzzle");
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

  // useEffect(() => {
  //     sessionStorage.setItem('grid', JSON.stringify(board));
  // }, [board]);

  storedGrid = sessionStorage.getItem("grid");
  // board = storedGrid!=undefined ? JSON.parse(storedGrid) : FillBoardGridHard();

  //set board options based on difficulty
  if (difficulty === "easy") {
    boardSize = 10; //10x10 board
    possibleDirections = [
      [1, 0],
      [0, 1],
    ]; //down, right
    levelIndicator = "EASY";
    wordsToFind = wordsToFindEasy;
  } else if (difficulty === "medium") {
    boardSize = 12; //12x12 board
    possibleDirections = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]; //down, right, up, left
    levelIndicator = "MEDIUM";
    wordsToFind = wordsToFindMedium;
  } else if (difficulty === "hard") {
    boardSize = 15; //15x15 board
    possibleDirections = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]; //down, right, up, left
    levelIndicator = "HARD";
    wordsToFind = wordsToFindHard;
    isHardLevel = true;
  }

  //set options based on level ID
  if (levelId === "level1") {
    levelWords = wordsToFind!.level1;
  } else if (levelId === "level2") {
    levelWords = wordsToFind!.level2;
  } else if (levelId === "level3") {
    levelWords = wordsToFind!.level3;
  }

  let board: String[][] = [];
  if (!boolLoadFlag) {
    board = FillBoardGrid(
      boardSize!,
      possibleDirections!,
      levelWords!,
      isHardLevel
    );
  } else {
    board = loadBoardGrid;
  }

  const boardtype = (
    <WordSearchBoard newBoard={board} levelIndicator={levelIndicator!} />
  );

  const wordsFound = []; // replace with the wordsFound from the corresponding difficulty level
  const timeElapsed = 0;

  return (
    <div>
      <PuzzleContainer
        boardtype={boardtype}
        wordsToFind={levelWords!}
        wordsFound={wordsFound}
        timeElapsed={timeElapsed}
        board={board}
      />
    </div>
  );
}

export default RenderPuzzle;
