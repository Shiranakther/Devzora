

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../css/course/CourseForm.css";

// const CourseForm = ({ onSubmit, course = {} }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     shortDescription: '',
//     fullDescription: '',
//     category: '',
//     tags: [],
//     thumbnailUrl: '',
//     promoVideoUrl: '',
//     level: '',
//     language: '',
//     estimatedDurationMinutes: 0,
//     isPaid: false,
//     price: 0,
//     hasCertificate: false,
//     status: 'draft',
//     instructorId: '', // Optional: fill this dynamically
//     modules: [],
//     ...course
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleModuleChange = (index, field, value) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[index][field] = value;
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const handleLessonChange = (modIndex, lessonIndex, field, value) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[modIndex].lessons[lessonIndex][field] = value;
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const addModule = () => {
//     setFormData({
//       ...formData,
//       modules: [...formData.modules, { title: '', orderIndex: formData.modules.length, lessons: [] }]
//     });
//   };

//   const removeModule = (index) => {
//     const updatedModules = formData.modules.filter((_, i) => i !== index);
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const addLesson = (modIndex) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[modIndex].lessons.push({
//       title: '',
//       content: '',
//       type: '',
//       mediaUrl: '',
//       durationMinutes: 0,
//       orderIndex: updatedModules[modIndex].lessons.length
//     });
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const removeLesson = (modIndex, lessonIndex) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[modIndex].lessons = updatedModules[modIndex].lessons.filter((_, i) => i !== lessonIndex);
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await onSubmit(formData);
//     navigate('/');
//   };

//   return (
//     <form onSubmit={handleSubmit} className="form-container">
//       {/* Basic Fields */}
//       <input name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" className="input-field" />
//       <input name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Short Description" className="input-field" />
//       <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} placeholder="Full Description" className="input-field" />
//       <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="input-field" />
//       <input name="language" value={formData.language} onChange={handleChange} placeholder="Language" className="input-field" />
//       <input name="tags" value={formData.tags.join(',')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })} placeholder="Tags (comma-separated)" className="input-field" />
//       <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" className="input-field" />
//       <input name="promoVideoUrl" value={formData.promoVideoUrl} onChange={handleChange} placeholder="Promo Video URL" className="input-field" />
//       <input name="level" value={formData.level} onChange={handleChange} placeholder="Level (Beginner/Advanced)" className="input-field" />
//       <input type="number" name="estimatedDurationMinutes" value={formData.estimatedDurationMinutes} onChange={handleChange} placeholder="Estimated Duration (mins)" className="input-field" />
//       <label className="checkbox-label">Paid:
//         <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={(e) => {
//   console.log("Checkbox changed:", e.target.checked);
//   handleChange(e);
// }}
//  />
//       </label>
//       {formData.isPaid && (
//         <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="input-field" />
//       )}
//       <label className="checkbox-label">Certificate:
//         <input type="checkbox" name="hasCertificate" checked={formData.hasCertificate} onChange={handleChange} />
//       </label>
//       <input name="status" value={formData.status} onChange={handleChange} placeholder="Status (draft/published)" className="input-field" />

//       {/* MODULES SECTION */}
//       <h3>Modules</h3>
//       {formData.modules.map((module, modIndex) => (
//         <div key={modIndex} className="module-section">
//           <input
//             placeholder="Module Title"
//             value={module.title}
//             onChange={(e) => handleModuleChange(modIndex, 'title', e.target.value)}
//             className="input-field"
//           />
//           <input
//             type="number"
//             placeholder="Order"
//             value={module.orderIndex}
//             onChange={(e) => handleModuleChange(modIndex, 'orderIndex', parseInt(e.target.value))}
//             className="input-field"
//           />
//           <button type="button" onClick={() => addLesson(modIndex)} className="button-secondary">Add Lesson</button>
//           <button type="button" onClick={() => removeModule(modIndex)} className="button-danger">Remove Module</button>

//           {/* LESSONS */}
//           {module.lessons.map((lesson, lessonIndex) => (
//             <div key={lessonIndex} className="lesson-section">
//               <input placeholder="Lesson Title" value={lesson.title} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'title', e.target.value)} className="input-field" />
//               <textarea placeholder="Content" value={lesson.content} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'content', e.target.value)} className="input-field" />
//               <input placeholder="Type (video/text/etc)" value={lesson.type} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'type', e.target.value)} className="input-field" />
//               <input placeholder="Media URL" value={lesson.mediaUrl} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'mediaUrl', e.target.value)} className="input-field" />
//               <input type="number" placeholder="Duration (mins)" value={lesson.durationMinutes} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'durationMinutes', parseInt(e.target.value))} className="input-field" />
//               <input type="number" placeholder="Order Index" value={lesson.orderIndex} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'orderIndex', parseInt(e.target.value))} className="input-field" />
//               <button type="button" onClick={() => removeLesson(modIndex, lessonIndex)} className="button-danger">Remove Lesson</button>
//             </div>
//           ))}
//         </div>
//       ))}
//       <button type="button" onClick={addModule} className="button-secondary">Add Module</button>

//       <button type="submit" className="button-submit">Save Course</button>
//     </form>
//   );
// };

// export default CourseForm;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../css/course/CourseForm.css";

// const CourseForm = ({ onSubmit, course = {} }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     shortDescription: '',
//     fullDescription: '',
//     category: '',
//     tags: [],
//     thumbnailUrl: '',
//     promoVideoUrl: '',
//     level: '',
//     language: '',
//     estimatedDurationMinutes: 0,
//     isPaid: false,
//     price: 0,
//     hasCertificate: false,
//     status: 'draft',
//     instructorId: '', // Optional: fill this dynamically
//     modules: [],
//     ...course
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleModuleChange = (index, field, value) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[index][field] = value;
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const handleLessonChange = (modIndex, lessonIndex, field, value) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[modIndex].lessons[lessonIndex][field] = value;
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const addModule = () => {
//     setFormData({
//       ...formData,
//       modules: [...formData.modules, { title: '', orderIndex: formData.modules.length, lessons: [] }]
//     });
//   };

//   const removeModule = (index) => {
//     const updatedModules = formData.modules.filter((_, i) => i !== index);
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const addLesson = (modIndex) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[modIndex].lessons.push({
//       title: '',
//       content: '',
//       type: '',
//       mediaUrl: '',
//       durationMinutes: 0,
//       orderIndex: updatedModules[modIndex].lessons.length
//     });
//     setFormData({ ...formData, modules: updatedModules });
//   };

//   const removeLesson = (modIndex, lessonIndex) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[modIndex].lessons = updatedModules[modIndex].lessons.filter((_, i) => i !== lessonIndex);
//     setFormData({ ...formData, modules: updatedModules });
//   };

// const handleFileUpload = async (file) => {
//   const formData = new FormData();
//   formData.append('file', file);

//   try {
//     const response = await fetch('http://localhost:8080/api/videos/upload', {
//       method: 'POST',
//       body: formData,
//     });

//     const result = await response.text();
//     if (response.ok) {
//       return result; 
//     } else {
//       throw new Error('Upload failed');
//     }
//   } catch (error) {
//     console.error('Error uploading video:', error);
//     return null;
//   }
// };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Upload the video and get the URL
//     if (formData.promoVideoUrl) {
//       const videoUrl = await handleFileUpload(formData.promoVideoUrl);
//       if (videoUrl) {
//         formData.promoVideoUrl = videoUrl; // Set the video URL to the form data
//       }
//     }

//     await onSubmit(formData);
//     navigate('/');
//   };

//   return (
//     <form onSubmit={handleSubmit} className="form-container">
//       {/* Basic Fields */}
//       <input name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" className="input-field" />
//       <input name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Short Description" className="input-field" />
//       <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} placeholder="Full Description" className="input-field" />
//       <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="input-field" />
//       <input name="language" value={formData.language} onChange={handleChange} placeholder="Language" className="input-field" />
//       <input name="tags" value={formData.tags.join(',')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })} placeholder="Tags (comma-separated)" className="input-field" />
//       <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" className="input-field" />
//       <input type="file" name="promoVideoUrl" onChange={(e) => setFormData({ ...formData, promoVideoUrl: e.target.files[0] })} className="input-field" />
//       <input name="level" value={formData.level} onChange={handleChange} placeholder="Level (Beginner/Advanced)" className="input-field" />
//       <input type="number" name="estimatedDurationMinutes" value={formData.estimatedDurationMinutes} onChange={handleChange} placeholder="Estimated Duration (mins)" className="input-field" />
//       <label className="checkbox-label">Paid:
//         <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
//       </label>
//       {formData.isPaid && (
//         <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="input-field" />
//       )}
//       <label className="checkbox-label">Certificate:
//         <input type="checkbox" name="hasCertificate" checked={formData.hasCertificate} onChange={handleChange} />
//       </label>
//       <input name="status" value={formData.status} onChange={handleChange} placeholder="Status (draft/published)" className="input-field" />

//       {/* MODULES SECTION */}
//       <h3>Modules</h3>
//       {formData.modules.map((module, modIndex) => (
//         <div key={modIndex} className="module-section">
//           <input
//             placeholder="Module Title"
//             value={module.title}
//             onChange={(e) => handleModuleChange(modIndex, 'title', e.target.value)}
//             className="input-field"
//           />
//           <input
//             type="number"
//             placeholder="Order"
//             value={module.orderIndex}
//             onChange={(e) => handleModuleChange(modIndex, 'orderIndex', parseInt(e.target.value))}
//             className="input-field"
//           />
//           <button type="button" onClick={() => addLesson(modIndex)} className="button-secondary">Add Lesson</button>
//           <button type="button" onClick={() => removeModule(modIndex)} className="button-danger">Remove Module</button>

//           {/* LESSONS */}
//           {module.lessons.map((lesson, lessonIndex) => (
//             <div key={lessonIndex} className="lesson-section">
//               <input placeholder="Lesson Title" value={lesson.title} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'title', e.target.value)} className="input-field" />
//               <textarea placeholder="Content" value={lesson.content} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'content', e.target.value)} className="input-field" />
//               <input placeholder="Type (video/text/etc)" value={lesson.type} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'type', e.target.value)} className="input-field" />
//               <input placeholder="Media URL" value={lesson.mediaUrl} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'mediaUrl', e.target.value)} className="input-field" />
//               <input type="number" placeholder="Duration (mins)" value={lesson.durationMinutes} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'durationMinutes', parseInt(e.target.value))} className="input-field" />
//               <input type="number" placeholder="Order Index" value={lesson.orderIndex} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'orderIndex', parseInt(e.target.value))} className="input-field" />
//               <button type="button" onClick={() => removeLesson(modIndex, lessonIndex)} className="button-danger">Remove Lesson</button>
//             </div>
//           ))}
//         </div>
//       ))}
//       <button type="button" onClick={addModule} className="button-secondary">Add Module</button>

//       <button type="submit" className="button-submit">Save Course</button>
//     </form>
//   );
// };

// export default CourseForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/course/CourseForm.css";
import Header from '../component/Header';
import Footer from '../component/Footer'; 

const CourseForm = ({ onSubmit, course = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    tags: [],
    thumbnailUrl: '',
    promoVideoUrl: '',
    level: '',
    language: '',
    estimatedDurationMinutes: 0,
    isPaid: false,
    price: 0,
    hasCertificate: false,
    status: 'draft',
    instructorId: '',
    modules: [],
    ...course
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleLessonChange = (modIndex, lessonIndex, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIndex].lessons[lessonIndex][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', orderIndex: formData.modules.length, lessons: [] }]
    });
  };

  const removeModule = (index) => {
    const updatedModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: updatedModules });
  };

  const addLesson = (modIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIndex].lessons.push({
      title: '',
      content: '',
      type: '',
      mediaUrl: '',
      durationMinutes: 0,
      orderIndex: updatedModules[modIndex].lessons.length
    });
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeLesson = (modIndex, lessonIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIndex].lessons = updatedModules[modIndex].lessons.filter((_, i) => i !== lessonIndex);
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();
      if (response.ok) {
        return result;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.promoVideoUrl instanceof File) {
      const videoUrl = await handleFileUpload(formData.promoVideoUrl);
      if (videoUrl) {
        formData.promoVideoUrl = videoUrl;
      }
    }

    for (let i = 0; i < formData.modules.length; i++) {
      const module = formData.modules[i];
      for (let j = 0; j < module.lessons.length; j++) {
        const lesson = module.lessons[j];
        if (lesson.mediaUrl instanceof File) {
          const videoUrl = await handleFileUpload(lesson.mediaUrl);
          if (videoUrl) {
            lesson.mediaUrl = videoUrl;
          }
        }
      }
    }

    await onSubmit(formData);
    navigate('/');
  };


  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await axios.post("http://localhost:8080/api/images/upload", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      // Since backend returns plain text (not JSON), use res.data directly
      const imageUrl = res.data;

      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: imageUrl
      }));
    } catch (error) {
      console.error("Thumbnail upload failed", error);
      alert("Thumbnail upload failed");
    }
  };

  return (
    <>
    <Header />
    <form onSubmit={handleSubmit} className="form-container">

<div className="course-creation-header-title1">Create Course

  <div className="course-creation-header-title2">Fill in the details to create a new course. You'll be able to update the content later.</div>
</div>


<div className='course-form-wrapper'>
  <label className="course-form-title">Course Title</label>
  <input name="title" value={formData.title} onChange={handleChange} placeholder="Java Spring Boot for Beginners" className="input-field" />
</div>

<div className='course-form-wrapper'>
  <label className="course-form-title">Short Description</label>
  <input name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Learn Spring Boot from scratch..." className="input-field" />
</div>

<div className='course-form-wrapper'>
  <label className="course-form-title">Full Description</label>
  <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} placeholder="This course takes you through everything from basic Java to.." className="input-field" />
</div>

<div className='course-form-wrapper'>
  <label className="course-form-title">Category</label>
  <input name="category" value={formData.category} onChange={handleChange} placeholder="Backend Development" className="input-field" />
</div>

<div className='course-form-wrapper'>
  <label className="course-form-title">Language</label>
  <input name="language" value={formData.language} onChange={handleChange} placeholder="English" className="input-field" />
</div>

<div className='course-form-wrapper' >
  <label className="course-form-title">Tags (comma-separated)</label>
  <input name="tags" value={formData.tags.join(',')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })} placeholder="Java,spring,bootcamp" className="input-field" />
</div>

{/* <div className='course-form-wrapper'>
  <label className="course-form-title">Thumbnail URL</label>
  <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" className="input-field" />
</div> */}

<div className="course-form-wrapper">
      <label className="course-form-title">Upload Thumbnail</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleThumbnailUpload}
        className="input-field"
      />

      {formData.thumbnailUrl && (
        <img
          src={formData.thumbnailUrl}
          alt="Thumbnail Preview"
          style={{ width: "150px", marginTop: "10px", borderRadius: "8px" }}
        />
      )}
    </div>

<div className='course-form-wrapper'>
  <label className="course-form-title">Promo Video</label>
  <input type="file" name="promoVideoUrl" onChange={(e) => setFormData({ ...formData, promoVideoUrl: e.target.files[0] })} className="input-field" />
</div>

<div className='course-form-wrapper'>
  <label className="course-form-title">Level </label>
  <input name="level" value={formData.level} onChange={handleChange} placeholder="Beginner/Advanced" className="input-field" />
</div>

<div className='course-form-wrapper' >
  <label className="course-form-title">Estimated Duration (mins)</label>
  <input type="number" name="estimatedDurationMinutes" value={formData.estimatedDurationMinutes} onChange={handleChange} placeholder="Estimated Duration (mins)" className="input-field" />
</div>

      <label className="checkbox-label">Paid:
        <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
      </label>
      {formData.isPaid && (
        <div className='course-form-wrapper' >
        <label className="course-form-title">Course Fee ($)</label>
        <input type="number"form name="price" value={formData.price} onChange={handleChange} placeholder="99" className="input-field" />
        </div>
      )}
      <label className="checkbox-label">Certificate:
        <input type="checkbox" name="hasCertificate" checked={formData.hasCertificate} onChange={handleChange} />
      </label>
      <div className='course-form-wrapper' >
      <label className="course-form-title">Status</label>
      <input name="status" value={formData.status} onChange={handleChange} placeholder="Status (draft/published)" className="input-field" />
      </div>

      {/* MODULES SECTION */}

      <div className='course-creation-header-title3'>Modules</div>
      {formData.modules.map((module, modIndex) => (
        <div key={modIndex} className="module-section">
          <div className='course-form-wrapper'>
          <label className="course-form-title">Module Title</label>
          <input
            placeholder="Module 1"
            value={module.title}
            onChange={(e) => handleModuleChange(modIndex, 'title', e.target.value)}
            className="input-field"
          />
          </div>

          <div className='course-form-wrapper'>
          <label className="course-form-title">Module Order</label>
          <input
            type="number"
            placeholder="Order"
            value={module.orderIndex}
            onChange={(e) => handleModuleChange(modIndex, 'orderIndex', parseInt(e.target.value))}
            className="input-field"
          />
          </div>

          <button type="button" onClick={() => addLesson(modIndex)} className="button-secondary">Add Lesson</button>
          <button type="button" onClick={() => removeModule(modIndex)} className="button-danger">Remove Module</button>

          {module.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="lesson-section">

              <div className='course-form-wrapper'>
              <label className="course-form-title">Lesson Title</label>
              <input placeholder="Introduction To Java" value={lesson.title} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'title', e.target.value)} className="input-field" />
              </div>

              <div className='course-form-wrapper'>
              <label className="course-form-title">Lesson Content</label>
              <textarea placeholder="Java is a populer programming language and .." value={lesson.content} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'content', e.target.value)} className="input-field" />
              </div>

              <div className='course-form-wrapper'>
              <label className="course-form-title">Lesson Type</label>
              <input placeholder="Type (video/text/etc)" value={lesson.type} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'type', e.target.value)} className="input-field" />
              </div>

              <div className='course-form-wrapper'>
              <label className="course-form-title">Lesson Media</label>
              <input type="file" onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'mediaUrl', e.target.files[0])} className="input-field" />
              </div>

              <div className='course-form-wrapper'>
              <label className="course-form-title">Lesson Duration</label>
              <input type="number" placeholder="Duration (mins)" value={lesson.durationMinutes} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'durationMinutes', parseInt(e.target.value))} className="input-field" />
              </div>

              <div className='course-form-wrapper'>
              <label className="course-form-title">Lesson Order</label>
              <input type="number" placeholder="Order Index" value={lesson.orderIndex} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'orderIndex', parseInt(e.target.value))} className="input-field" />
              </div>

              <button type="button" onClick={() => removeLesson(modIndex, lessonIndex)} className="button-danger">Remove Lesson</button>
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={addModule} className="button-secondary">Add Module</button>
      <button type="submit" className="button-submit">Create Course</button>
    </form>
    <Footer />
    </>
  );
};

export default CourseForm;

