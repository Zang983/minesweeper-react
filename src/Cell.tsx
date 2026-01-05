import {memo} from "react";
import {useGameStore} from "../utils/store.ts";

type CellProps = {
    index: number;
    handleLeftClick: (index: number, chordMode?: boolean) => void;
}

const Cell = memo(({index, handleLeftClick}: CellProps) => {
    const gameStatus = useGameStore((state) => state.status)
    const cell = useGameStore((state) => {
        if (state.grid)
            return state.grid[index]
        else
            return null
    });

    const handleContext = () => {
        if (useGameStore.getState().status === "lost" || !cell)
            return
        useGameStore.getState().setCellFlag(index)
    }

    const getNumberColor = (count: number) => {
        const colors: Record<number, string> = {
            1: "text-[#0000ff]",
            2: "text-[#008000]",
            3: "text-[#ff0000]",
            4: "text-[#000080]",
            5: "text-[#800000]",
            6: "text-[#008080]",
            7: "text-[#000000]",
            8: "text-[#808080]",
        };
        return colors[count] || "";
    };

    const isRevealed = cell?.isRevealed;
    const isMine = cell?.isMine;
    const isLost = gameStatus === "lost";
    const isFlagged = cell?.isFlagged === 1;
    const isQuestion = cell?.isFlagged === 2;

    const isFlagError = isLost && !isMine && isFlagged;
    const shouldShowHiddenMine = isLost && isMine && !isRevealed && !isFlagged;
    const shouldShowAsPressed = cell?.isSuggested && !isFlagged && !isQuestion;

    return (
        <div
            onMouseDown={(e) => {
                if (e.button === 0)
                    (handleLeftClick(index))
            }}
            onContextMenu={(e) => {
                e.preventDefault()
                if (e.buttons !== 1)
                    handleContext()
                else {
                    if (!cell?.isFlagged || !cell?.isRevealed)
                        handleLeftClick(index, true)
                }
            }}
            onMouseEnter={() => {
                if (isRevealed)
                    useGameStore.getState().suggestCells(index)
            }}
            onMouseLeave={() => {
                useGameStore.getState().clearSuggestedCells()
            }}

            className={`aspect-square flex flex-1 items-center justify-center select-none font-black text-2xl
                relative -mr-px -mb-px box-border border-[#808080] border
                ${isRevealed || shouldShowAsPressed
                ? "bg-[#c0c0c0]"
                : "bg-[#c0c0c0] shadow-[inset_3px_3px_0px_#fff,inset_-3px_-3px_0px_#808080]"}
                ${isRevealed && isMine ? "bg-red-600!" : ""}
            `}
        >

            {isRevealed && !isMine && cell.adjacentMineCount > 0 && (
                <span className={getNumberColor(cell.adjacentMineCount)}>
                    {cell.adjacentMineCount}
                </span>
            )}


            {!isRevealed && (
                <>
                    {isFlagged && !isFlagError && "🚩"}
                    {isQuestion && "❓"}
                    {shouldShowHiddenMine && "💣"}
                    {isFlagError && (
                        <div className="relative flex items-center justify-center w-full h-full">
                            <span className="opacity-40">💣</span>
                            <span className="absolute text-red-600 text-4xl font-light">✕</span>
                        </div>
                    )}
                </>
            )}


            {isRevealed && isMine && "💣"}
        </div>
    );
});

export default Cell;