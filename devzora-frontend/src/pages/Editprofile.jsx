

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/course/userComponet/UserDetails.css";
import Dashboard from "../component/Dashboard";
import { FiUpload } from 'react-icons/fi';

const Editprofile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setFormData(response.data); // initialize edit state
      } catch (err) {
        console.error(err);
        setError("Could not fetch user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/images/upload",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = res.data;

      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: imageUrl,
      }));
    } catch (error) {
      console.error("Profile picture upload failed", error);
      alert("Profile picture upload failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8080/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
      setUser(formData);
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:8080/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Account deleted.");
      localStorage.removeItem("token");
      window.location.href = "/"; // redirect to homepage or login
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <Dashboard>
      <div className="user-details-container">
        <div className="user-details-container-wrapper">
          <div className="user-image-wrapper">
            <img
              src={formData.profilePictureUrl ? formData.profilePictureUrl : "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"}
              
              alt="Profile"
            />
            <label htmlFor="profile-upload" className="upload-btn-custom">
 <FiUpload style={{ color:'white' ,fontSize:'20px',marginRight:'10px'}} />  Upload
</label>
<input
  type="file"
  id="profile-upload"
  accept="image/*"
  onChange={handleProfilePictureUpload}
/>

          </div>

          <div className="user-details-info-wrapper">
            <div className="user-detail-info">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="user-detail-info-value">{user.name}</div>
              )}
            </div>

            <div className="user-detail-info">
              <label>User Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="user-detail-info-value">{user.username}</div>
              )}
            </div>

            <div className="user-detail-info">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="user-detail-info-value">{user.email}</div>
              )}
            </div>

            <div className="user-detail-info">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="user-detail-info-value">{user.phone}</div>
              )}
            </div>

            <div className="user-detail-info">
              <label>Type</label>
              <div className="user-detail-info-value">{user.roles.join(", ")}</div>
            </div>

            <div className="user-action-buttons">
              {isEditing ? (
                <>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)}>Edit</button>
              )}

              <button onClick={handleDelete} className="delete-btn">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Editprofile;
