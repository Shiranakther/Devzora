import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div style={styles.container}>
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
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  header: {
    fontSize: '2rem',
    color: '#333',
  },
  userInfo: {
    marginTop: '20px',
  },
  welcomeText: {
    fontSize: '1.2rem',
    margin: '10px 0',
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  }
};

export default Home;
