import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CourseForm from '../component/CourseForm';
import Dashboard from '../component/Dashboard';

const EditCourse = () => {
  const [course, setCourse] = useState(null);
  const { id } = useParams();  // Get the course ID from URL params

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token'); // or however you store it
      console.log('Token:', token); // Debugging line
      const res = await fetch(`http://localhost:8080/api/course/course-details/${id}`, {  // Add the `id` in the URL here
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      setCourse(data);  // Update the course state with fetched data
    } catch (err) {
      console.error('Error fetching course:', err);
    }
  };

  const handleUpdate = async (updatedCourse) => {
    try {
      const token = localStorage.getItem('token'); // Token should be used for authorization if needed

      // Make sure you're sending the correct ID in the URL when updating
      const res = await fetch(`http://localhost:8080/api/course/update-course/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Add token to headers for authorization
        },
        body: JSON.stringify(updatedCourse)
      });

      if (!res.ok) {
        throw new Error(`Failed to update: ${res.status}`);
      }

      // You can add some logic here to handle successful update if needed
      console.log('Course updated successfully');
    } catch (err) {
      console.error('Error updating course:', err);
    }
  };

  useEffect(() => {
    fetchCourse();  // Fetch course details when component mounts
  }, [id]);  // Only run again if `id` changes

  return course ? <Dashboard> <CourseForm onSubmit={handleUpdate} course={course} btnname='Edit Course' formtitle='Edit'formsubtitle='Edit the details to update Existing Course'/> </Dashboard> : <p>Loading...</p>;
};

export default EditCourse;
