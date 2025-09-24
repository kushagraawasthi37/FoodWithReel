import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
import "../../styles/OwnerVideoPage.css";

export default function OwnerVideoPage() {
  const { ownerId } = useParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchOwnerVideos = async () => {
      try {
        const res = await axiosInstance.get(`/api/food/owner-food/${ownerId}`);
        setVideos(res.data.foodItems || []);
      } catch (err) {
        console.error("Error fetching owner videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerVideos();
  }, [ownerId]);

  useEffect(() => {
    if (!videoRefs.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.9 } // ~90% visible
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));

    return () => {
      videoRefs.current.forEach((v) => v && observer.unobserve(v));
    };
  }, [videos]);

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (!loading && videos.length === 0) {
    return <div className="no-videos">No videos found.</div>;
  }

  return (
    <div className="owner-video-page">
      {/* Sticky Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="reel-container">
        {videos.map((video, i) => (
          <div key={video._id} className="reel-video-wrapper">
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={video.video}
              className="reel-video"
              muted
              playsInline
              controls={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
