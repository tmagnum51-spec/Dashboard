import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import logo from '../../assets/logo.svg'; 
import './Header.css';

function Header() {
    const navigate=useNavigate()
    function handleLogout() {
        localStorage.removeItem("userId")
        localStorage.removeItem("token")
        navigate("/")
    }
  return (
    <header>
        <div className="header-logo"> SPORTSEE</div>
        <nav className="header-nav">
            <ul>
                <li>
                    <Link to={"/profile"} className="nav-link">Profile</Link>
                    
                </li>
                <li>
                    <Link to={"/dashboard"} className="nav-link">Dashboard</Link>
                    
                </li>
                <li>
                    
           
                    <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
                </li>
            </ul>
        </nav>
    </header>
  )
}

export default Header