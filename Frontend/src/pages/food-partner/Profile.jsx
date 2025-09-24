import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
import { AiOutlineArrowLeft } from "react-icons/ai";
import "../../styles/ProfileUI.css";

function ProfileUI() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef([]);

  // Fetch profile and videos
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/api/food-partner/${id}`);
        const foodPartner = res.data.foodPartner;
        setProfile(foodPartner);
        setVideos(foodPartner?.foodItems || []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // IntersectionObserver to autoplay/pause videos
  useEffect(() => {
    if (!videoRefs.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((video) => video && observer.observe(video));

    return () => {
      videoRefs.current.forEach((video) => video && observer.unobserve(video));
    };
  }, [videos]);

  if (loading) return <div className="page">Loading profile...</div>;
  if (!loading && !profile) return <div className="page">Profile not found.</div>;

  return (
    <div className="page">
      {/* Back Button */}
      <div className="back-button" onClick={() => navigate("/")}>
        <AiOutlineArrowLeft size={24} />
        <span>Back</span>
      </div>

      {/* Profile Info */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="circle">
            <img src={profile.avatar} alt="Avatar" />
          </div>
          <h1 className="business-name">{profile.fullName}</h1>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <p className="label">Contact:</p>
            <p className="value">{profile.contactName}</p>
          </div>
          <div className="info-item">
            <p className="label">Phone:</p>
            <p className="value">{profile.phone}</p>
          </div>
          <div className="info-item">
            <p className="label">Email:</p>
            <p className="value">{profile.email}</p>
          </div>
          <div className="info-item">
            <p className="label">Address:</p>
            <p className="value">{profile.Address}</p>
          </div>
        </div>
      </div>

      {/* Reel Grid */}
      <div className="reel-grid">
        {videos.length ? (
          videos.map((video, i) => (
            <div
              key={i}
              className="reel-box"
              onClick={() => navigate(`/owner-video/${profile._id}/${video._id}`)}
            >
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={video.video}
                className="reel-video"
                muted
                loop
                playsInline
                controls={false}
              />
            </div>
          ))
        ) : (
          <p style={{ color: "#ccc", textAlign: "center", width: "100%" }}>
            No videos available.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileUI;
