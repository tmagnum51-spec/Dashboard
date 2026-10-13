import Footer from "../components/Footer"
import Header from "../components/header"
import Profile from "../components/Profile"
import './Profile.css';
import React from 'react'

function ProfilePage() {
  return (
    <div classname="Profile-container">
    <Header />
      <main classname="page-content">
      <Profile />
      </main>
    <Footer />
    </div>
  )
}

export default ProfilePage