import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🌌 ExoPlanet Hunter
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/analyze" className="nav-link">
            Analyze
          </Link>
          <Link to="/learn" className="nav-link">
            Learn
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
