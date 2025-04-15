import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const token = urlParams.get('token');
    console.log('Received token:', token);  // Debugging
  
    if (token) {
      localStorage.setItem('token', token);  // Store token in localStorage
      navigate('/');  // Redirect to home page
    } else if (!localStorage.getItem('token')) {
      navigate('/login');  // Redirect to login if no token is in localStorage
    }
  }, [navigate]);
  
  
  
  
  

  return <div>Loading...</div>; // Show a loading message while processing the token
};

export default Callback;
