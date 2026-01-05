import {useGameStore} from "../utils/store.ts";
import {useState} from "react";
import {gameConfigs} from "../utils/gameConfigs.ts";
import MineCounter from "./MineCounter.tsx";
import Timer from "./Timer.tsx";

function GameOptions() {
    const status = useGameStore((state) => state.status);
    const height = useGameStore((state) => state.height);
    const width = useGameStore((state) => state.width);
    const mines = useGameStore((state) => state.mineCount);
    const setGridOptions = useGameStore((state) => state.setGridOptions);
    const resetGrid = useGameStore((state) => state.resetGrid);

    const [isCustomVisible, setIsCustomVisible] = useState(false);
    const [gameOptions, setGameOptions] = useState({
        height: height,
        width: width,
        mineCount: mines
    });

    const difficulties = [
        { key: "beginner", label: "Débutant" },
        { key: "intermediate", label: "Intermédiaire" },
        { key: "expert", label: "Expert" }
    ];

    const handleDifficultyChange = (level: string) => {
        if (level === "custom") {
            setIsCustomVisible(true);
        } else {
            setIsCustomVisible(false);
            const config = gameConfigs[level as keyof typeof gameConfigs];
            setGridOptions(config);
        }
    };

    const getStatusEmoji = () => {
        switch (status) {
            case "won": return "😎";
            case "lost": return "😵";
            default: return "🙂";
        }
    };

    return (
        <div className="bg-[#c0c0c0] p-2 md:p-3 border-t-[3px] border-l-[3px] border-white border-r-[3px] border-b-[3px] border-r-[#808080] border-b-[#808080] w-full select-none">
            {/* Barre de Status (Compteur - Smiley - Timer) */}
            <div className="flex justify-between items-center bg-[#c0c0c0] border-[3px] border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-2 mb-3 h-16">
                <div className="bg-black px-2 py-1 border-2 border-gray-600 flex items-center justify-center min-w-12.5 md:min-w-17.5">
                    <MineCounter />
                </div>

                <button
                    onClick={resetGrid}
                    className="w-10 h-10 md:w-12 md:h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2  active:border-none text-2xl md:text-3xl flex items-center justify-center hover:bg-[#d0d0d0]"
                >
                    {getStatusEmoji()}
                </button>

                <div className="bg-black px-2 py-1 border-2 border-gray-600 flex items-center justify-center min-w-12.5 md:min-w-17.5">
                    <Timer />
                </div>
            </div>

            {/* Sélecteur de difficulté */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] md:text-xs font-bold mb-2 justify-center italic border-b border-gray-400 pb-2">
                {difficulties.map((diff) => (
                    <label key={diff.key} className="flex items-center gap-1 cursor-pointer hover:text-blue-800 whitespace-nowrap">
                        <input
                            type="radio"
                            name="difficulty"
                            onChange={() => handleDifficultyChange(diff.key)}
                            defaultChecked={diff.key === "intermediate"}
                        />
                        {diff.label}
                    </label>
                ))}
                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                    <input type="radio" name="difficulty" onChange={() => handleDifficultyChange("custom")} />
                    Personnalisé
                </label>
            </div>

            {isCustomVisible && (
                <div className="flex flex-col gap-2 p-2 border-2 border-[#808080] bg-[#bdbdbd] mb-2 text-[10px] md:text-xs font-bold">
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        <div className="flex items-center gap-1">
                            <label>Largeur:</label>
                            <input
                                className="w-10 md:w-12 bg-white border border-gray-600 px-1"
                                type="number"
                                defaultValue={width}
                                onChange={(e) => setGameOptions({...gameOptions, width: parseInt(e.target.value)})}/>
                        </div>
                        <div className="flex items-center gap-1">
                            <label>Hauteur:</label>
                            <input
                                className="w-10 md:w-12 bg-white border border-gray-600 px-1"
                                type="number"
                                defaultValue={height}
                                onChange={(e) => setGameOptions({...gameOptions, height: parseInt(e.target.value)})}/>
                        </div>
                        <div className="flex items-center gap-1">
                            <label>Mines:</label>
                            <input
                                className="w-10 md:w-12 bg-white border border-gray-600 px-1"
                                type="number"
                                defaultValue={mines}
                                onChange={(e) => setGameOptions({...gameOptions, mineCount: parseInt(e.target.value)})}/>
                        </div>
                    </div>
                    <button
                        onClick={() => setGridOptions(gameOptions)}
                        className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2  py-1 active:border-none font-bold uppercase tracking-wider"
                    >
                        Appliquer
                    </button>
                </div>
            )}
        </div>
    );
}

export default GameOptions;