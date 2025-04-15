import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelection = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleSelectType = (type) => {
    setUserType(type);
    navigate('/register', { state: { userType: type } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Select User Type</h1>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => handleSelectType('INSTRUCTOR')}
          style={styles.button}
        >
          INSTRUCTOR
        </button>
        <button
          onClick={() => handleSelectType('USER')}
          style={styles.button}
        >
          LEARNER
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '40px 30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    color: '#343a40',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    padding: '12px',
    fontSize: '1rem',
    backgroundColor: '#00aaff', // Light Blue
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s',
  },
  buttonHover: {
    backgroundColor: '#0077cc', // Darker blue for hover effect
    transform: 'scale(1.05)',
  },
};

export default UserTypeSelection;
