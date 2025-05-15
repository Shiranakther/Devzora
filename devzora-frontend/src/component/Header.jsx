import React from 'react'
import '../css/course/userComponet/headerComponent.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';
export default function Header() {
  

     const [activeButton, setActiveButton] = useState('home');
     const [user, setUser] = useState(null);
      const navigate = useNavigate();

       const [isDropdownOpen, setIsDropdownOpen] = useState(false);

        const toggleDropdown = () => {
            setIsDropdownOpen((prev) => !prev);
        };



     const isTokenExpired = (token) => {
         try {
           const payload = JSON.parse(atob(token.split('.')[1]));
           const currentTime = Math.floor(Date.now() / 1000);
           return payload.exp < currentTime;
         } catch (err) {
           return true;
         }
       };
     
       // First useEffect: Handle token parsing and set user
       useEffect(() => {
         const urlParams = new URLSearchParams(window.location.search);
         const tokenFromUrl = urlParams.get('token');
         let tokenToUse = tokenFromUrl || localStorage.getItem('token');
     
         if (tokenFromUrl) {
           // Save to localStorage if it came from URL
           localStorage.setItem('token', tokenFromUrl);
           window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
         }
     
         if (tokenToUse) {
           if (isTokenExpired(tokenToUse)) {
             console.warn("Token expired");
             localStorage.removeItem('token');
             navigate('/login');
           } else {
             try {
               const userData = JSON.parse(atob(tokenToUse.split('.')[1]));
               setUser(userData);
               console.log("User data:", userData);
             } catch (err) {
               console.error("Failed to parse token", err);
               localStorage.removeItem('token');
               navigate('/login');
             }
           }
         } else {
           navigate('/login');
         }
       }, [navigate]);




    const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

    const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='header-container'>
      <div className="header-logo">
        <span className='header-logo-span1'>Dev</span><span className='header-logo-span2'>zora</span>
      </div>
      <div className="header-buttons">

        <button
          className={`header-button ${activeButton === 'home' ? 'highlight' : 'header-button'}`}
          onClick={() => {
            handleButtonClick('home');
            navigate('/');
          }}
          
        >
          Home
        </button>
        <button
          className={`header-button ${activeButton === 'posts' ? 'highlight' : 'header-button'}`}
          onClick={() => handleButtonClick('posts')}
        >
          Posts
        </button>
        <button
          className={`header-button ${activeButton === 'courses' ? 'highlight' : 'header-button'}`}
          onClick={() => {
            handleButtonClick('courses');
            navigate('/course');
          }}
         
        >
          Courses
        </button>
        <button
          className={`header-button ${activeButton === 'assignments' ? 'highlight' : 'header-button'}`}
          onClick={() => handleButtonClick('assignments')}
        >
          Assignments
        </button>
        <button
          className={`header-button ${activeButton === 'certificates' ? 'highlight' : 'header-button'}`}
          onClick={() => handleButtonClick('certificates')}
        >
          Certificates
        </button>
        <button
          className={`header-button ${activeButton === 'forum' ? 'highlight' : 'header-button'}`}
          onClick={() => handleButtonClick('forum')}
        >
          Forum
        </button>
        <button
          className={`header-button ${activeButton === 'helpdesk' ? 'highlight' : 'header-button'}`}
          onClick={() => handleButtonClick('helpdesk')}
        >
          Helpdesk
        </button>
      </div>
      <div className="header-profile" onClick={toggleDropdown}>
        <img src="https://cdn-icons-png.flaticon.com/512/4128/4128244.png" alt="Profile" className='header-profile-img' />
        <div className="header-profile-name">
            {user ? (
                <>{user.name ? user.name : user.sub}</>
            ) : (
                <div>Sign in</div>
            )}
            </div>

            {isDropdownOpen && user && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => console.log("Go to Dashboard")}>
            Profile
          </button>
          <button 
            className="dropdown-item" 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

          <button className="dropdown-item" onClick={handleLogout}>
            Logout <FiLogOut className='dropdown-item-icon' />
          </button>
        </div>
      )}

      </div>
    </div>
  )
}
