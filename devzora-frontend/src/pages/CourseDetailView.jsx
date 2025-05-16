import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/course/CourseDetailView.css';
import Header from '../component/Header';
import Footer from '../component/Footer';
import axios from 'axios';
import { FaLock } from "react-icons/fa";

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
      const [user, setUser] = useState(null);
      const [formData, setFormData] = useState({});
      const [error, setError] = useState("");

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

    const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hrs && mins) return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
    if (hrs) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
    return `${mins} min${mins > 1 ? 's' : ''}`;
  };


    const [openModules, setOpenModules] = useState({});

    const toggleModule = (idx) => {
      if (!hasPurchasedCourse()) return; 
      setOpenModules((prev) => ({
        ...prev,
        [idx]: !prev[idx],
      }));
    };



  if (!course) return <div>Loading...</div>;

    const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: course.id,
          title: course.title,
          price: course.price
        })
      });

      const sessionUrl = await response.text();  // Your backend returns the Stripe session URL as plain text
      window.location.href = sessionUrl;  // Redirect user to Stripe checkout

    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  const hasPurchasedCourse = () => {
  if (!user || !user.purchasedCourses) return false;
  return user.purchasedCourses.includes(course.id);
};




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
                  {/* <div className='module-block-title' 
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
                    
                    
                  </div> */}

                  <div className='module-block-title' 
                        onClick={() => hasPurchasedCourse() && toggleModule(idx)} 
                        style={{ 
                          cursor: hasPurchasedCourse() ? "pointer" : "not-allowed", 
                          color: hasPurchasedCourse() ? "#007bff" : "gray",
                          position: "relative"
                        }}
                      >
                        <div className="module-number-index">{idx+1}</div>

                        <div className="module-block-lession-intro">
                          <div className="module-block-lession-intro-main-title">
                            {mod.title}
                            {hasPurchasedCourse() ? (
                              openModules[idx] 
                              ? <FaChevronUp style={{ fontSize: '1.2rem', position:'absolute', right:'10px' }}/> 
                              : <FaChevronDown style={{ fontSize: '1.2rem', position:'absolute', right:'10px' }}/>
                            ) : (
                              <span style={{ fontSize: '1rem', color: 'gray', position:'absolute', right:'10px' }}><FaLock style={{ marginLeft: "10px", color: "gray" }} /></span>
                            )}
                          </div>

                          <span style={{ marginLeft: '0px', color: 'gray', fontSize: '0.9em' }}>
                            {mod.lessons.length} {mod.lessons.length === 1 ? "lesson" : "lessons"}
                          </span>
                        </div>
                      </div>



                    <div className="lession-wrapper-container">
                  {hasPurchasedCourse && openModules[idx] && (
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
{!hasPurchasedCourse() && (
        <div className="course-sidebar">
          <div className="price-box">
<h2 className="course-details-view-buy__discounted-price">{course.price}$</h2>
<p className="course-details-view-buy__guarantee">30-Day Money-Back Guarantee</p>
           <div className="course-details-view-buy__includes">
            <h4>This course includes:</h4>
            <ul>
              <li>{formatDuration(course.estimatedDurationMinutes)} hours of on-demand video</li>
              <li>Downloadable resources and code examples</li>
              <li>Interactive coding exercises and quizzes</li>
              <li>Q&A support from instructor</li>
              <li>Certificate of completion</li>
              <li>Share this course</li>
            </ul>
          </div>
            <button className="buy-button" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>)}
      </div>
      <Footer/>
    </>
  );
};

export default CourseDetailView;
