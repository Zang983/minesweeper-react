export type Store = {
    height: number,
    width: number,
    mineCount: number,
    caseRevealed: number,
    status: GameStatus,
    flagCount: number,
    grid: cell[] | null,
    lastIndexClicked: null | number,
    suggestedCells: number[],
    leftClickOn:boolean,
    timer:number,
    setGridOptions: (options: gridOptions) => void,
    setNewGrid: (index: number) => void,
    setCellFlag: (index: number) => void,
    revealCell: (index: number) => void,
    setStatus: (status: GameStatus) => void,
    checkWin: () => void,
    resetGrid: () => void,
    suggestCells: (index: number) => void
    clearSuggestedCells: () => void,
    setOnLeftClickOn: (value:boolean) => void
}

export type gridOptions = {
    height: number,
    width: number,
    mineCount: number
}

export type cell = {
    isRevealed: boolean,
    isMine: boolean,
    isFlagged: number,
    adjacentMineCount: number,
    isSuggested:boolean
}

export type GameStatus = "playing" | "won" | "lost" | "idle"
