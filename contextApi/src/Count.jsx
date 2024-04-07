import React, { useContext } from 'react'
import { CounterContext } from './contexts/CounterContext'

const Count = () => {
    const { count, addCount, deleteCount } = useContext(CounterContext)
    return (
        <>
            <div>Count {count}</div>
            <button onClick={addCount}>Increase</button>
            <button onClick={deleteCount}>Decrease</button>
        </>
    )
}

export default Count