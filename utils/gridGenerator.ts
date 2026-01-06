import cellNeighbors from "./cellNeighbors";
import type {cellType} from "./types.ts";

function gridGenerator(indexClicked: number, height: number, width: number, mineCount: number) {
    const grid: cellType[] = Array.from({ length: height * width }, () => ({
        isRevealed: false,
        isMine: false,
        isFlagged: 0,
        adjacentMineCount: 0,
        isSuggested: false
    }));

    /* Gestion des erreurs possibles */
    if (height <= 0 || width <= 0 || mineCount <= 0) {
        throw new Error("Grid dimensions and mine count must be positive integers");
    }
    if (mineCount >= height * width) {
        throw new Error("Number of mines cannot exceed total number of cells");
    }
    if (height * width <= 9)
        throw new Error("Cannot create a 9 cells grid or smaller");


    //Création d'un SET de mine :
    const minesSet = new Set<number>();

    const safeZone = cellNeighbors(indexClicked, height, width);
    safeZone.push(indexClicked);
    //Création de la position des mines
    do {
        const randomPosition = Math.floor(Math.random() * (height * width));
        if (minesSet.has(randomPosition) || safeZone.includes(randomPosition)) continue;
        minesSet.add(randomPosition);

    } while (minesSet.size < mineCount);

    for (const minePosition of minesSet) {
        grid[minePosition].isMine =true
        const mineNeighbors = cellNeighbors(minePosition, height, width)
        for (const neighbor of mineNeighbors) {
            grid[neighbor].adjacentMineCount++
        }
    }


    return grid;
}

export default gridGenerator