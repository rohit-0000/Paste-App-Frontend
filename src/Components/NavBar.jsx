import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './NavBar.css'
import toast from 'react-hot-toast';
import UserImg from '../assets/User_img.png';
import ProfileImg from '../assets/profile.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchUser} from '../Reducer/pasteSlice';

const NavBar = () => {
  const navigate=useNavigate();
  const [userSetting,setUserSetting]=useState(false);
  const userRef = useRef(null);
  const user = useSelector((state) => state.paste.user);
  const dispatch=useDispatch();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/');
    toast.success("Logout 👍");
    
      window.location.reload();
  };

  function handleUserSetting(){
    (userSetting)?setUserSetting(false):setUserSetting(true);
  }

  useEffect(() => {
        dispatch(fetchUser());
}, [dispatch]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserSetting(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleProfileClick(){
    navigate('/profile');
  }
  return (
    <div id='Nav-Container'>
      <div id='Nav'>
        <NavLink className={({isActive})=>isActive? "nav-item-active" : "nav-item"}  to="/home">Home</NavLink>
        <NavLink className={({isActive})=>isActive? "nav-item-active" : "nav-item"} to="/pastes">Pastes</NavLink>


        <div id='user' ref={userRef}>
          <img src={UserImg} id='user-img' onClick={handleUserSetting}></img>

          <div className={userSetting? 'user-option-active':'user-option'}>
            <p id="name">{user.name}</p>

            <button onClick={handleProfileClick} id="profile-btn">
              <img src={ProfileImg}></img>
              <span>Profile</span>
            </button>
            <button id="logout-btn" onClick={handleLogout}> Logout </button>
          </div>

        </div>
      </div>
    </div>
  )
}



export default NavBar ;