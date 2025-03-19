import React from 'react'
import { NavLink } from 'react-router-dom'
// import './NavBar.css'

const login_signup =() =>{
    <div id='Nav-Container'>
        <div id='Nav'>
          <NavLink to="/login">Home</NavLink>
          <NavLink to="/signup">Pastes</NavLink>
        </div>
      </div>
  }

  export default login_signup;