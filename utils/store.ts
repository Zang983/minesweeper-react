import {create} from 'zustand'
import type {cellType, GameStatus, Store} from "./types";
import gridGenerator from "./gridGenerator.ts";
import cellNeighbors from "./cellNeighbors.ts";
import {gameConfigs} from "./gameConfigs.ts";


const recursiveReveal = (index: number, newGrid: cellType[], height: number, width: number): number => {
    if (!newGrid || newGrid[index].isRevealed || newGrid[index].isFlagged) return 0

    newGrid[index] = {...newGrid[index], isRevealed: true}
    let counter = 1

    if (newGrid[index].adjacentMineCount === 0) {
        const neighbors = cellNeighbors(index, height, width)
        for (const neighborIdx of neighbors) {
            counter += recursiveReveal(neighborIdx, newGrid, height, width)
        }
    }
    return counter
}


export const useGameStore = create<Store>()((set) => ({
    height: gameConfigs.intermediate.height,
    width: gameConfigs.intermediate.width,
    mineCount: gameConfigs.intermediate.mineCount,
    caseRevealed: 0,
    status: "idle",
    flagCount: 0,
    grid: null,
    lastIndexClicked: null,
    suggestedCells: [],
    leftClickOn: false,
    timer: 0,

    initGrid: (options) => {
        set(() => {
            return {
                grid: null,
                status: "idle",
                flagCount: 0,
                caseRevealed: 0,
                timer: 0,
                lastIndexClicked: null,
                suggestedCells: [],
                ...options,
            }
        });
    },
    setNewGrid: (index: number) => set(state => ({grid: gridGenerator(index, state.height, state.width, state.mineCount)})),
    setCellFlag: (index: number) => set(state => {
        if (!state.grid || state.grid[index].isRevealed) return {...state}

        const newFlagged = state.grid[index].isFlagged + 1 > 2 ? 0 : state.grid[index].isFlagged + 1
        const newGrid = [...state.grid]
        newGrid[index] = {...newGrid[index], isFlagged: newFlagged}
        return {
            grid: newGrid,
            flagCount: newFlagged === 1 ? state.flagCount + 1 : newFlagged === 2 ? state.flagCount - 1 : state.flagCount
        }
    }),
    revealCell: (index: number) => set(state => {
        if (!state.grid) return {...state}
        if (state.grid[index].isMine) {
            const newGrid = [...state.grid]
            newGrid[index] = {...newGrid[index], isRevealed: true}
            return {status: "lost", grid: newGrid}
        }
        const newGrid = [...state.grid]
        const counter = recursiveReveal(index, newGrid, state.height, state.width)
        return {grid: newGrid, caseRevealed: state.caseRevealed + counter}
    }),
    chordMode: (index: number) => set((state) => {
        if (!state.grid || state.status === "lost") return {...state}
        const newGrid = [...state.grid]
        const neighbors = cellNeighbors(index, state.height, state.width)
        let counter = 0

        const neighborsFlaggedCount = neighbors.filter(cell => state.grid![cell].isFlagged).length
        if (neighborsFlaggedCount >= state.grid![index].adjacentMineCount) {
            if (neighbors.filter(cell => (state.grid![cell].isMine && !state.grid![cell].isFlagged)).length > 0) {
                return {...state, status: "lost", grid: newGrid}
            }
            for (const neighborUnrevealed of neighbors.filter(cell => !state.grid![cell].isRevealed)) {
                counter += recursiveReveal(neighborUnrevealed, newGrid, state.height, state.width)
            }
        }
        return {...state, caseRevealed: state.caseRevealed + counter, grid: newGrid}
    }),
    setStatus: (status: GameStatus) => set({status: status}),
    checkWin: () => set(state => {
        const totalCells = state.height * state.width;
        const totalMines = state.mineCount;
        if (state.caseRevealed === totalCells - totalMines) {
            return {status: "won"};
        }
        return {};
    }),
    clearSuggestedCells: () => set(state => {
        if (!state.grid) return {...state}
        const newGrid = [...state.grid]
        for (const previousSuggested of state.suggestedCells) {
            newGrid[previousSuggested] = {...newGrid[previousSuggested], isSuggested: false}
        }

        return {suggestedCells: [], grid: newGrid}
    }),
    suggestCells: (index: number) => set(state => {
        if (!state.grid || state.status === "lost" || !state.leftClickOn) return {...state}
        const neighbors = cellNeighbors(index, state.height, state.width).filter(cell => (!state.grid![cell].isRevealed && !state.grid![cell].isFlagged))
        const newGrid = [...state.grid]
        for (const neighborIdx of neighbors) {
            if (newGrid[neighborIdx].isRevealed) continue;
            newGrid[neighborIdx] = {
                ...newGrid[neighborIdx],
                isSuggested: !newGrid[neighborIdx].isRevealed && true
            }
        }
        return {suggestedCells: neighbors, grid: newGrid}
    }),
    setOnLeftClickOn: (value: boolean) => set({leftClickOn: value})

}));
