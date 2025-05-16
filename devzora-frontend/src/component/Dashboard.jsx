import React, { useState } from 'react';
import '../css/course/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import {
  MdHome,
  MdPerson,
  MdSettings,
  MdLogout,
  MdHelp,
  MdAssignment,
  MdPostAdd,
  MdLibraryBooks
} from 'react-icons/md';




export default function Dashboard({ children }) {
  const navigate = useNavigate();
  const [showCourses, setShowCourses] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

      const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='dashboard-container'>
      <div className="dashboard-sidebar">
       <div className="header-logo">
        <span className='header-logo-span1'>Dev</span><span className='header-logo-span3'>zora</span>
      </div>

        <button className='dashboard-primary-button'
          onClick={() => {
            navigate('/');
          }}
        >
            <MdHome className="dashboard-icon" />
            Home</button>
        
        <button onClick={() => setShowProfile(prev => !prev)}>
        <MdPerson className="dashboard-icon" />
          Profile 
            <div className="dashboard-dropdown-container">
                {showProfile ? <FaChevronDown/> : <FaChevronRight/>  }  
            </div>
          
        </button>
        {showProfile && (
          <div className="dashboard-dropdown">
            <div className='dashboard-dropdown-option'
             onClick={() => {
                navigate('/profile');
              }}
            > View Profile</div>
            <div className='dashboard-dropdown-option'
             onClick={() => {
                navigate('/edit-profile');
              }}
            > Edit Info</div>
          </div>
        )}

        <button onClick={() => setShowCourses(prev => !prev)}>
          <MdLibraryBooks className="dashboard-icon" />
          Courses 
          <div className="dashboard-dropdown-container">
           {showCourses ? <FaChevronDown/> : <FaChevronRight/>}
          </div>
         
        </button>
        {showCourses && (
          <div className="dashboard-dropdown">
            <div className='dashboard-dropdown-option'
              onClick={() => {
                navigate('/my-courses');
              }}
            >Purchased Cources</div>
            <div className='dashboard-dropdown-option'
            onClick={() => {
                navigate('/create-course');
              }}
            >Create Course</div>
            <div className='dashboard-dropdown-option'
            onClick={() => {
                navigate('/manage-course');
              }}
            >Manage Course</div>
            <div className='dashboard-dropdown-option'>Enrolment Details</div>
          </div>
        )}

        
         <button>
            <MdPostAdd className="dashboard-icon" />
            Posts
        </button>

       <button>
            <MdAssignment className="dashboard-icon" />
            Assignments
        </button>

        <button>
            <MdHelp className="dashboard-icon" />
            Helpdesk
        </button>

        <button>
            <MdSettings className="dashboard-icon" />
            Settings
        </button>
        <button onClick={handleLogout}>
            <MdLogout className="dashboard-icon" />
            Logout</button>
      </div>

      <div className="dashboard-content">
        {children}
        
      </div>
    </div>
  );
}
