import {useGameStore} from "../utils/store.ts";

function Minecounter() {
    const flagCount = useGameStore(state=> state.flagCount)
    const mines = useGameStore(state=> state.mineCount)
    return (
        <div>
            {mines  - flagCount}
        </div>
    );
}

export default Minecounter;