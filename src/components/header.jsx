import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './header.css';

function Header() {
    const navigate = useNavigate()
    function handleLogout() {
        localStorage.removeItem("userId")
        localStorage.removeItem("token")
        navigate("/")
    }

  return (
    <header>
        <div className="header-logo">
          <div className="logo-icon">
            <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="paint0_linear_9_106" x1="5.50003" y1="5.65625" x2="5.50003" y2="20.6562" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F4320B"/>
                  <stop offset="1" stop-color="#5465F7"/>
                </linearGradient>
                <linearGradient id="paint1_linear_9_106" x1="8.50003" y1="28" x2="8.50003" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F99885"/>
                  <stop offset="1" stop-color="#DF392B"/>
                </linearGradient>
                <linearGradient id="paint2_linear_9_106" x1="17.5" y1="11.3281" x2="17.5" y2="17.3281" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F4320B"/>
                  <stop offset="1" stop-color="#5465F7"/>
                </linearGradient>
                <linearGradient id="paint3_linear_9_106" x1="20.5" y1="28" x2="20.5" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F99885"/>
                  <stop offset="1" stop-color="#DF392B"/>
                </linearGradient>
                <linearGradient id="paint4_linear_9_106" x1="13.5" y1="11" x2="13.5" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F4320B"/>
                  <stop offset="1" stop-color="#5465F7"/>
                </linearGradient>
                <linearGradient id="paint5_linear_9_106" x1="16.5" y1="23" x2="16.5" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F99885"/>
                  <stop offset="1" stop-color="#DF392B"/>
                </linearGradient>
                <linearGradient id="paint6_linear_9_106" x1="9.50003" y1="11.3281" x2="9.50003" y2="16.3281" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F4320B"/>
                  <stop offset="1" stop-color="#5465F7"/>
                </linearGradient>
                <linearGradient id="paint7_linear_9_106" x1="12.5" y1="26" x2="12.5" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F99885"/>
                  <stop offset="1" stop-color="#DF392B"/>
                </linearGradient>
                <linearGradient id="paint8_linear_9_106" x1="1.5" y1="11" x2="1.5" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F4320B"/>
                  <stop offset="1" stop-color="#5465F7"/>
                </linearGradient>
                <linearGradient id="paint9_linear_9_106" x1="4.5" y1="25.3281" x2="4.5" y2="14.3281" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F99885"/>
                  <stop offset="1" stop-color="#DF392B"/>
                </linearGradient>
              </defs>

              {/* Barres supérieures animées */}
              <g>
                <rect x="4.00003" y="5.65625" width="3" height="15" rx="1.5" fill="url(#paint0_linear_9_106)">
                  <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.2; 1 1" dur="1s" repeatCount="indefinite" begin="0s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                  <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0; 0 12; 0 0" dur="1s" repeatCount="indefinite" begin="0s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                </rect>
                <rect x="16" y="11.3281" width="3" height="6" rx="1.5" fill="url(#paint2_linear_9_106)">
                  <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.8; 1 1" dur="1s" repeatCount="indefinite" begin="0.2s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                  <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0; 0 1.2; 0 0" dur="1s" repeatCount="indefinite" begin="0.2s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                </rect>
                <rect x="12" y="11" width="3" height="9" rx="1.5" fill="url(#paint4_linear_9_106)">
                  <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.6; 1 1" dur="1s" repeatCount="indefinite" begin="0.4s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                  <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0; 0 3.6; 0 0" dur="1s" repeatCount="indefinite" begin="0.4s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                </rect>
                <rect x="8.00003" y="11.3281" width="3" height="5" rx="1.5" fill="url(#paint6_linear_9_106)">
                  <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.4; 1 1" dur="1s" repeatCount="indefinite" begin="0.6s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                  <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0; 0 6; 0 0" dur="1s" repeatCount="indefinite" begin="0.6s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                </rect>
                <rect x="0" y="11" width="3" height="8" rx="1.5" fill="url(#paint8_linear_9_106)">
                  <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.9; 1 1" dur="1s" repeatCount="indefinite" begin="0.8s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                  <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0; 0 0.8; 0 0" dur="1s" repeatCount="indefinite" begin="0.8s" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                </rect>
              </g>

              {/* Barres inférieures fixes (miroir) */}
              <g>
                <rect x="7.00003" y="14" width="3" height="14" rx="1.5" transform="rotate(180 7.00003 14)" fill="url(#paint1_linear_9_106)"/>
                <rect x="19" y="14" width="3" height="14" rx="1.5" transform="rotate(180 19 14)" fill="url(#paint3_linear_9_106)"/>
                <rect x="15" y="14" width="3" height="9" rx="1.5" transform="rotate(180 15 14)" fill="url(#paint5_linear_9_106)"/>
                <rect x="11" y="14" width="3" height="12" rx="1.5" transform="rotate(180 11 14)" fill="url(#paint7_linear_9_106)"/>
                <rect x="3" y="14.3281" width="3" height="11" rx="1.5" transform="rotate(180 3 14.3281)" fill="url(#paint9_linear_9_106)"/>
              </g>
            </svg>
          </div>
          <span className="logo-text">SPORTSEE</span>
        </div>

        <nav className="header-nav">
            <ul>
                <li>
                    <Link to={"/profile"} className="nav-link">Profile</Link>
                </li>
                <li>
                    <Link to={"/dashboard"} className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-divider" aria-hidden="true"></li>
                <li>      
                    <button onClick={handleLogout} className="nav-logout-btn">Se déconnecter</button>
                </li>
            </ul>
        </nav>
    </header>
  )
}

export default Header