import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Home = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a token in the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Get token from URL query parameter
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      

      try {
        // Decode JWT token to get user data
        const userData = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        setUser(userData);
      } catch (err) {
        console.error('Invalid token', err);
        navigate('/login');
      }

      
    } else {
      // Check if token is already in localStorage
      const storedToken = localStorage.getItem('token');

      

      if (storedToken) {
        try {
          const userData = JSON.parse(atob(storedToken.split('.')[1])); // Decode JWT
          setUser(userData);
          console.log('User data:', userData); // Debugging
        } catch (err) {
          console.error('Invalid stored token', err);
          navigate('/login');
        }
      } else {
        navigate('/login'); // Redirect to login if no token found
      }
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/me', {
        headers: { "Authorization": `Bearer ${token}` },
      });

      
      setRole(response.data.roles[0]); // Assuming roles is an array and we want the first role
    } catch (err) {
      console.error('Error fetching user data', err);
      navigate('/login'); // Redirect to login if there’s an error
    }
  };

  fetchUserData();


 

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    navigate('/login'); // Redirect to login page
  };

 


  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to the Home Page</h1>
      {user ? (
        <div style={styles.userInfo}>
          <p style={styles.welcomeText}>Hello, {user.name ? user.name : user.sub}!</p>
          <p style={styles.welcomeText}>Your Role is, {role? role : null}!</p> {/* Display name if available, otherwise use sub */}
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in</p>
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
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  }
};

export default Home;

