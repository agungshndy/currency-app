import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Jumbotron from './components/Jumbotron'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Jumbotron />
    <Home />
      <div>
        <h1 className='text-3xl font-bold'>Currency App</h1>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
