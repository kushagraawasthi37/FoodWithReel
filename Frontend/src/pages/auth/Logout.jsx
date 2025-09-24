import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js"; // adjust path as needed
import { useState } from "react";

function LogoutButton() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      // Optional: notify backend logout (no token invalidation by default)
      await axiosInstance.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout properly");
    }
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Optionally clear user state if you have context or state management
    // setUser(null);
    // Redirect to login page
    navigate("/user/login");
  };

  return (
    <>
      {error && <div className="error">{error}</div>}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default LogoutButton;
