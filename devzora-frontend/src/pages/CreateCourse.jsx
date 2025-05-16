import React from 'react';
import CourseForm from '../component/CourseForm';
import Dashboard from '../component/Dashboard';

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

  return (
    <Dashboard>
       <CourseForm onSubmit={handleCreate} btnname='Create Course' formtitle='Create' formsubtitle="Fill in the details to create a new course. You'll be able to update the content later"/>
    </Dashboard>
   
  );
};

export default CreateCourse;
