import './App.css'
import Home from './components/Home'
import Jumbotron from './components/Jumbotron'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Jumbotron />
    <Home />
    </>
  )
}

export default App
