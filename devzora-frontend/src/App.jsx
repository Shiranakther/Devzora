// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update to use Routes
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Callback from './component/Callback ';
import UserTypeSelection from './pages/UserTypeSelection';
import CourseList from './pages/CourseList';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import CourseDetailView from './pages/CourseDetailView';
import PrivateRoute from '../src/utills/PrivateRoute'; 
import Notfound from './component/Notfound';
import Header from './component/Header'; // Import Header component
import Footer from './component/Footer'; // Import Footer component
const App = () => {
  return (
    <>
    
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/callback" element={<Callback />} />
       

        {/* Protected Routes */}
        <Route
          path="/user-type"
          element={<PrivateRoute element={<UserTypeSelection />} />}
        />
        <Route
          path="/course"
          element={<PrivateRoute element={<CourseList />} />}
        />
        <Route
          path="/create-course"
          element={<PrivateRoute element={<CreateCourse />} />}
        />
        <Route
          path="/edit-course/:id"
          element={<PrivateRoute element={<EditCourse />} />}
        />
        <Route
          path="/course-details/:id"
          element={<PrivateRoute element={<CourseDetailView />} />}
        />
        <Route path="*" element={<Notfound />} />
      </Routes>
       <Footer />
    </Router>
    </>

  );
};



export default App;
