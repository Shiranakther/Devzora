// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update to use Routes
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Callback from './component/Callback ';
import UserTypeSelection from './pages/UserTypeSelection';

const App = () => {
  return (
    <Router>
      <div style={styles.container}>
        <h1 style={styles.appHeader}>My React App</h1>
        <Routes>  {/* Use Routes instead of Switch */}
          <Route path="/" element={<Home />} /> {/* Use element prop */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-type" element={<UserTypeSelection />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  appHeader: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '20px',
  }
};

export default App;
