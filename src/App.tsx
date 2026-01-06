import './App.css'
import GameOptions from "./GameOptions.tsx";
import Grid from "./Grid.tsx";

function App() {

    return (
        <main className="min-h-screen bg-[#008080] overflow-auto">
            <div className="flex min-h-screen min-w-full p-2 md:p-4">
                <div className="m-auto bg-[#c0c0c0] p-2 md:p-3 border-t-[3px] border-l-[3px] border-white border-r-[3px] border-b-[3px] border-r-[#808080] border-b-[#808080] select-none w-fit h-fit">
                    <GameOptions/>
                    <div className="mt-2 md:mt-3">
                        <Grid/>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default App
