

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

  return (
    <>
    <Header />
    <form onSubmit={handleSubmit} className="form-container">
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" className="input-field" />
      <input name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Short Description" className="input-field" />
      <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} placeholder="Full Description" className="input-field" />
      <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="input-field" />
      <input name="language" value={formData.language} onChange={handleChange} placeholder="Language" className="input-field" />
      <input name="tags" value={formData.tags.join(',')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })} placeholder="Tags (comma-separated)" className="input-field" />
      <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" className="input-field" />
      <input type="file" name="promoVideoUrl" onChange={(e) => setFormData({ ...formData, promoVideoUrl: e.target.files[0] })} className="input-field" />
      <input name="level" value={formData.level} onChange={handleChange} placeholder="Level (Beginner/Advanced)" className="input-field" />
      <input type="number" name="estimatedDurationMinutes" value={formData.estimatedDurationMinutes} onChange={handleChange} placeholder="Estimated Duration (mins)" className="input-field" />
      <label className="checkbox-label">Paid:
        <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
      </label>
      {formData.isPaid && (
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="input-field" />
      )}
      <label className="checkbox-label">Certificate:
        <input type="checkbox" name="hasCertificate" checked={formData.hasCertificate} onChange={handleChange} />
      </label>
      <input name="status" value={formData.status} onChange={handleChange} placeholder="Status (draft/published)" className="input-field" />

      <h3>Modules</h3>
      {formData.modules.map((module, modIndex) => (
        <div key={modIndex} className="module-section">
          <input
            placeholder="Module Title"
            value={module.title}
            onChange={(e) => handleModuleChange(modIndex, 'title', e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Order"
            value={module.orderIndex}
            onChange={(e) => handleModuleChange(modIndex, 'orderIndex', parseInt(e.target.value))}
            className="input-field"
          />
          <button type="button" onClick={() => addLesson(modIndex)} className="button-secondary">Add Lesson</button>
          <button type="button" onClick={() => removeModule(modIndex)} className="button-danger">Remove Module</button>

          {module.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="lesson-section">
              <input placeholder="Lesson Title" value={lesson.title} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'title', e.target.value)} className="input-field" />
              <textarea placeholder="Content" value={lesson.content} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'content', e.target.value)} className="input-field" />
              <input placeholder="Type (video/text/etc)" value={lesson.type} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'type', e.target.value)} className="input-field" />
              <input type="file" onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'mediaUrl', e.target.files[0])} className="input-field" />
              <input type="number" placeholder="Duration (mins)" value={lesson.durationMinutes} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'durationMinutes', parseInt(e.target.value))} className="input-field" />
              <input type="number" placeholder="Order Index" value={lesson.orderIndex} onChange={(e) => handleLessonChange(modIndex, lessonIndex, 'orderIndex', parseInt(e.target.value))} className="input-field" />
              <button type="button" onClick={() => removeLesson(modIndex, lessonIndex)} className="button-danger">Remove Lesson</button>
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={addModule} className="button-secondary">Add Module</button>
      <button type="submit" className="button-submit">Save Course</button>
    </form>
    <Footer />
    </>
  );
};

export default CourseForm;

