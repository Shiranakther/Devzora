


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/course/CourseList.css' // Import the external CSS file
import { useNavigate } from 'react-router-dom';


const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const handleEnroll = (id) => {
    navigate(`/course-details/${id}`);
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token'); // or however you store it
      console.log('Token:', token); // Debugging line
      const res = await fetch('http://localhost:8080/api/course/course-details', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
  
    await fetch(`http://localhost:8080/api/course/delete-course/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    fetchCourses();
  };
  

  useEffect(() => {
    fetchCourses();
    
  }, []);

  return (
    <div className="course-list-container">
      <h2>All Courses</h2>
      <Link to="/create-course" className="create-course-link">Create New Course</Link>
      <div className="course-cards-container">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <img src={'https://www.finoit.com/wp-content/uploads/2022/09/java-coding-best-practices.jpg'} alt={course.title} className="course-image" />
            <div className="course-details">
              <h3>{course.title}</h3>
              <p>{course.shortDescription}</p>
              <p><strong>Category:</strong> {course.category} </p>
              <p><strong>Lang:</strong> {course.language} </p>
              <p> <strong>Price:</strong> {course.isPaid ? `${course.price}` : 'Free'}</p>
              <div className="course-actions">
                <Link to={`/edit-course/${course.id}`} className="edit-link">Edit</Link>
                <button onClick={() => handleDelete(course.id)} className="delete-button">Delete</button>
                <button className="enroll-button" onClick={() => handleEnroll(course.id)}>
                     Enroll
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
