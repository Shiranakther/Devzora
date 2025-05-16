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

 const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

     const filteredCourses = courses.filter(course => {
    const matchesTitle = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter ? course.level === levelFilter : true;
    const matchesCategory = categoryFilter ? course.category === categoryFilter : true;
    const matchesPrice =
      course.isPaid
        ? (minPrice === '' || course.price >= parseFloat(minPrice)) &&
          (maxPrice === '' || course.price <= parseFloat(maxPrice))
        : true;

    return matchesTitle && matchesLevel && matchesCategory && matchesPrice;
  });

  return (
    <>
      <Dashboard>
      <div className="course-list-container">
        <div className="course-list-container-title">Purchased Courses</div>
         <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search courses by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="course-filter-dropdown"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="course-filter-dropdown"
          >
            <option value="">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            {/* Add more categories as needed */}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="course-price-input"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="course-price-input"
          />
        </div>

       

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
