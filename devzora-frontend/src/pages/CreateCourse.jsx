import React from 'react';
import CourseForm from '../component/CourseForm';

const CreateCourse = () => {
  const handleCreate = async (course) => {
    const token = localStorage.getItem('token');
    
    await fetch('http://localhost:8080/api/course/create-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      body: JSON.stringify(course)
    });
  };

  return <CourseForm onSubmit={handleCreate} />;
};

export default CreateCourse;
