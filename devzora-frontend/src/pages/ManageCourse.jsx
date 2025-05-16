
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/course/CourseList.css';
import axios from 'axios';
import Dashboard from '../component/Dashboard';

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEnroll = (id) => {
    navigate(`/course-details/${id}`);
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
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

    useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setFormData(response.data); // initialize edit state
      } catch (err) {
        console.error(err);
        setError("Could not fetch user profile.");
      }
    };

    fetchUserProfile();
  }, []);

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

  // 🔍 Filter courses based on search
  const filteredCourses = courses
  .filter(course => course.userId === user?.id)
  .filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );



   const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hrs && mins) return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
    if (hrs) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
    return `${mins} min${mins > 1 ? 's' : ''}`;
  };


  return (
    <>
    <Dashboard>
    <div className="course-list-container">
      
        <div className='course-list-container-title'>All Courses</div>
        {/* <Link to="/create-course" className="create-course-link">Create New Course</Link> */}
    

      
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search courses by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="course-cards-container">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <img src={course.thumbnailUrl} alt={course.title} className="course-image" />
            <div className="course-details">
              <div className='course-card-course-details-title'>{course.title} <div className="course-card-course-details-level">{course.level}</div></div>
              <div className="course-card-course-details-instructor-name">by Abu philip</div>
              
              <div className='course-card-course-details'>{course.shortDescription}</div>
              <div className='course-card-course-details'><strong>Category:</strong> {course.category}</div>
              <div className='course-card-course-details-langdue'>
                <div><strong>Language:</strong> {course.language} </div>
                <div> | </div>
                <div><strong>Duration:</strong>{formatDuration(course.estimatedDurationMinutes)}</div>
                
                
                </div>
              <div className='course-card-course-details-price'> $ {course.isPaid ? `${course.price}` : 'Free'}</div>
              <div className="course-actions">
                <Link to={`/edit-course/${course.id}`} className="edit-link" style={{width:'80px',backgroundColor:'#0080ff'}}>Edit</Link>
                <button onClick={() => handleDelete(course.id)} className="delete-button" style={{width:'80px'}}>Delete</button>
                <button  className="delete-button" style={{width:'80px',backgroundColor:'green'}}
                onClick={
                    () => {
                    navigate(`/teacher/assignments/${course.id}`)}}
                >Add Tutorials</button>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Dashboard>

    </>
  );
};

export default ManageCourse;
