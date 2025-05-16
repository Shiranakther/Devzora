import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseLink: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Store userId and roles
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const token = localStorage.getItem('token');

  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setError('You must be logged in to create a post.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log( `my role is: ${response.data.roles}`);
        setCurrentUser({ id: response.data.id, roles: response.data.roles });
      } catch (err) {
        setError('Failed to fetch user details. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    fetchCurrentUser();
  }, [navigate, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 3) {
      setError('You can upload a maximum of 3 images.');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImageFiles([...imageFiles, ...newImages]);
    setError('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files.length > 0) {
      if (videoFile) {
        setError('You can upload only one video.');
        return;
      }
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file.');
        return;
      }
      setVideoFile({
        file,
        url: URL.createObjectURL(file),
      });
      setError('');
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index) => {
    const imageToRemove = imageFiles[index];
    URL.revokeObjectURL(imageToRemove.url);
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    if (videoFile) {
      URL.revokeObjectURL(videoFile.url);
      setVideoFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUploading(true);
    setUploadProgress(0);

    if (!token || !currentUser) {
      setError('You must be logged in to create a post.');
      setIsUploading(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      setIsUploading(false);
      return;
    }
    
    const role = currentUser.roles && currentUser.roles.length > 0 ? currentUser.roles[0] : 'USER';
    if (!['USER', 'INSTRUCTOR'].includes(role)) {
      setError('Invalid user role for creating posts.');
      setIsUploading(false);
      return;
    }
    console.log(`final role ${role}`);

    try {
      let imageUrls = [];
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((item) => formDataImages.append('files', item.file));
        const imageResponse = await axios.post('http://localhost:8080/api/media/upload/images', formDataImages, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.min(50, Math.round((progressEvent.loaded * 50) / progressEvent.total));
            setUploadProgress(percentCompleted);
          },
        });
        imageUrls = imageResponse.data;
      }

      let videoUrl = '';
      if (videoFile) {
        const formDataVideo = new FormData();
        formDataVideo.append('file', videoFile.file);
        const videoResponse = await axios.post('http://localhost:8080/api/media/upload/video', formDataVideo, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.min(100, Math.round(50 + (progressEvent.loaded * 50) / progressEvent.total));
            setUploadProgress(percentCompleted);
          },
        });
        videoUrl = videoResponse.data;
      }

      const postData = {
        title: formData.title,
        description: formData.description,
        imageList: imageUrls,
        video: videoUrl,
        courseLink: formData.courseLink,
        userId: currentUser.id,
        role: role,
      };
         
      await axios.post('http://localhost:8080/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Post created successfully!');
      imageFiles.forEach((item) => URL.revokeObjectURL(item.url));
      if (videoFile) URL.revokeObjectURL(videoFile.url);
      setFormData({ title: '', description: '', courseLink: '' });
      setImageFiles([]);
      setVideoFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      if (onPostCreated) {
        console.log(role);
        onPostCreated('Post created successfully!');
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      if (err.response && err.response.status === 401) {
        setError('Unauthorized: Invalid or expired token. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || err.message || 'Error creating post');
      }
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      display: 'none',
    },
    textarea: {
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      minHeight: '100px',
    },
    button: {
      padding: '10px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      opacity: isUploading ? '0.6' : '1',
      pointerEvents: isUploading ? 'none' : 'auto',
    },
    buttonHover: {
      backgroundColor: '#218838',
    },
    error: {
      color: 'red',
      fontSize: '14px',
    },
    success: {
      color: 'green',
      fontSize: '14px',
    },
    fileInputContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    uploadRectangle: {
      width: '100%',
      height: '150px',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      cursor: isUploading ? 'not-allowed' : 'pointer',
      position: 'relative',
      transition: 'border-color 0.2s ease-in-out',
      padding: '10px',
      gap: '10px',
      overflowX: 'auto',
    },
    uploadRectangleHover: {
      borderColor: '#28a745',
    },
    uploadIcon: {
      fontSize: '24px',
      color: '#666',
      marginBottom: '5px',
    },
    uploadText: {
      fontSize: '16px',
      color: '#666',
    },
    fileCount: {
      fontSize: '14px',
      color: '#333',
      marginTop: '5px',
    },
    previewImageContainer: {
      position: 'relative',
      width: '80px',
      height: '80px',
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      flexShrink: 0,
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    previewVideoContainer: {
      position: 'relative',
      width: '120px',
      height: '90px',
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      flexShrink: 0,
    },
    previewVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    removeX: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      width: '20px',
      height: '20px',
      backgroundColor: 'rgba(220, 53, 69, 0.8)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      opacity: '0',
      transition: 'opacity 0.2s ease-in-out',
      pointerEvents: isUploading ? 'none' : 'auto',
    },
    previewHover: {
      opacity: '1',
    },
    loadingBarContainer: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e0e0e0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '5px',
    },
    progressBar: {
      width: `${uploadProgress}%`,
      height: '100%',
      backgroundColor: '#28a745',
      transition: 'width 0.3s ease-in-out',
    },
  };

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Post Title"
          style={{ ...styles.input, display: 'block' }}
          required
          disabled={isUploading}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Post Description"
          style={styles.textarea}
          required
          disabled={isUploading}
        />
        <input
          type="url"
          name="courseLink"
          value={formData.courseLink}
          onChange={handleInputChange}
          placeholder="Course Link (optional)"
          style={{ ...styles.input, display: 'block' }}
          disabled={isUploading}
        />
        <div style={styles.fileInputContainer}>
          <label>Upload Images (Max 3):</label>
          <div
            style={styles.uploadRectangle}
            tabIndex={isUploading ? -1 : 0}
            onKeyDown={(e) => !isUploading && e.key === 'Enter' && imageInputRef.current.click()}
            onMouseEnter={(e) => !isUploading && (e.currentTarget.style.borderColor = styles.uploadRectangleHover.borderColor)}
            onMouseLeave={(e) => !isUploading && (e.currentTarget.style.borderColor = '#ccc')}
            onClick={() => !isUploading && imageInputRef.current.click()}
          >
            {imageFiles.length === 0 ? (
              <>
                <div style={styles.uploadIcon}>📷</div>
                <div style={styles.uploadText}>Click to upload images</div>
                <div style={styles.fileCount}>0/3 images uploaded</div>
              </>
            ) : (
              imageFiles.map((item, index) => (
                <div
                  key={item.url}
                  style={styles.previewImageContainer}
                  onMouseEnter={(e) => {
                    if (!isUploading) {
                      e.currentTarget.querySelector('.removeX').style.opacity = styles.previewHover.opacity;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUploading) {
                      e.currentTarget.querySelector('.removeX').style.opacity = '0';
                    }
                  }}
                >
                  <img
                    src={item.url}
                    alt={`preview ${index}`}
                    style={styles.previewImage}
                  />
                  <button
                    type="button"
                    className="removeX"
                    style={styles.removeX}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    disabled={isUploading}
                  >
                    X
                  </button>
                </div>
              ))
            )}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              onChange={handleImageChange}
              style={styles.input}
              disabled={isUploading}
            />
          </div>
        </div>
        <div style={styles.fileInputContainer}>
          <label>Upload Video (Max 1):</label>
          <div
            style={styles.uploadRectangle}
            tabIndex={isUploading ? -1 : 0}
            onKeyDown={(e) => !isUploading && e.key === 'Enter' && videoInputRef.current.click()}
            onMouseEnter={(e) => !isUploading && (e.currentTarget.style.borderColor = styles.uploadRectangleHover.borderColor)}
            onMouseLeave={(e) => !isUploading && (e.currentTarget.style.borderColor = '#ccc')}
            onClick={() => !isUploading && videoInputRef.current.click()}
          >
            {!videoFile ? (
              <>
                <div style={styles.uploadIcon}>🎥</div>
                <div style={styles.uploadText}>Click to upload video</div>
                <div style={styles.fileCount}>0/1 video uploaded</div>
              </>
            ) : (
              <div
                style={styles.previewVideoContainer}
                onMouseEnter={(e) => {
                  if (!isUploading) {
                    e.currentTarget.querySelector('.removeX').style.opacity = styles.previewHover.opacity;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isUploading) {
                    e.currentTarget.querySelector('.removeX').style.opacity = '0';
                  }
                }}
              >
                <video
                  src={videoFile.url}
                  style={styles.previewVideo}
                  controls
                />
                <button
                  type="button"
                  className="removeX"
                  style={styles.removeX}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVideo();
                  }}
                  disabled={isUploading}
                >
                  X
                </button>
              </div>
            )}
            <input
              id="videoInput"
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoChange}
              style={styles.input}
              disabled={isUploading}
            />
          </div>
        </div>
        <div style={styles.fileInputContainer}>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => !isUploading && (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => !isUploading && (e.target.style.backgroundColor = '#28a745')}
          >
            Create Post
          </button>
          {isUploading && (
            <div style={styles.loadingBarContainer}>
              <div style={styles.progressBar}></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePost;