import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const courseId = getQueryParam("courseId");
    console.log(courseId)
    const token = localStorage.getItem("token");

    if (!courseId || !token) {
      setError("Missing course ID or token");
      setLoading(false);
      return;
    }

    const updateUser = async () => {
      try {
        // Fetch current user data (needed to avoid overwriting)
        const res = await axios.get("http://localhost:8080/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentUser = res.data;

        // Prevent duplicate courseId if already purchased
        const updatedCourses = currentUser.purchasedCourses?.includes(courseId)
          ? currentUser.purchasedCourses
          : [...(currentUser.purchasedCourses || []), courseId];

        const updatedUser = {
          ...currentUser,
          purchasedCourses: updatedCourses,
        };

        await axios.put("http://localhost:8080/user/update", updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoading(false);
        navigate("/my-courses"); // or wherever you want to send them after
      } catch (err) {
        console.error("Update failed", err);
        setError("Failed to update user with purchased course");
        setLoading(false);
      }
    };

    updateUser();
  }, [location]);

  if (loading) return <div>Updating your profile, please wait...</div>;
  if (error) return <div> {error}</div>;

  return <div>Payment successful! Redirecting to your courses...</div>;
};

export default PaymentSuccess;
