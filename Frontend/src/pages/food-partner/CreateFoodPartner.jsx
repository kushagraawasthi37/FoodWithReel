import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/CreateFood.css";
import { AiOutlineArrowLeft } from "react-icons/ai";

// <-- Replace with your deployed backend URL -->
const BACKEND_URL = import.meta.env.VITE_API_URL;

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
      setVideo(file);
      setPreview(URL.createObjectURL(file));
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
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/food`,
        formData,
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-food-container">
      <div className="create-food-card">
        <AiOutlineArrowLeft
          className="back-icon"
          onClick={() => navigate(-1)}
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
