import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js"
import { FiMoreVertical } from "react-icons/fi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import "../../styles/comment.css";

export default function CommentsPage() {
  const { foodId } = useParams();
  const navigate = useNavigate(); // for back button
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [showActionsId, setShowActionsId] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchComments();
  }, []);

  const fetchUser = () => {
    axiosInstance
      .get("/api/auth/me", { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  };

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/food/${foodId}/comments`
      );
      setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const postComment = async () => {
    if (!user) return alert("Login to post comment");
    if (!newComment.trim()) return;
    await axiosInstance.post(
      "/api/food/comment",
      { foodId, content: newComment },
      { withCredentials: true }
    );
    setNewComment("");
    fetchComments();
  };

  const startEdit = (id, content) => {
    setEditingId(id);
    setEditingContent(content);
    setShowActionsId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const saveEdit = async id => {
    if (!editingContent.trim()) return;
    await axiosInstance.put(
      `/api/food/comment/${id}`,
      { content: editingContent },
      { withCredentials: true }
    );
    setEditingId(null);
    setEditingContent("");
    fetchComments();
  };

  const deleteComment = async id => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    await axiosInstance.delete(
      `/api/food/comment/${id}`,
      { withCredentials: true }
    );
    fetchComments();
  };

  const toggleActions = id => {
    setShowActionsId(prev => (prev === id ? null : id));
  };

  const timeAgo = timestamp => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diff = Math.floor((now - commentTime) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const renderAvatar = user => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.fullName} className="avatar" />;
    }
    return (
      <div className="avatar-placeholder">
        {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
      </div>
    );
  };

  return (
    <div className="comments-page">
      {/* Back Button */}
      <div className="back-button" onClick={() => navigate("/")}>
        <AiOutlineArrowLeft size={24} />
        <span>Back</span>
      </div>

      <h2>Comments</h2>

      <div className="post-comment">
        <input
          type="text"
          value={newComment}
          placeholder="Write a comment..."
          onChange={e => setNewComment(e.target.value)}
        />
        <button onClick={postComment}>Post</button>
      </div>

      <div className="comments-list">
        {comments.map(c => (
          <div key={c._id} className="comment">
            <div className="comment-header">
              <div className="comment-user-info">
                {renderAvatar(c.user)}
                <div>
                  <span className="user-fullname">
                    {c.user.fullName || c.user.name || "Unknown User"}
                  </span>
                  <div className="timestamp">{timeAgo(c.createdAt)}</div>
                </div>
              </div>

              {/* Only owner sees the 3 dots */}
              {user && user._id === c.user._id && (
                <div className="comment-actions">
                  <FiMoreVertical
                    className="more-icon"
                    onClick={() => toggleActions(c._id)}
                  />
                  {showActionsId === c._id && (
                    <div className="menu-buttons">
                      <button onClick={() => startEdit(c._id, c.content)}>Edit</button>
                      <button onClick={() => deleteComment(c._id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {editingId === c._id ? (
              <div className="comment-edit">
                <input
                  type="text"
                  value={editingContent}
                  onChange={e => setEditingContent(e.target.value)}
                />
                <button onClick={() => saveEdit(c._id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <p>{c.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
