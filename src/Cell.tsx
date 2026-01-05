import {memo} from "react";
import {useGameStore} from "../utils/store.ts";

type CellProps = {
    index: number;
    handleLeftClick: (index: number) => void;
}

const Cell = memo(({index, handleLeftClick}: CellProps) => {
    const gameStatus = useGameStore((state) => state.status)
    const cell = useGameStore((state) => {
        if (state.grid)
            return state.grid[index]
        else
            return null
    });
    const handleContext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (useGameStore.getState().status === "lost" || !cell)
            return
        useGameStore.getState().setCellFlag(index)
    }

    return (
        <div
            onMouseDown={(e) => {
                if (e.button === 0)
                    (handleLeftClick(index))
            }}
            onContextMenu={handleContext}
            onMouseEnter={() => {
                if (cell?.isRevealed)
                    useGameStore.getState().suggestCells(index)
            }}
            onMouseLeave={() => {
                useGameStore.getState().clearSuggestedCells()
            }}
            className={`border border-black w-10 h-10 flex items-center justify-center select-none ${cell?.isSuggested ? "bg-red-400" : ""}`}
        >
            {}
            {(cell?.isRevealed && !cell?.isMine) ? cell.adjacentMineCount : cell?.isFlagged === 1 ? "🏴" : cell?.isFlagged === 2 ? "?" : ""}
            {cell?.isRevealed && cell?.isMine ? "💣" : ""}
            {gameStatus === "lost" && cell?.isMine && !cell?.isRevealed && !cell?.isFlagged ? "💣" : ""}
            {gameStatus === "lost" && !cell?.isMine && !cell?.isRevealed && !cell?.isFlagged ? cell?.adjacentMineCount : ""}
        </div>
    );
});

export default Cell;
