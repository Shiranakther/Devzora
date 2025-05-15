import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/course/CourseDetailView.css';
import Header from '../component/Header';
import Footer from '../component/Footer';

import {
  FaStar,
  FaClock,
  FaUserGraduate,
  FaUsers,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight,
  FaChevronUp
} from "react-icons/fa";


  const CourseDetailView = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
      const fetchCourseDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:8080/api/course/course-details/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          setCourse(data);
        } catch (err) {
          console.error('Error fetching course:', err);
        }
      };

      fetchCourseDetails();
    }, [id]);

    const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hrs && mins) return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
    if (hrs) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
    return `${mins} min${mins > 1 ? 's' : ''}`;
  };


    const [openModules, setOpenModules] = useState({});

      const toggleModule = (idx) => {
        setOpenModules((prev) => ({
          ...prev,
          [idx]: !prev[idx], // toggle that specific module
        }));
      };


  if (!course) return <div>Loading...</div>;



  return (
    <>
    <Header/>

      <div className="course-details-header">
        <div className="course-details-header-container">
          <div className="course-details-header-tags">
            {course.tags?.map((tag, index) => (
              <button key={index}>{tag}</button>
            ))}
          </div>

          <div className="course-details-header-title">{course.title}</div>
          <div className="course-details-header-description">{course.shortDescription}</div>
          <div className="course-details-header-status">
            <div className="detail-item rating">
              <FaStar className="icon" />
              <span>4.8 (3,254 reviews)</span>
            </div>
            <div className="detail-item duration">
              <FaClock className="icon" />
              <span>{formatDuration(course.estimatedDurationMinutes)}</span>

            </div>
            <div className="detail-item level">
              <FaUserGraduate className="icon" />
              <span>{course.level}</span>
            </div>
            <div className="detail-item students">
              <FaUsers className="icon" />
              <span>10,847 students</span>
            </div>
            <div className="detail-item updated">
              <FaCalendarAlt className="icon" />
              <span>Last updated: 2025-03-15</span>
            </div>
          </div>
        </div>
      </div>

      <div className="course-detail-container">
        <div className="course-main">
          <div className="course-intro">
            <img
              src={course.thumbnailUrl}
              alt="Course Thumbnail"
              className="course-thumbnail"
            />
            <div className="about-course">About This Course</div>
            <p className="full-description">{course.fullDescription}</p>

            <div className="meta-info">
              <ul>
                <li><strong>Category:</strong> {course.category}</li>
                <li><strong>Language:</strong> {course.language}</li>
                <li><strong>Level:</strong> {course.level}</li>
                <li><strong>Duration:</strong> {formatDuration(course.estimatedDurationMinutes)} </li>
              </ul>
            </div>
          </div>
          <div className="introduction-video">
            <div className="introduction-video-title">Introduction To Course </div>
            <video width="100%" controls>
              <source src={course.promoVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>


        <div className="modules-section">
              <h2>Modules</h2>
              {course.modules.map((mod, idx) => (
                <div key={idx} className="module-block">
                  <div className='module-block-title' 
                    onClick={() => toggleModule(idx)} 
                    style={{ cursor: "pointer", color: "#007bff" }}
                  >
                    <div className="module-number-index">{idx+1} </div>

                    <div className="module-block-lession-intro">
                      <div className="module-block-lession-intro-main-title">
                      {mod.title} {openModules[idx] ? <FaChevronUp style={{ fontSize: '1.2rem', color: 'rgb(19, 19, 19);',position:'absolute',right:'10px'}}/>: <FaChevronDown style={{ fontSize: '1.2rem', color: 'rgb(19, 19, 19);',position:'absolute',right:'10px'}} />}
                      </div>
                      

                    <span style={{ marginLeft: '0px', color: 'gray', fontSize: '0.9em' }}>
                      {mod.lessons.length} {mod.lessons.length === 1 ? "lesson" : "lessons"}
                    </span>


                    </div>
                    
                    
                  </div>
                    <div className="lession-wrapper-container">
                  {course.isPaid && openModules[idx] && (
                    <div className="lessons-list">
                      {mod.lessons.map((lesson, lidx) => (
                        <div key={lidx} className="lesson-block">
                          <div className="lession-block-lession">
                          <div className='lesson-block-lession-info-title'><span style={{color:'#1d3557',marginRight:'5px',fontSize:'1.2rem'}}>Lession {lidx+1} : </span> {lesson.title} </div>
                          <div className='lesson-block-lession-info'>{lesson.content}</div>
                          <div className='lesson-block-lession-info'><span style={{fontWeight:'400',color:'#1d3557'}}>Type:</span>{lesson.type}</div>
                          <div className='lesson-block-lession-info'> <span style={{fontWeight:'400',color:'#1d3557'}}>Duration:</span> {lesson.durationMinutes} mins</div>
                            </div>
                          <div className="lesson-video">
                            <video width="100%" height="auto" controls>
                              <source src={lesson.mediaUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                          </div>

                        
                      ))}
                    </div>
                  )}
                    </div>
                  
                </div>
              ))}
            </div>
        </div>

        <div className="course-sidebar">
          <div className="price-box">
            <h2 className="discounted-price">{course.price} <span className="original-price">$99.99</span></h2>
            <p className="sale-info">20% off<br />Sale ends in 2 days!</p>
            <p className="guarantee">30-Day Money-Back Guarantee</p>
            <div className="includes">
              <h4>This course includes:</h4>
              <ul>
                <li>6 hours of on-demand video</li>
                <li>Downloadable resources and code examples</li>
                <li>Interactive coding exercises and quizzes</li>
                <li>Q&A support from instructor</li>
                <li>Certificate of completion</li>
                <li>Share this course</li>
              </ul>
            </div>
            <button className="buy-button">Buy Now</button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CourseDetailView;
