import {useGameStore} from "../utils/store.ts";

function MineCounter() {
    const flagCount = useGameStore(state => state.flagCount);
    const mines = useGameStore(state => state.mineCount);
    // Formatage 000
    const count = Math.max(0, mines - flagCount).toString().padStart(3, '0');
    return (
        <div className="text-[#ff0000] font-mono text-2xl md:text-3xl leading-none tracking-widest">
            {count}
        </div>
    );
}
export default MineCounter;