// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FollowList = ({ userId, onClose, token }) => {
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [activeTab, setActiveTab] = useState('followers');
//   const [error, setError] = useState('');

//   // Fetch followers and following
//   useEffect(() => {
//     const fetchFollowData = async () => {
//       try {
//         const followersResponse = await axios.get(`http://localhost:8080/user/${userId}/followers`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const followingResponse = await axios.get(`http://localhost:8080/user/${userId}/following`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setFollowers(followersResponse.data);
//         setFollowing(followingResponse.data);
//       } catch (err) {
//         setError('Error fetching follow data: ' + (err.response?.data || err.message));
//       }
//     };
//     fetchFollowData();
//   }, [userId, token]);

//   const styles = {
//     overlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 1000,
//     },
//     container: {
//       backgroundColor: '#fff',
//       borderRadius: '8px',
//       padding: '20px',
//       maxWidth: '500px',
//       width: '90%',
//       maxHeight: '70vh',
//       overflowY: 'auto',
//       boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
//     },
//     header: {
//       fontSize: '24px',
//       fontWeight: '700',
//       color: '#2c3e50',
//       marginBottom: '15px',
//       textAlign: 'center',
//     },
//     tabContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       marginBottom: '15px',
//     },
//     tabButton: {
//       padding: '8px 16px',
//       fontSize: '16px',
//       fontWeight: '600',
//       color: '#34495e',
//       backgroundColor: 'transparent',
//       border: 'none',
//       cursor: 'pointer',
//       transition: 'color 0.3s',
//     },
//     activeTabButton: {
//       color: '#007bff',
//       borderBottom: '2px solid #007bff',
//     },
//     list: {
//       listStyle: 'none',
//       padding: 0,
//     },
//     listItem: {
//       padding: '10px',
//       borderBottom: '1px solid #e0e0e0',
//       fontSize: '14px',
//       color: '#34495e',
//     },
//     closeButton: {
//       padding: '8px 16px',
//       fontWeight: '600',
//       color: '#fff',
//       backgroundColor: '#6c757d',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       transition: 'background-color 0.3s',
//       marginTop: '15px',
//       width: '100%',
//     },
//     error: {
//       color: '#e74c3c',
//       fontSize: '14px',
//       textAlign: 'center',
//       margin: '10px 0',
//     },
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.container}>
//         <h2 style={styles.header}>Follow List</h2>
//         {error && <p style={styles.error}>{error}</p>}
//         <div style={styles.tabContainer}>
//           <button
//             style={{
//               ...styles.tabButton,
//               ...(activeTab === 'followers' ? styles.activeTabButton : {}),
//             }}
//             onClick={() => setActiveTab('followers')}
//             onMouseOver={(e) => (e.target.style.color = activeTab !== 'followers' ? '#0056b3' : '#007bff')}
//             onMouseOut={(e) => (e.target.style.color = activeTab !== 'followers' ? '#34495e' : '#007bff')}
//           >
//             Followers ({followers.length})
//           </button>
//           <button
//             style={{
//               ...styles.tabButton,
//               ...(activeTab === 'following' ? styles.activeTabButton : {}),
//             }}
//             onClick={() => setActiveTab('following')}
//             onMouseOver={(e) => (e.target.style.color = activeTab !== 'following' ? '#0056b3' : '#007bff')}
//             onMouseOut={(e) => (e.target.style.color = activeTab !== 'following' ? '#34495e' : '#007bff')}
//           >
//             Following ({following.length})
//           </button>
//         </div>
//         <ul style={styles.list}>
//           {(activeTab === 'followers' ? followers : following).map((user) => (
//             <li key={user.id} style={styles.listItem}>
//               {user.username} ({user.roles.join(', ') || 'N/A'})
//             </li>
//           ))}
//           {(activeTab === 'followers' && followers.length === 0) ||
//           (activeTab === 'following' && following.length === 0) ? (
//             <li style={styles.listItem}>No {activeTab} found.</li>
//           ) : null}
//         </ul>
//         <button
//           style={styles.closeButton}
//           onClick={onClose}
//           onMouseOver={(e) => (e.target.style.backgroundColor = '#5a6268')}
//           onMouseOut={(e) => (e.target.style.backgroundColor = '#6c757d')}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FollowList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowList = ({ userId, onClose, token }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('followers');
  const [error, setError] = useState('');

  // Fetch followers and following
  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const followersResponse = await axios.get(`http://localhost:8080/user/${userId}/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const followingResponse = await axios.get(`http://localhost:8080/user/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowers(followersResponse.data);
        setFollowing(followingResponse.data);
      } catch (err) {
        setError('Error fetching follow data: ' + (err.response?.data || err.message));
      }
    };
    fetchFollowData();
  }, [userId, token]);

  const styles = {
    overlay: {
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
    },
    container: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '70vh',
      overflowY: 'auto',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    header: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '15px',
      textAlign: 'center',
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '15px',
    },
    tabButton: {
      padding: '8px 16px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#34495e',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s',
    },
    activeTabButton: {
      color: '#007bff',
      borderBottom: '2px solid #007bff',
    },
    list: {
      listStyle: 'none',
      padding: 0,
    },
    listItem: {
      padding: '10px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '14px',
      color: '#34495e',
    },
    closeButton: {
      padding: '8px 16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#6c757d',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '15px',
      width: '100%',
    },
    error: {
      color: '#e74c3c',
      fontSize: '14px',
      textAlign: 'center',
      margin: '10px 0',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2 style={styles.header}>Follow List</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'followers' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab('followers')}
            onMouseOver={(e) => (e.target.style.color = activeTab !== 'followers' ? '#0056b3' : '#007bff')}
            onMouseOut={(e) => (e.target.style.color = activeTab !== 'followers' ? '#34495e' : '#007bff')}
          >
            Followers ({followers.length})
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'following' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab('following')}
            onMouseOver={(e) => (e.target.style.color = activeTab !== 'following' ? '#0056b3' : '#007bff')}
            onMouseOut={(e) => (e.target.style.color = activeTab !== 'following' ? '#34495e' : '#007bff')}
          >
            Following ({following.length})
          </button>
        </div>
        <ul style={styles.list}>
          {(activeTab === 'followers' ? followers : following).map((user) => (
            <li key={user.id} style={styles.listItem}>
              {user.username} ({user.roles.join(', ') || 'N/A'})
            </li>
          ))}
          {(activeTab === 'followers' && followers.length === 0) ||
          (activeTab === 'following' && following.length === 0) ? (
            <li style={styles.listItem}>No {activeTab} found.</li>
          ) : null}
        </ul>
        <button
          style={styles.closeButton}
          onClick={onClose}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#5a6268')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#6c757d')}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FollowList;