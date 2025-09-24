import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
import "../../styles/CreateFood.css";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function CreateFood() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setMessage("Please select a valid video file.");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setMessage("Video file size must be less than 100MB.");
        return;
      }
      setVideo(file);
      setPreview(URL.createObjectURL(file));
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !video) {
      setMessage("Name and video are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("video", video);

    setLoading(true);
    setMessage("");
    try {
      const res = await axiosInstance.post("/api/food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Food item created successfully!");
      navigate("/"); // Redirect to reel/home page after success
    } catch (err) {
      console.error(err);
      setMessage("Failed to create food. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-food-container">
      <div className="create-food-card">
        <AiOutlineArrowLeft
          className="back-icon"
          onClick={() => navigate("/")} // navigate to reel/home page
        />
        <h2 className="title">Create New Food Item</h2>

        {message && <p className="message">{message}</p>}

        <form className="create-food-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="form-group video-upload">
            <label>
              Video <span className="required">*</span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              required
            />
            {preview && (
              <div className="video-preview">
                <video src={preview} controls width="100%" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "Create Food"}
          </button>
        </form>
      </div>
    </div>
  );
}
