import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../component/Header';
import { FaBookOpen, FaRegCommentDots } from "react-icons/fa";
import { MdAssignment, MdPostAdd } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import '../css/course/Homepage.css'; // Assuming you have some CSS for styling
import Footer from '../component/Footer'; // Assuming you have a Footer component
const Home = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // Helper function: Check if token is expired
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

  // Second useEffect: Fetch user role after user is decoded
  useEffect(() => {
    const fetchUserData = async () => {  
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // optional if using cookies
        });

        if (response.data.roles && response.data.roles.length > 0) {
          setRole(response.data.roles[0]);
        }
      } catch (err) {
        console.error("Error fetching user data", err);
        navigate('/login');
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
    <Header />
    <div className="explorer-wrapper">
        <div className="explorer-wrapper-title">
          Learn, Explore, and Grow with Devzora
        </div>
        <div className="explorer-wrapper-subtitle">
          Unlock your coding potential with interactive lessons, real-world projects, and expert guidance for every skill level.
          </div>
        <div className="explorer-wrapper-button">
          <button className="explore-button-course">Explore Now</button>
          <button className="explore-button-navigate">Sign Up Free</button>
        </div>
    </div>

    <div className="important-contents-wrapper">
        <div className="important-contents-wrapper-title">
          Everything you need to succeed
        </div>
        <div className="important-contents-wrapper-subtitle">
          Our platform provides all the tools and resources for effective learning and community engagement.
        </div>
        <div className="important-content-cards">
          <div className="important-content-card">
            <div className="important-content-card-icon">
              <FaBookOpen className="important-content-card-icon-icon" />
            </div>
            <div className="important-content-card-title">
              Course Enrollment
            </div>
            <div className="important-content-card-subtitle">
              Access premium courses with secure payment processing.
            </div>
            <div className="important-content-card-explore">
              Explore <FaArrowRight className="important-content-card-explore-icon-arrow" />
            </div>
          </div>


          <div className="important-content-card">
            <div className="important-content-card-icon">
              <MdPostAdd  className="important-content-card-icon-icon" />
            </div>
            <div className="important-content-card-title">
              Interactive Posts
            </div>
            <div className="important-content-card-subtitle">
              Create, like, and comment on educational content.
            </div>
            <div className="important-content-card-explore">
              Explore <FaArrowRight className="important-content-card-explore-icon-arrow" />
            </div>
          </div>



          <div className="important-content-card">
            <div className="important-content-card-icon">
              <MdAssignment className="important-content-card-icon-icon" />
            </div>
            <div className="important-content-card-title">
              Assignments & Certificates
            </div>
            <div className="important-content-card-subtitle">
              Complete assignments and earn recognized certificates.
            </div>
            <div className="important-content-card-explore">
              Explore <FaArrowRight className="important-content-card-explore-icon-arrow" />
            </div>
          </div>



          <div className="important-content-card">
            <div className="important-content-card-icon">
              <FaRegCommentDots  className="important-content-card-icon-icon" />
            </div>
            <div className="important-content-card-title">
              Community Support
            </div>
            <div className="important-content-card-subtitle">
              Get help through our helpdesk and discussion forums.
            </div>
            <div className="important-content-card-explore">
              Explore <FaArrowRight className="important-content-card-explore-icon-arrow" />
            </div>
          </div>

        </div>
        
      </div>

      <div className="course-navigate-section">
        <div className="course-navigate-section-title">
          Ready to start your learning journey?
        </div>
        <div className="course-navigate-section-subtitle">
          Explore our diverse range of courses tailored to your learning needs.
          </div>
          <button className="course-navigate-section-button">Get Started Now</button>
      </div>

      <Footer />
     

 {/* <div style={styles.container}>
      <h1 style={styles.header}>Welcome to the Home Page</h1>
      {user ? (
        <div style={styles.userInfo}>
          <p style={styles.welcomeText}>Hello, {user.name ? user.name : user.sub}!</p>
          <p style={styles.welcomeText}>Your Role is: {role ? role : "Loading..."}</p>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div> */}

    
    </>
  );
};

// const styles = {
//   container: {
//     textAlign: 'center',
//     padding: '20px',
//   },
//   header: {
//     fontSize: '2rem',
//     color: '#333',
//   },
//   userInfo: {
//     marginTop: '20px',
//   },
//   welcomeText: {
//     fontSize: '1.2rem',
//     margin: '10px 0',
//   },
//   logoutButton: {
//     padding: '10px 20px',
//     fontSize: '1rem',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   }
// }; 

export default Home;
