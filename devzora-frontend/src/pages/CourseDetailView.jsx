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
  FaCalendarAlt
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

  if (!course) return <div>Loading...</div>;

  return (
    <>
    <Header/>

      <div className="course-details-header">
        <div className="course-details-header-container">
          <div className="course-details-header-tags">
            <button>Java</button>
            <button>Coding</button>
            <button>React</button>
            <button>Beginner</button>
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
              <span>6 weeks</span>
            </div>
            <div className="detail-item level">
              <FaUserGraduate className="icon" />
              <span>Beginner</span>
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
                <li><strong>Duration:</strong> {course.estimatedDurationMinutes} mins</li>
              </ul>
            </div>
          </div>

          <div className="modules-section">
            <h2>Modules</h2>
            {course.modules.map((mod, idx) => (
              <div key={idx} className="module-block">
                <h3>{mod.title}</h3>
                {mod.lessons.map((lesson, lidx) => (
                  <div key={lidx} className="lesson-block">
                    <h4>{lesson.title}</h4>
                    <p>{lesson.content}</p>
                    <p><strong>Type:</strong> {lesson.type}</p>
                    <p><strong>Duration:</strong> {lesson.durationMinutes} mins</p>

                    
                    <div className="lesson-video">
                      <strong>Video:</strong>
                      <video width="100%" height="auto" controls>
                        <source src={lesson.mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="course-sidebar">
          <div className="price-box">
            <h2 className="discounted-price">$79.99 <span className="original-price">$99.99</span></h2>
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
