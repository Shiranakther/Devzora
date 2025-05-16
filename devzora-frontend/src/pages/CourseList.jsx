
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/course/CourseList.css';
import Header from '../component/Header';
import Footer from '../component/Footer';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
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
    <Header />

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
                {/* <Link to={`/edit-course/${course.id}`} className="edit-link">Edit</Link>
                <button onClick={() => handleDelete(course.id)} className="delete-button">Delete</button> */}
                <button className="enroll-button" onClick={() => handleEnroll(course.id)} style={{width:'150px'}}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CourseList;
