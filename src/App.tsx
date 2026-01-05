import './App.css'
import GameOptions from "./GameOptions.tsx";
import Grid from "./Grid.tsx";
import Timer from "./Timer.tsx";
import Minecounter from "./Minecounter.tsx";

function App() {

    return (
        <>
            <Minecounter/>
            <Timer/>
            <GameOptions/>
            <Grid/>
        </>
    )
}

export default App
