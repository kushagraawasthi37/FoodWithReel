import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/OwnerVideoPage.css";

// <-- Replace with your deployed backend URL -->
const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function OwnerVideoPage() {
  const { ownerId } = useParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchOwnerVideos = async () => {
      const token = localStorage.getItem("token"); // Bearer token
      if (!token) {
        setLoading(false);
        console.error("User not authenticated");
        return;
      }

      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/food/owner-food/${ownerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
      { threshold: 0.9 }
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));

    return () => {
      videoRefs.current.forEach((v) => v && observer.unobserve(v));
    };
  }, [videos]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!videos.length) return <div className="no-videos">No videos found.</div>;

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
