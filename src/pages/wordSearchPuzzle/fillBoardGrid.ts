function FillBoardGrid(): String[][] {

    //solution words that exist in the puzzle
    const wordsToFind: String[] = ["HELLO", "WORLD"];  
    const boardSize = 20;  //20x20 board

    //set of all 8 directions in which letters of solution words can be placed on the board
    const possibleDirections = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]

    //create 2D array to store the board
    var boardGrid: String[][] = new Array(boardSize);  

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
            if(boardGrid[i][j] == ""){
                boardGrid[i][j] = String.fromCharCode(65 + Math.random()*26);
            }
        }
    }

    //returns true if the word is successfully entered onto the board with the randomly chosen positions
    function canEnterSolutionWords(startRow: number, startCol: number, solutionWord: String): boolean {
        let curRow = startRow;
        let curCol = startCol;

        let letterPositions = new Array(solutionWord.length);  //store the positions of the letters

        for (let i = 0; i < solutionWord.length; i++) {
            let letter = solutionWord.charAt(i);  //get each letter
            
            if (isDirectionValid(curRow, curCol)) {
                boardGrid[curRow][curCol] = letter;
                letterPositions[i] = [curRow, curCol];
            } else {
                //reset the cells if the word cannot be entered
                for (let j = 0; j < i; j++) {
                    let row = letterPositions[j][0];
                    let col = letterPositions[j][1];
                    boardGrid[row][col] = "";  //clear the board
                }
                return false;
            }

            //get random direction to place the next letter
            let randomDirectionId = Math.floor(Math.random() * possibleDirections.length);
            let randomDirection = possibleDirections[randomDirectionId];
            curRow += randomDirection[0];
            curCol += randomDirection[1];
        }
        return true;
    }


    //returns true if the chosen direction of the letter to be placed is valid
    function isDirectionValid(row: number, col: number): boolean {
        if (row > 0 && row < boardSize && col > 0 && col < boardSize && boardGrid[row][col] == "") {
            return true;
        }
        return false;
    }

    return boardGrid;

}

