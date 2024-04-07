import { useState } from 'react'
import './App.css'
import Count from './Count'
import { CounterContextProvider } from './contexts/CounterContext'

function App() {
  const [count, setCount] = useState(0)
  const addCount = () => {
    setCount(p => p + 1)
  }
  const deleteCount = () => {
    setCount(p => p - 1)
  }
  return (
    <CounterContextProvider value={{ count, addCount, deleteCount }}>
      <Count />
    </CounterContextProvider>
  )
}

export default App
