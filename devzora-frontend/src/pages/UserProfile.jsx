import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/course/userComponet/UserDetails.css'
import Dashboard from "../component/Dashboard";
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming JWT is stored here
        const response = await axios.get("http://localhost:8080/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not fetch user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <>
    <Dashboard>
    <div className="user-details-container">
        <div className="user-details-container-wrapper">
            <div className="user-image-wrapper">
        <img src={'https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg'} alt='image'  />
            </div>
        <div className="user-details-info-wrapper">
            <div className="user-detail-info">
                <label>Full Name </label>
                <div className="user-detail-info-value">{user.name}</div>
            </div>
            <div className="user-detail-info">
                <label>User Name</label>
                <div className="user-detail-info-value">{user.username}</div>
            </div>
            <div className="user-detail-info">
                <label>Email</label>
                <div className="user-detail-info-value">{user.email}</div>
            </div>
            <div className="user-detail-info">
                <label>Phone Number</label>
                <div className="user-detail-info-value">{user.phone}</div>
            </div>
            <div className="user-detail-info">
                <label>Type</label>
                <div className="user-detail-info-value">{user.roles.join(", ")}</div>
            </div>
            
        </div>
        </div>
    </div>
    </Dashboard>
    </>
    
  );
};

export default UserProfile;
