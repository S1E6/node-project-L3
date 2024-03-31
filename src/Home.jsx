import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import './App.css'

function Home() {

  return (
    <>
      <div style={{margin:"auto"}}>
        <a href="https://vitejs.dev" target="_blank">
          {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
        </a>
        <Link to="/login">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </Link>
      </div>
 </>
  )
}

export default Home
