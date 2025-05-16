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
import Dashboard from './component/Dashboard';
import UserProfile from './pages/UserProfile';
import Editprofile from './pages/Editprofile';
import PaymentSuccess from './pages/PaymentSuccess';
import MyCourses from './pages/MyCourses';
import ManageCourse from './pages/ManageCourse';

const App = () => {
  return (
    <>
    
    <Router>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/user-type" element={<UserTypeSelection />} />
         <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected Routes */}
        
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
         <Route
          path="/profile"
          element={<PrivateRoute element={<UserProfile />} />}
        />
         <Route
          path="/edit-profile"
          element={<PrivateRoute element={<Editprofile />} />}
        />
        <Route
          path="/my-courses"
          element={<PrivateRoute element={<MyCourses />} />}
        />
        
        <Route
          path="/payment-success"
          element={<PrivateRoute element={<PaymentSuccess/>} />}
        />
        <Route
          path="/manage-course"
          element={<PrivateRoute element={<ManageCourse/>} />}
        />
        <Route path="*" element={<Notfound />} />
      </Routes>
       
    </Router>
    </>

  );
};



export default App;
