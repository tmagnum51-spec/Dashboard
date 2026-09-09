import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import logo from '../../assets/logo.svg'; 
import './Header.css';

function Header() {
  return (
    <header>SPORTSEE
        <nav>
            <ul>
                <li>
                    <Link to={"/"}>Accueil</Link>
                    
                </li>
                <li>
                    <Link to={"/dashboard"}>Dashboard</Link>
                    
                </li>
                <li>
                    
                    <Link to={"/login"}>Login</Link>
                </li>
            </ul>
        </nav>
    </header>
  )
}

export default Header