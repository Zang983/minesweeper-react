import './App.css'
import GameOptions from "./GameOptions.tsx";
import Grid from "./Grid.tsx";

function App() {

    return (
        <main className="w-1/2 flex flex-col">
            <GameOptions/>
            <Grid/>
        </main>
    )
}

export default App
