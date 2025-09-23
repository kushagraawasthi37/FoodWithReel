import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AiOutlineComment, AiFillHeart, AiOutlineHeart, AiOutlineHome, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FaRegSadCry } from "react-icons/fa";
import "../../styles/reels.css";

export default function Saved() {
  const [savedVideos, setSavedVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState({});
  const [savedState, setSavedState] = useState({});
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Check auth
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/me", { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // Fetch saved videos
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food/save", { withCredentials: true })
      .then(res => {
        const saved = res.data.savedVideos || [];
        const liked = {};
        const savedMap = {};
        saved.forEach(v => {
          if (v.likedByMe) liked[v._id] = true;
          savedMap[v._id] = true;
        });
        setSavedVideos(saved);
        setLikedVideos(liked);
        setSavedState(savedMap);
      })
      .catch(err => console.error(err));
  }, []);

  // IntersectionObserver for auto-play
  useEffect(() => {
    if (!savedVideos.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target.querySelector("video");
          if (!video) return;
          entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
        });
      },
      { threshold: 0.9 }
    );

    const nodes = containerRef.current?.querySelectorAll(".reel");
    nodes?.forEach(n => observer.observe(n));

    return () => observer.disconnect();
  }, [savedVideos]);

  // Like toggle
  const toggleLike = async id => {
    if (!user) return navigate("/user/login");

    const currentlyLiked = likedVideos[id];
    setLikedVideos(prev => ({ ...prev, [id]: !currentlyLiked }));

    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: id },
        { withCredentials: true }
      );

      // Update UI based on backend response
      setLikedVideos(prev => ({ ...prev, [id]: res.data.liked }));
      setSavedVideos(prev =>
        prev.map(v =>
          v._id === id ? { ...v, likeCount: res.data.likes } : v
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Save/Unsave toggle
  const toggleSave = async id => {
    if (!user) return navigate("/user/login");

    const currentlySaved = savedState[id];
    setSavedState(prev => ({ ...prev, [id]: !currentlySaved }));
    setSavedVideos(prev => prev.filter(v => v._id !== id)); // remove if unsaved

    try {
      await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: id },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    navigate("/user/login");
  };

  // Go to comments
  const goToComments = foodId => navigate(`/food/${foodId}/comments`);

  const noSaved = savedVideos.length === 0;

  return (
    <>
      <div ref={containerRef} className="reels-container">
        {noSaved ? (
          <div className="no-saved improved">
            <FaRegSadCry size={60} color="#888" />
            <p>No saved videos yet</p>
            <small>Save your favorite videos and they’ll appear here!</small>
            <button onClick={() => navigate("/")}>Browse Home</button>
          </div>
        ) : (
          savedVideos.map(v => (
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
                  <span className="count">{v.likeCount ?? 0}</span>
                </div>

                <div className="action-block">
                  <button onClick={() => toggleSave(v._id)}>
                    {savedState[v._id] ? (
                      <BsBookmarkFill size={24} color="#4caf50" />
                    ) : (
                      <BsBookmark size={24} color="#fff" />
                    )}
                  </button>
                  <span className="count">{v.saveCount ?? 0}</span>
                </div>

                <div className="action-block">
                  <button onClick={() => goToComments(v._id)}>
                    <AiOutlineComment size={28} color="#fff" />
                  </button>
                  <span className="count">{v.commentCount ?? 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom navigation */}
      {!noSaved && (
        <div className="bottom-nav">
          <button onClick={() => navigate("/")} className="nav-btn">
            <AiOutlineHome />
            Home
          </button>
          {user ? (
            <button onClick={handleLogout} className="nav-btn auth-btn">
              <AiOutlineLogout />
              Logout
            </button>
          ) : (
            <button onClick={() => navigate("/user/login")} className="nav-btn auth-btn">
              <AiOutlineLogin />
              Login
            </button>
          )}
        </div>
      )}
    </>
  );
}
