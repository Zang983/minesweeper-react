import cellNeighbors from "./cellNeighbors";
import type {cellType} from "./types.ts";

function gridGenerator(indexClicked: number, height: number, width: number, mineCount: number) {
    const grid: cellType[] = []

    const minesPositions: number[] = []
    /* Gestion des erreurs possibles */
    if (height <= 0 || width <= 0 || mineCount <= 0) {
        throw new Error("Grid dimensions and mine count must be positive integers");
    }

    if (mineCount >= height * width) {
        throw new Error("Number of mines cannot exceed total number of cells");
    }
    if (height * width <= 9)
        throw new Error("Cannot create a 9x9 grid or smaller");


    const safeZone = cellNeighbors(indexClicked, height, width);
    safeZone.push(indexClicked);
    //Création de la position des mines
    do {
        const randomPosition = Math.floor(Math.random() * (height * width));
        if (!safeZone.includes(randomPosition) && !minesPositions.includes(randomPosition)) minesPositions.push(randomPosition);
    } while (minesPositions.length < mineCount);

//on crée la grille
    for (let i = 0; i < height * width; i++) {
        const cell = {
            isRevealed: false,
            isMine: minesPositions.includes(i),
            isFlagged: 0,
            adjacentMineCount: 0,
            isSuggested: false
        }
        for (const neighbor of cellNeighbors(i, height, width)) {
            if (minesPositions.includes(neighbor))
                cell.adjacentMineCount++;
        }
        grid.push(cell);
    }

    return grid;
}

export default gridGenerator