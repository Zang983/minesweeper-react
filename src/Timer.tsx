import {useEffect} from "react";
import {useGameStore as gameStore} from "../utils/store.ts";


function Timer() {

    const status = gameStore(state => state.status)

    useEffect(() => {
        const statusWithoutTimer = ['idle', 'won', 'afk', "lost"]
        let timer: number | null = null

        if ((status === 'idle' && timer) || (status === "lost" && timer)) {
            clearInterval(timer)
        }
        if (!statusWithoutTimer.includes(status)) {
            timer = setInterval(() => {
                gameStore.setState(state => ({...state, timer: state.timer + 1}))
            }, 1000)
        }
        return () => {
            if (timer)
                clearInterval(timer)
        }
    }, [status]);
    
    const time = gameStore().timer.toString().padStart(3, '0');
    return (
        <div className="text-[#ff0000] font-mono text-3xl leading-none tracking-widest">
            {time}
        </div>
    );
}

export default Timer;