import {useGameStore} from "../utils/store.ts";
import Cell from "./Cell.tsx";

function Grid() {
    const height = useGameStore((state) => state.height);
    const width = useGameStore((state) => state.width);
    const status = useGameStore((state) => state.status);
    const grid =  new Array(height * width).fill({})

    const sliceGrid = () => {
        const lines = []
        for (let i = 0; i < height; i++)
            lines.push(grid.slice(i * width, (i + 1) * width))
        return lines
    }

    const handleLeftClick = (index: number, chordMode?: boolean) => {
        useGameStore.getState().setOnLeftClickOn(true)
        if (status === "idle") {
            useGameStore.getState().setNewGrid(index);
            useGameStore.getState().setStatus("playing")
            useGameStore.getState().revealCell(index)
            useGameStore.getState().checkWin()
        }
        if (status === "playing") {
            if (grid[index].isFlagged > 0)
                return
            if (grid[index].isRevealed)
                useGameStore.getState().suggestCells(index);
            useGameStore.getState().revealCell(index)
            useGameStore.getState().checkWin()
            if (chordMode) (
                useGameStore.getState().chordMode(index)
            )
        }
    }

    return (
        <section
            className="flex flex-col w-fit border-t-[3px] border-l-[3px] border-[#808080] border-r-white border-b-white overflow-hidden"
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
                sliceGrid().map((line, lineIndex) =>
                    <div className="flex" key={lineIndex}>
                        {
                            line.map((_, cellIndex) =>
                                <Cell key={cellIndex}
                                      index={cellIndex + lineIndex * width}
                                      handleLeftClick={handleLeftClick}
                                />)
                        }
                    </div>
                )
            }
        </section>
    )
        ;
}

export default Grid;