import {memo} from "react";
import {useGameStore} from "../utils/store.ts";

type CellProps = {
    index: number;
    handleLeftClick: (index: number,chordMode?:boolean) => void;
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

    // CAS SPÉCIAL : Erreur de drapeau à la défaite (Case marquée mais sans mine)
    const isFlagError = isLost && !isMine && isFlagged;

    // CAS SPÉCIAL : Mine à révéler à la défaite (Case non révélée, avec mine, non marquée)
    const shouldShowHiddenMine = isLost && isMine && !isRevealed && !isFlagged;

    // État visuel "enfoncé"
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
            className={`
                w-10 h-10 flex items-center justify-center select-none font-black text-2xl
                relative -mr-[1px] -mb-[1px] box-border
                ${isRevealed || shouldShowAsPressed
                ? "bg-[#c0c0c0] border border-[#808080]"
                : "bg-[#c0c0c0] border-t-[3px] border-l-[3px] border-white border-r-[3px] border-b-[3px] border-r-[#808080] border-b-[#808080]"}
                ${isRevealed && isMine ? "bg-red-600!" : ""}
            `}
        >
            {/* 1. Affichage du chiffre : UNIQUEMENT si la case est réellement révélée et n'est pas une mine */}
            {isRevealed && !isMine && cell.adjacentMineCount > 0 && (
                <span className={getNumberColor(cell.adjacentMineCount)}>
                    {cell.adjacentMineCount}
                </span>
            )}

            {/* 2. Affichage des éléments sur case NON révélée */}
            {!isRevealed && (
                <>
                    {/* Drapeau (caché si c'est une erreur à la défaite) */}
                    {isFlagged && !isFlagError && "🚩"}

                    {/* Point d'interrogation */}
                    {isQuestion && "❓"}

                    {/* Mines cachées révélées à la défaite */}
                    {shouldShowHiddenMine && "💣"}

                    {/* Erreur de drapeau à la défaite */}
                    {isFlagError && (
                        <div className="relative flex items-center justify-center w-full h-full">
                            <span className="opacity-40">💣</span>
                            <span className="absolute text-red-600 text-4xl font-light">✕</span>
                        </div>
                    )}
                </>
            )}

            {/* 3. Mine sur la case qui a causé la perte (Déjà révélée par la logique) */}
            {isRevealed && isMine && "💣"}
        </div>
    );
});

export default Cell;