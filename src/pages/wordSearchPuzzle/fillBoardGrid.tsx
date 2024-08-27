
let wordsToFind: String[];
let allWordsCoordinates: number[][][];

function FillBoardGrid (iBoardSize: number, 
                        directions: Array<Array<number>>,
                        wordList: String[],
                        isHardLevel: boolean): String[][] {

    const boardSize = iBoardSize; 
    const possibleDirections = directions  //possible dirctions where letters can be placed
    var boardGrid: String[][] = new Array(boardSize);  //create 2D array to store the board

    for(let i = 0; i < boardSize; i++){
        boardGrid[i] = new Array(boardSize);

        //fill the board with empty strings
        for(let j = 0; j < boardSize; j++){
            boardGrid[i][j] = "";
        }
    }

    wordsToFind = wordList;
    allWordsCoordinates = [];

    //loop through each solution word and place it on the board
    for(let i = 0; i < wordsToFind.length; i++){
        let word = wordsToFind[i];

        let isWordEntered: boolean = false;
        let curWordPositions: number[][] = [];

        while (!isWordEntered) {
            //get random starting position
            let randomRow = Math.floor(Math.random() * boardSize);
            let randomCol = Math.floor(Math.random() * boardSize);

            //try to enter the word on the board
            [isWordEntered, curWordPositions] = canEnterSolutionWords(randomRow, randomCol, word);

            if (isWordEntered) {
                allWordsCoordinates.push(curWordPositions)  //add letter coordinates of all words
            }
        }
    }

    //fill the rest of the board with random letters 
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){

            //add random letters if the cell is empty
            if(boardGrid[i][j] == ""){
                boardGrid[i][j] = String.fromCharCode(65 + Math.random()*26);
                // boardGrid[i][j] = "-";  //uncomment this line when testing to see exactly where the words are placed
            }
        }
    }

    //returns true if the word is successfully entered onto the board with the randomly chosen positions
    function canEnterSolutionWords(startRow: number, 
                                   startCol: number, 
                                   solutionWord: String): [boolean, number[][]] {
        let curRow = startRow;
        let curCol = startCol;
        let letterPositions = new Array(solutionWord.length);  //store the positions of the letters
        let randomDirectionId;
        let randomDirection;

        //set direction for every word once only for easy and medium levels
        if (!isHardLevel) {
            randomDirectionId = Math.floor(Math.random() * possibleDirections.length);
            randomDirection = possibleDirections[randomDirectionId];
        }

        const wordPositions: number[][] = []

        for (let i = 0; i < solutionWord.length; i++) {
            let letter = solutionWord.charAt(i);  //get each letter
            
            if (isDirectionValid(curRow, curCol)) {
                boardGrid[curRow][curCol] = letter;
                letterPositions[i] = [curRow, curCol];
                wordPositions.push([curRow, curCol])  //add the coordinates of each letter
            } else {
                //reset the cells if the word cannot be entered
                for (let j = 0; j < i; j++) {
                    let row = letterPositions[j][0];
                    let col = letterPositions[j][1];
                    boardGrid[row][col] = "";  //clear the board
                }
                return [false, []];
            }

            //set new direction for every letter for hard level
            if (isHardLevel) {
                randomDirectionId = Math.floor(Math.random() * possibleDirections.length);
                randomDirection = possibleDirections[randomDirectionId];
            }

            curRow += randomDirection[0];
            curCol += randomDirection[1];
        }
        // console.log(solutionWord, " - ", wordPositions)
        return [true, wordPositions];
    }


    //returns true if the chosen direction of the letter to be placed is valid
    function isDirectionValid(row: number, col: number): boolean {
        if (row > 0 && row < boardSize && col > 0 && col < boardSize && boardGrid[row][col] == "") {
            return true;
        }
        return false;
    }

    console.log("Word Positions: ", allWordsCoordinates);

    return boardGrid;
}

export {FillBoardGrid, wordsToFind, allWordsCoordinates };