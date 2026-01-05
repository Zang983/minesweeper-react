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
    
    return (
        <div>
            {gameStore().timer}
        </div>
    );
}

export default Timer;