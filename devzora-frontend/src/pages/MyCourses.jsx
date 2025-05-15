import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/course/CourseList.css';
import Header from '../component/Header';
import Footer from '../component/Footer';
import Dashboard from '../component/Dashboard';

export default function MyCourses() {
  const [purchasedCourseDetails, setPurchasedCourseDetails] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        // Step 1: Get the user profile (to get purchased course IDs)
        const userRes = await axios.get("http://localhost:8080/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const courseIds = userRes.data.purchasedCourses || [];

        // Step 2: Fetch full course details for each ID in parallel
        const courseDetailPromises = courseIds.map((id) =>
          axios.get(`http://localhost:8080/api/course/course-details/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        const courseResponses = await Promise.all(courseDetailPromises);

        // Step 3: Extract actual course data
        const fullCourseData = courseResponses.map(res => res.data);
        setPurchasedCourseDetails(fullCourseData);

      } catch (err) {
        console.error(err);
        setError("Failed to load purchased courses.");
      }
    };

    fetchUserCourses();
  }, []);

  const handleGoToCourse = (id) => {
    navigate(`/course-details/${id}`);
  };

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
        <div className="course-list-container-title">Purchased Courses</div>
       

        {error && <p>{error}</p>}

        {purchasedCourseDetails.length > 0 ? (
          <div className="course-cards-container">
            {purchasedCourseDetails.map((course) => (
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
                  
                  <div className="course-actions">
                    <button className="course-enroll-button" onClick={() => handleGoToCourse(course.id)}>Go to Course</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No purchased courses yet.</p>
        )}
      </div>
      </Dashboard>
      
    </>
  );
}
