import React from "react";
import { ReactElement } from "react";
import DisplayMathBoard from "./displayMathBoard";

let puzzleSolutions: string[];

function FillMathBoardGrid(
  gridHeight: number,
  levelSolutions: string[],
  isHardLevel: boolean,
  isMediumLevel: boolean
): string[][] {
  const grid = new Array(gridHeight)
    .fill(null)
    .map(() => new Array(5).fill(""));

  puzzleSolutions = levelSolutions;

  for (let i = 0; i < gridHeight; i++) {
    let solution = puzzleSolutions[i];
    if (!solution) {
      console.error(`No solution found for grid row ${i}.`);
      continue;
    }
    grid[i] = generatePuzzleRow(solution, isHardLevel, isMediumLevel);
  }

  return grid;
}

function generatePuzzleRow(
  solution: string,
  isHardLevel: boolean,
  isMediumLevel: boolean
): string[] {
  let row: string[] = [];

  if (isMediumLevel) row = [solution[0], "?", "?", "=", solution[4]];
  else if (!isHardLevel && !isMediumLevel) {
    row = [solution[0], "?", solution[2], "=", solution[4]];
  } else {
    row = ["?", "?", "?", "=", solution[4]];
  }

  return row;
}

const MathPuzzleBoard = ({ newBoard, levelIndicator }): ReactElement => {
    return (
        <div>
            <DisplayMathBoard boardGrid={newBoard} puzzleSolutions={puzzleSolutions} levelIndicator={levelIndicator}/>
        </div>
    );
}

export { MathPuzzleBoard, FillMathBoardGrid, puzzleSolutions };
