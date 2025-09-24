import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../api/axiosInstance.js"
import { Link, useNavigate } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineLogout,
} from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import "../../styles/reels.css";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const containerRef = useRef(null);
  const [likedVideos, setLikedVideos] = useState({});
  const [savedVideos, setSavedVideos] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [savesCount, setSavesCount] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [user, setUser] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    axiosInstance
      .get("/api/auth/me") // removed withCredentials
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // Fetch videos
  useEffect(() => {
    axiosInstance
      .get("/api/food/foodItems") // removed withCredentials
      .then((res) => {
        const data = res.data.foodItems || [];
        const likes = {};
        const saves = {};
        const comments = {};
        const liked = {};
        const saved = {};

        data.forEach((v) => {
          likes[v._id] = v.likeCount ?? 0;
          saves[v._id] = v.saveCount ?? 0;
          comments[v._id] = v.commentCount ?? 0;
          if (v.likedByMe) liked[v._id] = true;
          if (v.savedByMe) saved[v._id] = true;
        });

        setVideos(data);
        setLikesCount(likes);
        setSavesCount(saves);
        setCommentsCount(comments);
        setLikedVideos(liked);
        setSavedVideos(saved);
      })
      .catch((err) => console.error(err));
  }, []);

  // Autoplay videos
  useEffect(() => {
    if (!videos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (!video) return;
          entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
        });
      },
      { threshold: 0.9 }
    );

    const nodes = containerRef.current?.querySelectorAll(".reel");
    nodes?.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [videos]);

  // Popup auto-hide
  useEffect(() => {
    if (!popupMessage) return;
    const timer = setTimeout(() => setPopupMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [popupMessage]);

  // Like toggle
  const toggleLike = async (id) => {
    if (!user) return setPopupMessage("Please login to like");
    const currentlyLiked = likedVideos[id];
    setLikedVideos((prev) => ({ ...prev, [id]: !currentlyLiked }));
    setLikesCount((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + (currentlyLiked ? -1 : 1),
    }));

    try {
      const res = await axiosInstance.post(
        "/api/food/like",
        { foodId: id }
        // { withCredentials: true }
      );
      setLikedVideos((prev) => ({ ...prev, [id]: res.data.liked }));
      setLikesCount((prev) => ({ ...prev, [id]: res.data.likes }));
    } catch (err) {
      console.error(err);
    }
  };

  // Save toggle
  const toggleSave = async (id) => {
    if (!user) return setPopupMessage("Please login to save");
    const currentlySaved = savedVideos[id];
    setSavedVideos((prev) => ({ ...prev, [id]: !currentlySaved }));
    setSavesCount((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + (currentlySaved ? -1 : 1),
    }));

    try {
      const res = await axiosInstance.post(
        "/api/food/save",
        { foodId: id }
        // { withCredentials: true }
      );
      setSavedVideos((prev) => ({ ...prev, [id]: res.data.saved }));
      setSavesCount((prev) => ({ ...prev, [id]: res.data.saves }));
    } catch (err) {
      console.error(err);
    }
  };

const logoutUser = async () => {
  try {
    // Optional: call backend logout if needed
    await axiosInstance.post("/api/auth/logout"); // no withCredentials
  } catch (err) {
    console.error(err);
  }
  // Remove token from localStorage to log out on client
  localStorage.removeItem("token");
  setUser(null);
  navigate("/user/login");
};

  const goToComments = (foodId) => navigate(`/food/${foodId}/comments`);

  const displayedVideos =
    activeTab === "saved" ? videos.filter((v) => savedVideos[v._id]) : videos;

  return (
    <>
      {/* Videos */}
      <div ref={containerRef} className="reels-container">
        {displayedVideos.length ? (
          displayedVideos.map((v) => (
            <div key={v._id} className="reel">
              <video src={v.video} muted playsInline loop />

              <div className="overlay">
                <div className="title-pill">{v.name}</div>
                <div className="desc">{v.description}</div>
                {v.foodPartner?._id && (
                  <Link className="visit-btn" to={`/food-partner/${v.foodPartner._id}`}>
                    Visit store
                  </Link>
                )}
              </div>

              <div className="video-actions-vertical">
                <div className="action-block">
                  <button onClick={() => toggleLike(v._id)}>
                    {likedVideos[v._id] ? (
                      <AiFillHeart size={28} color="#ff2d55" />
                    ) : (
                      <AiOutlineHeart size={28} color="#fff" />
                    )}
                  </button>
                  <span className="count">{likesCount[v._id]}</span>
                </div>

                <div className="action-block">
                  <button onClick={() => toggleSave(v._id)}>
                    {savedVideos[v._id] ? (
                      <BsBookmarkFill size={24} color="#4caf50" />
                    ) : (
                      <BsBookmark size={24} color="#fff" />
                    )}
                  </button>
                  <span className="count">{savesCount[v._id]}</span>
                </div>

                <div className="action-block">
                  <button onClick={() => goToComments(v._id)}>
                    <AiOutlineComment size={28} color="#fff" />
                  </button>
                  <span className="count">{commentsCount[v._id]}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#ccc", width: "100%" }}>
            No videos available.
          </p>
        )}
      </div>

      {/* Popup */}
      {popupMessage && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button
          className={activeTab === "home" ? "active" : ""}
          onClick={() => { navigate("/"); setActiveTab("home"); }}
        >
          <AiOutlineHome />
          Home
        </button>

        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => { navigate("/saved"); setActiveTab("saved"); }}
        >
          {savedVideos ? <BsBookmarkFill /> : <BsBookmark />}
          Saved
        </button>

        {user?.isFoodPartner && (
          <button
            className={activeTab === "create" ? "active" : ""}
            onClick={() => { navigate("/create-food"); setActiveTab("create"); }}
          >
            ➕ Create Food
          </button>
        )}

        {user ? (
          <button className="auth-btn" onClick={logoutUser}>
            <AiOutlineLogout />
            Logout
          </button>
        ) : (
          <button className="auth-btn" onClick={() => navigate("/user/login")}>
            <AiOutlineLogin />
            Login
          </button>
        )}
      </div>
    </>
  );
}
