import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import FollowList from '../component/FollowList';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PostPage = () => {
  const [posts, setPosts] = useState([]); // All posts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editComment, setEditComment] = useState({});
  const [showCreatePostPopup, setShowCreatePostPopup] = useState(false);
  const [showUpdatePostPopup, setShowUpdatePostPopup] = useState(null);
  const [imageIndices, setImageIndices] = useState({});
  const [activeSlide, setActiveSlide] = useState('all');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [showFollowList, setShowFollowList] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setError('Please log in to view posts.');
        setLoading(false);
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Current User:', response.data);
        setCurrentUserId(response.data.id);
      } catch (err) {
        console.error('Fetch user error:', err);
        setError('Failed to fetch user. Please log in again.');
        setLoading(false);
        navigate('/login');
      }
    };
    fetchCurrentUser();
  }, [navigate, token]);

  // Fetch all posts
  useEffect(() => {
    if (!currentUserId) return;

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('All Posts:', response.data);
        setPosts(response.data);
        // Initialize image indices
        const initialIndices = response.data.reduce((acc, post) => {
          acc[post.id] = 0;
          return acc;
        }, {});
        setImageIndices(initialIndices);
        // Fetch comments and user details
        response.data.forEach((post) => {
          fetchComments(post.id);
          fetchUserDetails(post.userId);
        });
        setLoading(false);
      } catch (err) {
        console.error('Fetch posts error:', err);
        setError('Failed to load posts.');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchPosts();
  }, [currentUserId, token, navigate]);

  // Fetch user details
  const fetchUserDetails = async (userId) => {
    if (userDetails[userId]) return;
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails((prev) => ({
        ...prev,
        [userId]: { username: response.data.username, roles: ['USER'] },
      }));
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err);
    }
  };

  // Fetch comments
  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => ({ ...prev, [postId]: response.data }));
      response.data.forEach((comment) => fetchUserDetails(comment.userId));
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
    }
  };

  // Handle image navigation
  const handlePrevImage = (postId, imageCount) => {
    setImageIndices((prev) => ({
      ...prev,
      [postId]: (prev[postId] - 1 + imageCount) % imageCount,
    }));
  };

  const handleNextImage = (postId, imageCount) => {
    setImageIndices((prev) => ({
      ...prev,
      [postId]: (prev[postId] + 1) % imageCount,
    }));
  };

  // Filter posts
  const filteredPosts = () => {
    console.log('Active Slide:', activeSlide, 'All Posts:', posts);
    if (activeSlide === 'student') {
      return posts.filter((post) => post.role === 'USER');
    } else if (activeSlide === 'instructor') {
      return posts.filter((post) => post.role === 'INSTRUCTOR');
    }
    return posts;
  };

  // Render post
  const renderPost = (post) => (
    <div
      key={post.id}
      style={styles.postCard}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <h2 style={styles.title}>{post.title}</h2>
      <p style={styles.description}>{post.description}</p>
      {post.imageList?.length > 0 && (
        <div style={styles.imageContainer}>
          <img
            src={post.imageList[imageIndices[post.id] || 0]}
            alt={`${post.title} image ${imageIndices[post.id] + 1}`}
            style={styles.image}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200')}
          />
          {post.imageList.length > 1 && (
            <>
              <button
                onClick={() => handlePrevImage(post.id, post.imageList.length)}
                style={styles.prevButton}
                onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.7)')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.5)')}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => handleNextImage(post.id, post.imageList.length)}
                style={styles.nextButton}
                onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.7)')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.5)')}
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      )}
      {post.videoUrl && (
        <video controls style={styles.video}>
          <source src={post.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {post.courseLink && (
        <a
          href={post.courseLink}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.courseLink}
          onMouseOver={(e) => (e.target.style.color = '#2980b9')}
          onMouseOut={(e) => (e.target.style.color = '#3498db')}
        >
          View Course
        </a>
      )}
      <p style={styles.role}>Posted as: {post.role || 'N/A'}</p>
      {post.userId === currentUserId && (
        <div style={styles.buttonContainer}>
          <button
            style={styles.updateButton}
            onClick={() => setShowUpdatePostPopup(post.id)}
          >
            Update
          </button>
          <button
            style={styles.deleteButton}
            onClick={() => handleDelete(post.id)}
          >
            Delete
          </button>
        </div>
      )}
      <div style={styles.likeContainer}>
        <button
          style={post.likes?.includes(currentUserId) ? styles.unlikeButton : styles.likeButton}
          onClick={() => handleToggleLike(post.id, post.likes?.includes(currentUserId))}
        >
          {post.likes?.includes(currentUserId) ? 'Unlike' : 'Like'}
        </button>
        <span style={styles.likeCount}>
          {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
        </span>
      </div>
      {renderCommentSection(post.id)}
    </div>
  );

  // Handle delete
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId));
      setSuccess('Post deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  // Handle like/unlike
  const handleToggleLike = async (postId, isLiked) => {
    try {
      const endpoint = isLiked
        ? `http://localhost:8080/api/posts/${postId}/unlike`
        : `http://localhost:8080/api/posts/${postId}/like`;
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.map((post) => (post.id === postId ? response.data : post)));
    } catch (err) {
      setError('Failed to toggle like.');
    }
  };

  // Comment section
  const renderCommentSection = (postId) => (
    <div style={styles.commentsContainer}>
      <h4 style={styles.commentHeader}>Comments</h4>
      {comments[postId]?.length > 0 ? (
        comments[postId].map((comment) => (
          <div key={comment.id} style={styles.comment}>
            {editComment[comment.id] ? (
              <>
                <input
                  type="text"
                  value={editComment[comment.id]}
                  onChange={(e) =>
                    setEditComment({ ...editComment, [comment.id]: e.target.value })
                  }
                  style={styles.commentInput}
                />
                <button
                  style={styles.commentButton}
                  onClick={() => handleUpdateComment(postId, comment.id)}
                >
                  Save
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => setEditComment({ ...editComment, [comment.id]: null })}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p style={styles.commentText}>{comment.content}</p>
                <p style={styles.commentAuthor}>
                  By: {userDetails[comment.userId]?.username || 'Unknown'}
                </p>
                {comment.userId === currentUserId && (
                  <>
                    <button
                      style={styles.commentButton}
                      onClick={() => setEditComment({ ...editComment, [comment.id]: comment.content })}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteComment(postId, comment.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p style={styles.commentText}>No comments yet.</p>
      )}
      <input
        type="text"
        value={newComment[postId] || ''}
        onChange={(e) =>
          setNewComment({ ...newComment, [postId]: e.target.value })
        }
        style={styles.commentInput}
        placeholder="Add a comment..."
      />
      <button
        style={styles.commentButton}
        onClick={() => handleAddComment(postId)}
      >
        Comment
      </button>
    </div>
  );

  // Handle add comment
  const handleAddComment = async (postId) => {
    if (!newComment[postId]?.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8080/api/comments/create',
        { postId, content: newComment[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), response.data],
      });
      setNewComment({ ...newComment, [postId]: '' });
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  // Handle update comment
  const handleUpdateComment = async (postId, commentId) => {
    if (!editComment[commentId]?.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/comments/update/${commentId}`,
        { content: editComment[commentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments({
        ...comments,
        [postId]: comments[postId].map((c) =>
          c.id === commentId ? response.data : c
        ),
      });
      setEditComment({ ...editComment, [commentId]: null });
    } catch (err) {
      setError('Failed to update comment.');
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/comments/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments({
        ...comments,
        [postId]: comments[postId].filter((c) => c.id !== commentId),
      });
    } catch (err) {
      setError('Failed to delete comment.');
    }
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh',
    },
    header: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '30px',
      textAlign: 'center',
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    tabButton: {
      padding: '10px 20px',
      fontSize: '16px',
      color: '#34495e',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
    },
    activeTabButton: {
      color: '#3498db',
      borderBottom: '2px solid #3498db',
    },
    postCard: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s, transform 0.3s',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#34495e',
      marginBottom: '10px',
    },
    description: {
      color: '#7f8c8d',
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '15px',
    },
    imageContainer: {
      position: 'relative',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '300px',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '5px',
      border: '1px solid #ecf0f1',
    },
    prevButton: {
      position: 'absolute',
      left: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    nextButton: {
      position: 'absolute',
      right: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    video: {
      width: '100%',
      maxHeight: '250px',
      borderRadius: '5px',
      marginBottom: '15px',
    },
    courseLink: {
      color: '#3498db',
      fontSize: '14px',
      textDecoration: 'underline',
      display: 'inline-block',
      marginBottom: '10px',
    },
    role: {
      color: '#95a5a6',
      fontSize: '12px',
      fontStyle: 'italic',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px',
    },
    updateButton: {
      padding: '8px 16px',
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '8px 16px',
      backgroundColor: '#e74c3c',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    likeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '10px 0',
    },
    likeButton: {
      padding: '8px 16px',
      backgroundColor: '#ff6b6b',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    unlikeButton: {
      padding: '8px 16px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    likeCount: {
      fontSize: '14px',
      color: '#34495e',
    },
    commentsContainer: {
      marginTop: '20px',
      padding: '10px',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
    },
    commentHeader: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '10px',
    },
    comment: {
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '5px',
    },
    commentText: {
      fontSize: '14px',
      color: '#333',
    },
    commentAuthor: {
      fontSize: '12px',
      color: '#95a5a6',
    },
    commentInput: {
      width: '100%',
      padding: '8px',
      margin: '10px 0',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
    },
    commentButton: {
      padding: '8px 16px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    error: {
      color: '#e74c3c',
      textAlign: 'center',
      margin: '20px 0',
    },
    success: {
      color: '#28a745',
      textAlign: 'center',
      margin: '20px 0',
    },
    noPosts: {
      color: '#95a5a6',
      fontSize: '18px',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    spinner: {
      border: '4px solid #e0e0e0',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
    },
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.header}>Posts</h1>
        <div style={styles.tabContainer}>
          {['all', 'student', 'instructor'].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tabButton,
                ...(activeSlide === tab ? styles.activeTabButton : {}),
              }}
              onClick={() => setActiveSlide(tab)}
            >
              {tab === 'all' ? 'All Posts' : tab === 'student' ? 'Student Posts' : 'Instructor Posts'}
            </button>
          ))}
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        {filteredPosts().length === 0 ? (
          <p style={styles.noPosts}>
            {activeSlide === 'student'
              ? 'No student posts available.'
              : activeSlide === 'instructor'
              ? 'No instructor posts available.'
              : 'No posts available.'}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {filteredPosts().map(renderPost)}
          </div>
        )}
        <button
          style={styles.commentButton}
          onClick={() => setShowCreatePostPopup(true)}
        >
          Create Post
        </button>
        {showCreatePostPopup && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreatePost
              onClose={() => setShowCreatePostPopup(false)}
              onPostCreated={() => {
                setShowCreatePostPopup(false);
                // Re-fetch posts after creation
                const fetchPosts = async () => {
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
                    setError('Failed to load posts.');
                  }
                };
                fetchPosts();
              }}
            />
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