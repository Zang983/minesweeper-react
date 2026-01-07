export type Store = {
    height: number,
    width: number,
    mineCount: number,
    caseRevealed: number,
    status: GameStatus,
    flagCount: number,
    grid: cellType[] | null,
    lastIndexClicked: null | number,
    suggestedCells: number[],
    leftClickOn:boolean,
    timer:number,
    initGrid: (options?: gridOptions) => void,
    setNewGrid: (index: number) => void,
    setCellFlag: (index: number) => void,
    revealCell: (index: number) => void,
    setStatus: (status: GameStatus) => void,
    checkWin: () => void,
    suggestCells: (index: number) => void
    clearSuggestedCells: () => void,
    setOnLeftClickOn: (value:boolean) => void,
    chordMode:(index:number)=>void
}

export type gridOptions = {
    height: number,
    width: number,
    mineCount: number
}

export type cellType = {
    isRevealed: boolean,
    isMine: boolean,
    isFlagged: number,
    adjacentMineCount: number,
    isSuggested:boolean
}

export type GameStatus = "playing" | "won" | "lost" | "idle"
