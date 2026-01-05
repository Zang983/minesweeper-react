import {useGameStore} from "../utils/store.ts";
import Cell from "./Cell.tsx";

function Grid() {
    const height = useGameStore((state) => state.height);
    const width = useGameStore((state) => state.width);
    const status = useGameStore((state) => state.status);
    const grid = useGameStore((state) => state.grid) ?? new Array(height * width).fill({})

    const handleLeftClick = (index: number) => {
        useGameStore.getState().setOnLeftClickOn(true)
        if (status === "idle") {
            useGameStore.getState().setNewGrid(index);
            useGameStore.getState().setStatus("playing")
            useGameStore.getState().revealCell(index)
        }
        if (status === "playing") {
            if (grid[index].isFlagged > 0)
                return
            if (grid[index].isRevealed)
                useGameStore.getState().suggestCells(index);
            useGameStore.getState().revealCell(index)
            useGameStore.getState().checkWin()
        }
    }

    return (
        <section
            className="flex flex-wrap"
            style={{width: `${width * 40}px`}}
            onMouseUp={() => {
                useGameStore.getState().clearSuggestedCells()
                useGameStore.getState().setOnLeftClickOn(false)
            }}
            onMouseLeave={() => {
                useGameStore.getState().clearSuggestedCells()
                useGameStore.getState().setOnLeftClickOn(false)
            }}
        >
            {
                grid.map((_, index) =>
                    <Cell key={index} index={index} handleLeftClick={handleLeftClick}/>
                )
            }
        </section>
    );
}

export default Grid;