import {useGameStore} from "../utils/store.ts";
import {useState} from "react";

function GameOptions() {

    const status = useGameStore((state) => state.status);
    const height = useGameStore((state) => state.height);
    const width = useGameStore((state) => state.width);
    const mines = useGameStore((state) => state.mineCount);
    const setGridOptions = useGameStore((state) => state.setGridOptions);

    const [gameOptions, setGameOptions] = useState({
        height: height,
        width: width,
        mineCount: mines
    })
    const handleSubmit = () => {
        setGridOptions(gameOptions);
    };

    return (
        <div className="flex flex-col">
            Game Options
            <form action={handleSubmit}>
                <label>Height</label>
                <input type="number"
                       defaultValue={height}
                       onChange={(e) => setGameOptions({...gameOptions, height: parseInt(e.target.value)})}/>
                <label>Width</label>
                <input type="number"
                       defaultValue={width}
                       onChange={(e) => setGameOptions({...gameOptions, width: parseInt(e.target.value)})}/>
                <label>Mines</label>
                <input type="number"
                       defaultValue={mines}
                       onChange={(e) => setGameOptions({...gameOptions, mineCount: parseInt(e.target.value)})}/>
                <button
                    type="submit">
                    {status === "idle" ? "Start" : "Restart"}
                </button>
            </form>

        </div>
    );
}

export default GameOptions;
