import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import FollowList from '../component/FollowList';
import Header from '../component/Header';
import Footer from '../component/Footer';

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editComment, setEditComment] = useState({});
  const [showCreatePostPopup, setShowCreatePostPopup] = useState(false);
  const [showUpdatePostPopup, setShowUpdatePostPopup] = useState(null); // Post ID for update
  const [imageIndices, setImageIndices] = useState({});
  const [activeSlide, setActiveSlide] = useState('all');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [showFollowList, setShowFollowList] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Update Post Form States
  const [updateFormData, setUpdateFormData] = useState({
    title: '',
    description: '',
    courseLink: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideo, setExistingVideo] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [postRole, setPostRole] = useState('USER');
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setError('You must be logged in to view posts.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.id);
        setUserDetails((prev) => ({
          ...prev,
          [response.data.id]: {
            username: response.data.username,
            roles: response.data.roles,
            following: response.data.following || [],
          },
        }));
      } catch (err) {
        setError('Failed to fetch current user. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    fetchCurrentUser();
  }, [navigate, token]);

  // Fetch all posts
  const fetchPosts = async () => {
    if (!token) {
      setError('You must be logged in to view posts.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
      const initialIndices = response.data.reduce((acc, post) => {
        acc[post.id] = 0;
        return acc;
      }, {});
      setImageIndices(initialIndices);
      response.data.forEach((post) => {
        fetchComments(post.id);
        fetchUserDetails(post.userId);
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized: Invalid or expired token. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Error fetching posts: ' + (err.response?.data || err.message));
      }
    }
  };

  // Fetch user details
  const fetchUserDetails = async (userId) => {
    if (userDetails[userId]) return;
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails((prev) => ({
        ...prev,
        [userId]: {
          username: response.data.username,
          roles: ['USER'], // Default role
        },
      }));
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err.message);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchPosts();
    }
  }, [currentUserId]);

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => ({ ...prev, [postId]: response.data }));
      const userIds = [...new Set(response.data.map((comment) => comment.userId))];
      userIds.forEach(fetchUserDetails);
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err.message);
    }
  };

  // Fetch post data for update
  const fetchPostForUpdate = async (postId) => {
    try {
      const postResponse = await axios.get(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpdateFormData({
        title: postResponse.data.title || '',
        description: postResponse.data.description || '',
        courseLink: postResponse.data.courseLink || '',
      });
      setExistingImages(postResponse.data.imageList || []);
      setExistingVideo(postResponse.data.video || '');
      setPostRole(postResponse.data.role || 'USER');
    } catch (err) {
      if (err.response?.status === 401) {
        setUpdateError('Unauthorized: Invalid or expired token. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setUpdateError('Failed to fetch post data: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Handle update form input change
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  // Handle image change for update
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length + existingImages.length > 3) {
      setUpdateError('You can upload a maximum of 3 images.');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImageFiles([...imageFiles, ...newImages]);
    setUpdateError('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Handle video change for update
  const handleVideoChange = (e) => {
    if (e.target.files.length > 0) {
      if (videoFile || existingVideo) {
        setUpdateError('You can upload only one video.');
        return;
      }
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        setUpdateError('Please upload a valid video file.');
        return;
      }
      setVideoFile({
        file,
        url: URL.createObjectURL(file),
      });
      setUpdateError('');
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  // Remove image for update
  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      const imageToRemove = imageFiles[index];
      URL.revokeObjectURL(imageToRemove.url);
      setImageFiles(imageFiles.filter((_, i) => i !== index));
    }
  };

  // Remove video for update
  const removeVideo = () => {
    if (videoFile) {
      URL.revokeObjectURL(videoFile.url);
      setVideoFile(null);
    }
    setExistingVideo('');
  };

  // Handle update submission
  const handleUpdateSubmit = async (e, postId) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    setIsUploading(true);
    setUploadProgress(0);

    if (!token || !currentUserId) {
      setUpdateError('You must be logged in to update a post.');
      setIsUploading(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!updateFormData.title.trim() || !updateFormData.description.trim()) {
      setUpdateError('Title and description are required.');
      setIsUploading(false);
      return;
    }

    const role = postRole;
    if (!['USER', 'INSTRUCTOR'].includes(role)) {
      setUpdateError('Invalid post role.');
      setIsUploading(false);
      return;
    }

    try {
      let imageUrls = [...existingImages];
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((item) => formDataImages.append('files', item.file));
        const imageResponse = await axios.post('http://localhost:8080/api/media/upload/images', formDataImages, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.min(50, Math.round((progressEvent.loaded * 50) / progressEvent.total));
            setUploadProgress(percentCompleted);
          },
        });
        imageUrls = [...imageUrls, ...imageResponse.data];
      }

      let videoUrl = existingVideo;
      if (videoFile) {
        const formDataVideo = new FormData();
        formDataVideo.append('file', videoFile.file);
        const videoResponse = await axios.post('http://localhost:8080/api/media/upload/video', formDataVideo, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.min(100, Math.round(50 + (progressEvent.loaded * 50) / progressEvent.total));
            setUploadProgress(percentCompleted);
          },
        });
        videoUrl = videoResponse.data;
      }

      const postData = {
        title: updateFormData.title,
        description: updateFormData.description,
        imageList: imageUrls,
        video: videoUrl,
        courseLink: updateFormData.courseLink,
        userId: currentUserId,
        role: role,
      };

      const response = await axios.put(`http://localhost:8080/api/posts/${postId}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUpdateSuccess('Post updated successfully!');
      imageFiles.forEach((item) => URL.revokeObjectURL(item.url));
      if (videoFile) URL.revokeObjectURL(videoFile.url);
      setImageFiles([]);
      setVideoFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      setShowUpdatePostPopup(null);
      setPosts(posts.map((post) => (post.id === postId ? response.data : post)));
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      if (err.response?.status === 401) {
        setUpdateError('Unauthorized: Invalid or expired token. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        setUpdateError('You are not authorized to update this post.');
      } else {
        setUpdateError(err.response?.data?.message || err.message || 'Error updating post');
      }
    }
  };

  // Handle like/unlike toggle
  const handleToggleLike = async (postId, isLiked) => {
    if (!token) {
      setError('You must be logged in to like a post.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const endpoint = isLiked
        ? `http://localhost:8080/api/posts/${postId}/unlike`
        : `http://localhost:8080/api/posts/${postId}/like`;
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.map((post) => (post.id === postId ? response.data : post)));
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.data || `Error toggling like: ${err.message}`
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  // Handle follow/unfollow toggle
  const handleToggleFollow = async (userId, isFollowing) => {
    if (!token) {
      setError('You must be logged in to follow a user.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const endpoint = isFollowing
        ? `http://localhost:8080/user/${userId}/unfollow`
        : `http://localhost:8080/user/${userId}/follow`;
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails((prev) => ({
        ...prev,
        [currentUserId]: {
          ...prev[currentUserId],
          following: response.data.following || [],
        },
      }));
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.data || `Error toggling follow: ${err.message}`
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  // Handle new comment submission
  const handleAddComment = async (postId) => {
    if (!token) {
      setError('You must be logged in to add a comment.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!newComment[postId]?.trim()) {
      setError('Comment content cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/comments/create',
        { postId, content: newComment[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserDetails(response.data.userId);
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
      setError('');
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.data || `Error adding comment: ${err.message}`
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  // Handle comment update
  const handleUpdateComment = async (postId, commentId) => {
    if (!token) {
      setError('You must be logged in to update a comment.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!editComment[commentId]?.trim()) {
      setError('Comment content cannot be empty.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/comments/update/${commentId}`,
        { content: editComment[commentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === commentId ? { ...comment, content: response.data.content } : comment
        ),
      }));
      setEditComment((prev) => {
        const newEdit = { ...prev };
        delete newEdit[commentId];
        return newEdit;
      });
      setError('');
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.status === 403
          ? 'You are not authorized to update this comment.'
          : err.response?.data || `Error updating comment: ${err.message}`
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (postId, commentId) => {
    if (!token) {
      setError('You must be logged in to delete a comment.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/comments/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== commentId),
      }));
      setError('');
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.status === 403
          ? 'You are not authorized to delete this comment.'
          : err.response?.data || `Error deleting comment: ${err.message}`
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    if (!token) {
      setError('You must be logged in to delete a post.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (window.confirm(`Are you sure you want to delete post with ID ${postId}?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess(`Post with ID ${postId} deleted successfully!`);
        setPosts(posts.filter((post) => post.id !== postId));
        setComments((prev) => {
          const newComments = { ...prev };
          delete newComments[postId];
          return newComments;
        });
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? 'Unauthorized: Please log in again.'
            : err.response?.status === 403
            ? 'You are not authorized to delete this post.'
            : err.response?.data || `Error deleting post: ${err.message}`
        );
        if (err.response?.status === 401) {
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    }
  };

  // Handle create post popup
  const handleCreatePost = () => {
    if (!token) {
      setError('You must be logged in to create a post.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setShowCreatePostPopup(true);
  };

  // Handle update post popup
  const handleUpdate = (postId) => {
    if (!token) {
      setError('You must be logged in to update a post.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setShowUpdatePostPopup(postId);
    fetchPostForUpdate(postId);
  };

  // Close popups
  const closeCreatePostPopup = () => {
    setShowCreatePostPopup(false);
  };

  const closeUpdatePostPopup = () => {
    setShowUpdatePostPopup(null);
    setImageFiles([]);
    setVideoFile(null);
    setExistingImages([]);
    setExistingVideo('');
    setUpdateFormData({ title: '', description: '', courseLink: '' });
    setUpdateError('');
    setUpdateSuccess('');
    setUploadProgress(0);
  };

  // Handle successful post creation
  const handlePostCreated = (message) => {
    setSuccess(message);
    setShowCreatePostPopup(false);
    fetchPosts();
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle image navigation
  const handleNextImage = (postId, imageCount) => {
    setImageIndices((prev) => ({
      ...prev,
      [postId]: Math.min((prev[postId] || 0) + 1, imageCount - 1),
    }));
  };

  const handlePrevImage = (postId) => {
    setImageIndices((prev) => ({
      ...prev,
      [postId]: Math.max((prev[postId] || 0) - 1, 0),
    }));
  };

  // Check if video is a YouTube URL
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  // Filter posts based on active slide
  const filteredPosts = () => {
    if (activeSlide === 'myPosts') {
      return posts.filter((post) => post.userId === currentUserId);
    } else if (activeSlide === 'instructor') {
      return posts.filter((post) => post.role === 'INSTRUCTOR');
    }
    return posts;
  };

  // Comment Section Rendering Logic
  const renderCommentSection = (postId) => (
    <div style={styles.commentsContainer}>
      <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#34495e', marginBottom: '15px' }}>
        Comments
      </h4>
      {comments[postId]?.length > 0 ? (
        comments[postId].map((comment) => (
          <div key={comment.id} style={styles.comment}>
            {editComment[comment.id] ? (
              <>
                <input
                  type="text"
                  value={editComment[comment.id]}
                  onChange={(e) =>
                    setEditComment((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
                  style={styles.editCommentInput}
                  placeholder="Edit your comment..."
                />
                <div style={styles.commentButtonContainer}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleUpdateComment(postId, comment.id)}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#e0a800')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#ffc107')}
                    aria-label="Save comment"
                  >
                    Save
                  </button>
                  <button
                    style={styles.deleteCommentButton}
                    onClick={() =>
                      setEditComment((prev) => {
                        const newEdit = { ...prev };
                        delete newEdit[comment.id];
                        return newEdit;
                      })
                    }
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={styles.commentText}>{comment.content}</p>
                <p style={{ fontSize: '12px', color: '#95a5a6', marginBottom: '10px' }}>
                  Posted by: {userDetails[comment.userId]?.username || 'Unknown'}
                </p>
                {comment.userId === currentUserId && (
                  <div style={styles.commentButtonContainer}>
                    <button
                      style={styles.editButton}
                      onClick={() =>
                        setEditComment((prev) => ({
                          ...prev,
                          [comment.id]: comment.content,
                        }))
                      }
                      onMouseOver={(e) => (e.target.style.backgroundColor = '#e0a800')}
                      onMouseOut={(e) => (e.target.style.backgroundColor = '#ffc107')}
                      aria-label="Edit comment"
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteCommentButton}
                      onClick={() => handleDeleteComment(postId, comment.id)}
                      onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
                      onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
                      aria-label="Delete comment"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p style={styles.commentText}>No comments available.</p>
      )}
      <input
        type="text"
        placeholder="Add a comment..."
        value={newComment[postId] || ''}
        onChange={(e) =>
          setNewComment((prev) => ({ ...prev, [postId]: e.target.value }))
        }
        style={styles.commentInput}
      />
      <button
        style={styles.commentButton}
        onClick={() => handleAddComment(postId)}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
        aria-label="Add comment"
      >
        Add Comment
      </button>
    </div>
  );

  // Update Post Form Rendering
  const renderUpdatePostForm = (postId) => (
    <div style={styles.popupContainer}>
      <h2 style={styles.popupHeader}>Update Post</h2>
      {updateError && <p style={styles.error}>{updateError}</p>}
      {updateSuccess && <p style={styles.success}>{updateSuccess}</p>}
      <form onSubmit={(e) => handleUpdateSubmit(e, postId)} style={styles.form}>
        <input
          type="text"
          name="title"
          value={updateFormData.title}
          onChange={handleUpdateInputChange}
          placeholder="Post Title"
          style={{ ...styles.input, display: 'block' }}
          required
          disabled={isUploading}
        />
        <textarea
          name="description"
          value={updateFormData.description}
          onChange={handleUpdateInputChange}
          placeholder="Post Description"
          style={styles.textarea}
          required
          disabled={isUploading}
        />
        <input
          type="url"
          name="courseLink"
          value={updateFormData.courseLink}
          onChange={handleUpdateInputChange}
          placeholder="Course Link (optional)"
          style={{ ...styles.input, display: 'block' }}
          disabled={isUploading}
        />
        <div style={styles.fileInputContainer}>
          <label>Images (Max 3):</label>
          <div
            style={styles.uploadRectangle}
            tabIndex={isUploading ? -1 : 0}
            onKeyDown={(e) => !isUploading && e.key === 'Enter' && imageInputRef.current.click()}
            onMouseEnter={(e) => !isUploading && (e.currentTarget.style.borderColor = styles.uploadRectangleHover.borderColor)}
            onMouseLeave={(e) => !isUploading && (e.currentTarget.style.borderColor = '#ccc')}
            onClick={() => !isUploading && imageInputRef.current.click()}
          >
            {imageFiles.length === 0 && existingImages.length === 0 ? (
              <>
                <div style={styles.uploadIcon}>📷</div>
                <div style={styles.uploadText}>Click to upload images</div>
                <div style={styles.fileCount}>{existingImages.length + imageFiles.length}/3 images uploaded</div>
              </>
            ) : (
              <>
                {existingImages.map((url, index) => (
                  <div
                    key={`existing-${index}`}
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
                      src={url}
                      alt={`existing image ${index}`}
                      style={styles.previewImage}
                      onError={(e) => (e.target.src = 'https://placehold.co/80x80')}
                    />
                    <button
                      type="button"
                      className="removeX"
                      style={styles.removeX}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index, true);
                      }}
                      disabled={isUploading}
                    >
                      X
                    </button>
                  </div>
                ))}
                {imageFiles.map((item, index) => (
                  <div
                    key={`new-${item.url}`}
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
                      alt={`new image ${index}`}
                      style={styles.previewImage}
                    />
                    <button
                      type="button"
                      className="removeX"
                      style={styles.removeX}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index, false);
                      }}
                      disabled={isUploading}
                    >
                      X
                    </button>
                  </div>
                ))}
              </>
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
          <label>Video (Max 1):</label>
          <div
            style={styles.uploadRectangle}
            tabIndex={isUploading ? -1 : 0}
            onKeyDown={(e) => !isUploading && e.key === 'Enter' && videoInputRef.current.click()}
            onMouseEnter={(e) => !isUploading && (e.currentTarget.style.borderColor = styles.uploadRectangleHover.borderColor)}
            onMouseLeave={(e) => !isUploading && (e.currentTarget.style.borderColor = '#ccc')}
            onClick={() => !isUploading && videoInputRef.current.click()}
          >
            {!videoFile && !existingVideo ? (
              <>
                <div style={styles.uploadIcon}>🎥</div>
                <div style={styles.uploadText}>Click to upload video</div>
                <div style={styles.fileCount}>{(videoFile || existingVideo) ? 1 : 0}/1 video uploaded</div>
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
                  src={videoFile ? videoFile.url : existingVideo}
                  style={styles.previewVideo}
                  controls
                  onError={() => setUpdateError('Error loading video preview.')}
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
            Update Post
          </button>
          {isUploading && (
            <div style={styles.loadingBarContainer}>
              <div style={styles.progressBar}></div>
            </div>
          )}
        </div>
      </form>
      <button
        style={styles.cancelButton}
        onClick={closeUpdatePostPopup}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#5a6268')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#6c757d')}
        aria-label="Cancel update"
      >
        Cancel
      </button>
    </div>
  );

  // Post Rendering Logic
  const renderPost = (post) => {
    const currentImageIndex = imageIndices[post.id] || 0;
    const hasImages = post.imageList && post.imageList.length > 0;
    const hasMultipleImages = post.imageList && post.imageList.length > 1;
    const isLiked = post.likes && post.likes.includes(currentUserId);
    const likeCount = post.likes ? post.likes.length : 0;
    const isFollowing = userDetails[currentUserId]?.following?.includes(post.userId);

    return (
      <div key={post.id} style={styles.postCard}>
        <div style={styles.postHeader}>
          <div>
            <h3 style={styles.title}>{post.title}</h3>
            <p style={{ fontSize: '14px', color: '#95a5a6', marginBottom: '5px' }}>
              Posted by: {userDetails[post.userId]?.username || 'Unknown'} (
              {userDetails[post.userId]?.roles?.join(', ') || 'N/A'})
            </p>
          </div>
          {post.userId !== currentUserId && (
            <button
              style={isFollowing ? styles.unfollowButton : styles.followButton}
              onClick={() => handleToggleFollow(post.userId, isFollowing)}
              onMouseOver={(e) => (e.target.style.backgroundColor = isFollowing ? '#5a6268' : '#138496')}
              onMouseOut={(e) => (e.target.style.backgroundColor = isFollowing ? '#6c757d' : '#17a2b8')}
              aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <p style={styles.description}>{post.description}</p>
        <p style={{ fontSize: '12px', color: '#95a5a6', marginBottom: '10px' }}>
          Posted as: {post.role || 'N/A'}
        </p>
        {post.courseLink && (
          <a
            href={post.courseLink}
            style={styles.courseLink}
            target="_blank"
            rel="noopener noreferrer"
            onMouseOver={(e) => (e.target.style.color = '#0056b3')}
            onMouseOut={(e) => (e.target.style.color = '#007bff')}
          >
            View Course
          </a>
        )}
        {hasImages && (
          <div style={styles.imageCarousel}>
            <img
              src={post.imageList[currentImageIndex]}
              alt={`Post image ${currentImageIndex + 1}`}
              style={styles.image}
              onError={(e) => (e.target.src = 'https://placehold.co/400x300')}
            />
            {hasMultipleImages && (
              <>
                <button
                  style={{ ...styles.arrowButton, ...styles.leftArrow }}
                  onClick={() => handlePrevImage(post.id)}
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.7)')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.5)')}
                  disabled={currentImageIndex === 0}
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  style={{ ...styles.arrowButton, ...styles.rightArrow }}
                  onClick={() => handleNextImage(post.id, post.imageList.length)}
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.7)')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.5)')}
                  disabled={currentImageIndex === post.imageList.length - 1}
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}
          </div>
        )}
        {post.video ? (
          isYouTubeUrl(post.video) ? (
            <iframe
              src={post.video}
              style={styles.video}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={`Post video ${post.id}`}
            ></iframe>
          ) : (
            <video controls style={styles.video}>
              <source src={post.video} type="video/mp4" />
              <p style={styles.videoError}>Your browser does not support the video tag.</p>
            </video>
          )
        ) : (
          <p style={styles.videoError}>No video available for this post.</p>
        )}
        <div style={styles.likeContainer}>
          <button
            style={isLiked ? styles.unlikeButton : styles.likeButton}
            onClick={() => handleToggleLike(post.id, isLiked)}
            onMouseOver={(e) => (e.target.style.backgroundColor = isLiked ? '#c82333' : '#e74c3c')}
            onMouseOut={(e) => (e.target.style.backgroundColor = isLiked ? '#dc3545' : '#ff6b6b')}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            {isLiked ? 'Unlike' : 'Like'}
          </button>
          <span style={styles.likeCount}>
            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </span>
        </div>
        {renderCommentSection(post.id)}
        {post.userId === currentUserId && (
          <div style={styles.buttonContainer}>
            <button
              style={styles.updateButton}
              onClick={() => handleUpdate(post.id)}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              aria-label="Update post"
            >
              Update
            </button>
            <button
              style={styles.deleteButton}
              onClick={() => handleDelete(post.id)}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
              aria-label="Delete post"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  // Styles (unchanged from original, adding UpdatePostPage styles)
  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      boxSizing: 'border-box',
    },
    container: {
      maxWidth: '800px',
      width: '100%',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fff',
      flex: '1',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      boxSizing: 'border-box',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
      borderBottom: '2px solid #e0e0e0',
      paddingBottom: '5px',
    },
    tabButton: {
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#34495e',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '2px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.3s',
      margin: '0 10px',
    },
    activeTabButton: {
      color: '#007bff',
      borderBottom: '2px solid #007bff',
    },
    postCard: {
      maxWidth: '600px',
      width: '100%',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      margin: '0 auto 20px auto',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s, transform 0.3s',
      boxSizing: 'border-box',
    },
    postHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '5px',
    },
    description: {
      fontSize: '16px',
      color: '#7f8c8d',
      marginBottom: '15px',
      lineHeight: '1.6',
    },
    courseLink: {
      color: '#007bff',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '10px',
      display: 'inline-block',
      transition: 'color 0.3s',
    },
    imageCarousel: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      height: '300px',
      margin: '0 auto 15px',
      overflow: 'hidden',
      borderRadius: '5px',
      border: '1px solid #ecf0f1',
      boxSizing: 'border-box',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    arrowButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    leftArrow: {
      left: '10px',
    },
    rightArrow: {
      right: '10px',
    },
    video: {
      width: '100%',
      maxWidth: '400px',
      height: 'auto',
      maxHeight: '250px',
      borderRadius: '5px',
      margin: '0 auto 15px',
      display: 'block',
      border: '1px solid #ecf0f1',
      boxSizing: 'border-box',
    },
    videoError: {
      fontSize: '14px',
      color: '#e74c3c',
      textAlign: 'center',
      margin: '10px 0',
    },
    likeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '10px 0',
    },
    likeButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#ff6b6b',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    unlikeButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#dc3545',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    followButton: {
      padding: '6px 12px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#17a2b8',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    unfollowButton: {
      padding: '6px 12px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#6c757d',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    likeCount: {
      fontSize: '14px',
      color: '#34495e',
      fontWeight: '500',
    },
    commentsContainer: {
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      boxSizing: 'border-box',
    },
    comment: {
      marginBottom: '15px',
      padding: '15px',
      backgroundColor: '#fff',
      borderRadius: '6px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      boxSizing: 'border-box',
    },
    commentText: {
      fontSize: '14px',
      lineHeight: '1.5',
      marginBottom: '12px',
      color: '#333',
    },
    commentButtonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-start',
    },
    commentInput: {
      width: '100%',
      padding: '10px',
      margin: '15px 0 10px 0',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    commentButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#28a745',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    editCommentInput: {
      width: '100%',
      padding: '10px',
      marginBottom: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    editButton: {
      padding: '6px 12px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#ffc107',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    deleteCommentButton: {
      padding: '6px 12px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#dc3545',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    error: {
      color: '#e74c3c',
      fontSize: '14px',
      textAlign: 'center',
      margin: '10px 0',
    },
    success: {
      color: '#28a745',
      fontSize: '14px',
      textAlign: 'center',
      margin: '10px 0',
    },
    noPosts: {
      fontSize: '18px',
      textAlign: 'center',
      color: '#7f8c8d',
      fontStyle: 'italic',
      margin: '20px 0',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
      justifyContent: 'flex-end',
    },
    updateButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    deleteButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#dc3545',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    createButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#17a2b8',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    followListButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#6f42c1',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      boxSizing: 'border-box',
    },
    popupContainer: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      position: 'relative',
      boxSizing: 'border-box',
    },
    popupHeader: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '15px',
      textAlign: 'center',
    },
    cancelButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#6c757d',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '10px',
      width: '100%',
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
      flexShrink: '0',
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
      flexShrink: '0',
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
    <div style={styles.pageContainer}>
      <Header />
      <div style={styles.container}>
        <div style={styles.headerContainer}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
            All Posts
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={styles.createButton}
              onClick={handleCreatePost}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#138496')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#17a2b8')}
              aria-label="Create new post"
            >
              Create Post
            </button>
            <button
              style={styles.followListButton}
              onClick={() => setShowFollowList(true)}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#5a2d9c')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#6f42c1')}
              aria-label="View follow list"
            >
              My Follow List
            </button>
          </div>
        </div>
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeSlide === 'all' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveSlide('all')}
            onMouseOver={(e) => {
              if (activeSlide !== 'all') e.target.style.color = '#0056b3';
            }}
            onMouseOut={(e) => {
              if (activeSlide !== 'all') e.target.style.color = '#34495e';
            }}
          >
            All Posts
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeSlide === 'myPosts' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveSlide('myPosts')}
            onMouseOver={(e) => {
              if (activeSlide !== 'myPosts') e.target.style.color = '#0056b3';
            }}
            onMouseOut={(e) => {
              if (activeSlide !== 'myPosts') e.target.style.color = '#34495e';
            }}
          >
            Students Posts
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeSlide === 'instructor' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveSlide('instructor')}
            onMouseOver={(e) => {
              if (activeSlide !== 'instructor') e.target.style.color = '#0056b3';
            }}
            onMouseOut={(e) => {
              if (activeSlide !== 'instructor') e.target.style.color = '#34495e';
            }}
          >
            Instructor Posts
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        {filteredPosts().length === 0 && !error && (
          <p style={styles.noPosts}>
            {activeSlide === 'all'
              ? 'No posts available.'
              : activeSlide === 'myPosts'
              ? 'You have not created any posts yet.'
              : 'No instructor posts available.'}
          </p>
        )}
        {filteredPosts().map((post) => renderPost(post))}
        {showCreatePostPopup && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupContainer}>
              <h2 style={styles.popupHeader}>Create New Post</h2>
              <CreatePost
                onClose={closeCreatePostPopup}
                onPostCreated={handlePostCreated}
              />
              <button
                style={styles.cancelButton}
                onClick={closeCreatePostPopup}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#5a6268')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#6c757d')}
                aria-label="Cancel post creation"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {showUpdatePostPopup && (
          <div style={styles.popupOverlay}>
            {renderUpdatePostForm(showUpdatePostPopup)}
          </div>
        )}
        {showFollowList && (
          <FollowList
            userId={currentUserId}
            onClose={() => setShowFollowList(false)}
            token={token}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PostPage;