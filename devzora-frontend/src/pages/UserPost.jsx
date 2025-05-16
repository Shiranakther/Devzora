import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from "../component/Dashboard";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [imageIndices, setImageIndices] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setError('Please log in to view your posts.');
        setLoading(false);
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.id);
      } catch (err) {
        setError('Failed to fetch user. Please log in again.');
        setLoading(false);
        navigate('/login');
      }
    };
    fetchCurrentUser();
  }, [navigate, token]);

  // Fetch user's own posts
  useEffect(() => {
    if (!currentUserId) return;

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter only posts by the current user
        const userPosts = response.data.filter(post => post.userId === currentUserId);
        setPosts(userPosts);
        // Initialize image indices
        const initialIndices = userPosts.reduce((acc, post) => {
          acc[post.id] = 0;
          return acc;
        }, {});
        setImageIndices(initialIndices);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your posts.');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchPosts();
  }, [currentUserId, token, navigate]);

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
    </div>
  );

  // Styles
  const styles = {
    container: {
      maxWidth: '800px',
      // margin: '0 auto',
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
    postCard: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s, transform 0.3s',
      marginBottom: '20px',
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
    error: {
      color: '#e74c3c',
      textAlign: 'center',
      margin: '20px 0',
      fontSize: '14px',
    },
    noPosts: {
      color: '#95a5a6',
      fontSize: '18px',
      textAlign: 'center',
      fontStyle: 'italic',
      margin: '40px 0',
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
    <Dashboard>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={styles.container}>
          <h1 style={styles.header}>My Posts</h1>
          {error && <p style={styles.error}>{error}</p>}
          {posts.length === 0 ? (
            <p style={styles.noPosts}>You haven't created any posts yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {posts.map(renderPost)}
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default UserPosts;