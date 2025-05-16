

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType || 'USER'; // default to USER if undefined

  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    roles: [userType],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, name, email, password, phone } = form;
    if (!username || !name || !email || !password || !phone) {
      return 'All fields are required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Enter a valid email address.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return 'Enter a valid phone number.';
    }
    return '';
  };

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   const validationError = validateForm();
  //   if (validationError) {
  //     setError(validationError);
  //     return;
  //   }

  //   setError('');
  //   setLoading(true);
  //   try {
  //     const response = await fetch('http://localhost:8080/user/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(form),
  //     });

  //     if (response.ok) {
  //       navigate('/login');
  //     } else {
  //       const message = await response.text();
  //       if (message.includes("User already exists")) {
  //         setError("User already exists. Try logging in.");
  //       } else if (message.includes('Username already exists')) {
  //     setError('That username is already taken!');
  //   } else if (message.includes('Email already exists')) {
  //     setError('That email is already registered!');
  //   } else {
  //     setError('Something went wrong. Please try again.');
  //   }}} catch (err) {
  //     console.error('Registration error:', err);
  //     setError('Something went wrong. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRegister = async (e) => {
  e.preventDefault();

  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    return;
  }

  setError('');
  setLoading(true);

  try {
    const response = await fetch('http://localhost:8080/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      navigate('/login');
    } else {
      const data = await response.json();
      setError(data.error || 'Something went wrong.');
    }
  } catch (err) {
    console.error("Register failed:", err);
    setError("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleOAuthRegister = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Create Your Account</h1>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.registerButton} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <button type="button" onClick={() => navigate('/login')} style={styles.loginButton}>
          Login
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={handleOAuthRegister} style={styles.oauthButton}>
        Sign Up with Google
      </button>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    outline: 'none',
  },
  registerButton: {
    padding: '12px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  loginButton: {
    padding: '12px',
    fontSize: '1rem',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  oauthButton: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '1rem',
    backgroundColor: '#db4437',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    color: '#e63946',
    marginTop: '10px',
    fontWeight: 'bold',
  },
};

export default Register;
