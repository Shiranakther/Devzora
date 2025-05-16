import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Comments = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editComment, setEditComment] = useState({});
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({}); // Store usernames by userId
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.id);
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError('Failed to fetch current user. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    const fetchComments = async () => {
      if (!token) {
        setError('You must be logged in to view comments.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!postId) {
        setError('No post ID provided.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(response.data);

        // Fetch usernames for each unique userId
        const userIds = [...new Set(response.data.map(comment => comment.userId))];
        const userDetailsPromises = userIds.map(userId =>
          axios.get(`http://localhost:8080/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        const userDetailsResponses = await Promise.all(userDetailsPromises);
        const details = userDetailsResponses.reduce((acc, res) => {
          const user = res.data;
          acc[user.id] = { username: user.username };
          return acc;
        }, {});
        setUserDetails(details);
        setError('');
      } catch (err) {
        setError(
          err.response?.status === 401
            ? 'Unauthorized: Please log in again.'
            : err.response?.data?.message || `Error fetching comments: ${err.message}`
        );
        if (err.response?.status === 401) {
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    };

    if (token) {
      fetchCurrentUser();
      fetchComments();
    }
  }, [postId, navigate, token]);

  const handleAddComment = async () => {
    if (!token) {
      setError('You must be logged in to add a comment.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!newComment.trim()) {
      setError('Comment content cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/comments/create',
        { postId, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Fetch username for the new comment
      const userResponse = await axios.get(`http://localhost:8080/user/${response.data.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(prev => ({
        ...prev,
        [response.data.userId]: { username: userResponse.data.username },
      }));
      setComments([...comments, response.data]);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.data?.message || `Error adding comment: ${err.message}`
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  const handleUpdateComment = async (commentId) => {
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
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, content: response.data.content } : comment
        )
      );
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
          : err.response?.data?.message || `Error updating comment: ${err.message}`
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
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
      setComments(comments.filter((comment) => comment.id !== commentId));
      setError('');
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.status === 403
          ? 'You are not authorized to delete this comment.'
          : err.response?.data?.message || `Error deleting comment: ${err.message}`
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 border rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Comments for Post {postId || 'Unknown'}</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {comments.length === 0 && !error && (
        <p className="text-gray-600 text-center">No comments available.</p>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 p-3 mb-2 rounded border">
          {editComment[comment.id] ? (
            <div>
              <input
                type="text"
                value={editComment[comment.id]}
                onChange={(e) =>
                  setEditComment((prev) => ({
                    ...prev,
                    [comment.id]: e.target.value,
                  }))
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <button
                onClick={() => handleUpdateComment(comment.id)}
                className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded hover:bg-yellow-600 transition mr-2"
              >
                Save
              </button>
              <button
                onClick={() =>
                  setEditComment((prev) => {
                    const newEdit = { ...prev };
                    delete newEdit[comment.id];
                    return newEdit;
                  })
                }
                className="bg-red-500 text-white font-semibold py-1 px-3 rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-700">{comment.content}</p>
              <p className="text-gray-500 text-sm">
                Posted by: {userDetails[comment.userId]?.username || 'Unknown'}
              </p>
              {comment.userId === currentUserId && (
                <>
                  <button
                    onClick={() =>
                      setEditComment((prev) => ({
                        ...prev,
                        [comment.id]: comment.content,
                      }))
                    }
                    className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded hover:bg-yellow-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 text-white font-semibold py-1 px-3 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;