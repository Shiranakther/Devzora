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
const App = () => {
  return (
    <Router>
      
        
        <Routes>  
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-type" element={<UserTypeSelection />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/course" element={<CourseList />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/edit-course/:id" element={<EditCourse />} />
          <Route path="/course-details/:id" element={<CourseDetailView />} />
        </Routes>
      
    </Router>
  );
};



export default App;
