import {create} from 'zustand'
import type {GameStatus, Store} from "./types";
import gridGenerator from "./gridGenerator.ts";
import cellNeighbors from "./cellNeighbors.ts";
import {gameConfigs} from "./gameConfigs.ts";

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

    resetGrid: () => set(() => (({
        grid: null,
        status: "idle",
        flagCount: 0,
        caseRevealed: 0,
        timer: 0,
        lastIndexClicked: null,
        suggestedCells: []
    }))),
    setGridOptions: (options) => {
        set((state) => {
            state.resetGrid()
            return {
                ...options,
            }
        });
    },
    setNewGrid: (index: number) => set(state => ({grid: gridGenerator(index, state.height, state.width, state.mineCount)})),
    setCellFlag: (index: number) => set(state => {
        if (!state.grid || state.grid[index].isRevealed) return {...state}

        const newFlagged = state.grid[index].isFlagged + 1 > 2 ? 0 : state.grid[index].isFlagged + 1
        state.grid[index] = {...state.grid[index], isFlagged: newFlagged}
        return {
            flagCount: newFlagged === 1 ? state.flagCount + 1 : newFlagged === 2 ? state.flagCount - 1 : state.flagCount
        }
    }),
    revealCell: (index: number) => set(state => {
        let counter = 0
        const recursiveReveal = (idx: number) => {
            if (!state.grid || state.grid[idx].isRevealed || state.grid[idx].isFlagged) return
            if (state.grid[idx].isMine) {
                set({status: "lost"})
                state.grid[idx] = {...state.grid[idx], isRevealed: true}
            }
            state.grid[idx] = {...state.grid[idx], isRevealed: true}
            counter++
            if (state.grid[idx].adjacentMineCount === 0) {
                const neighbors = cellNeighbors(idx, state.height, state.width)
                neighbors.forEach(neighborIdx => recursiveReveal(neighborIdx))
            }
        }
        recursiveReveal(index)
        return {caseRevealed: state.caseRevealed + counter}
    }),
    chordMode: (index: number) => set((state) => {
        if (!state.grid || state.status === "lost") return {...state}
        const neighbors = cellNeighbors(index, state.height, state.width)

        const neighborsFlaggedCount = neighbors.filter(cell => state.grid![cell].isFlagged).length
        if (neighborsFlaggedCount >= state.grid![index].adjacentMineCount) {
            if (neighbors.filter(cell => (state.grid![cell].isMine && !state.grid![cell].isFlagged)).length > 0) {
                console.log("y'a une mine non révélée & non flaggé")
                return {...state, status: "lost"}
            }
            for (const neighborUnrevealed of neighbors.filter(cell => !state.grid![cell].isRevealed)) {
                state.revealCell(neighborUnrevealed)
            }
        }
        return {...state}
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
        for (const previousSuggested of state.suggestedCells)
            state.grid[previousSuggested] = {...state.grid[previousSuggested], isSuggested: false}
        return {suggestedCells: []}
    }),
    suggestCells: (index: number) => set(state => {
        if (!state.grid || state.status === "lost" || !state.leftClickOn) return {...state}
        const neighbors = cellNeighbors(index, state.height, state.width).filter(cell => (!state.grid![cell].isRevealed && !state.grid![cell].isFlagged))
        for (const neighborIdx of neighbors) {
            if (state.grid[neighborIdx].isRevealed) continue;
            state.grid[neighborIdx] = {
                ...state.grid[neighborIdx],
                isSuggested: !state.grid[neighborIdx].isRevealed && true
            }
        }
        return {suggestedCells: neighbors}
    }),
    setOnLeftClickOn: (value: boolean) => set({leftClickOn: value})

}));
