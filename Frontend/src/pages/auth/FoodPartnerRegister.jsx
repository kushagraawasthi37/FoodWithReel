import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Replace with your deployed backend URL
const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function FoodPartnerRegister() {
  const navigate = useNavigate();
  const [fullName, setFullname] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("contactName", contactName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("Address", Address);
      if (avatar) formData.append("avatar", avatar);

      const res = await axios.post(
        `${BACKEND_URL}/api/auth/food-partner/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Save JWT to localStorage for Bearer auth
      localStorage.setItem("token", res.data.token);

      console.log(res.data);
      navigate("/create-food"); // Redirect after signup
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      setTimeout(() => setError(""), 3000);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {error && <div className="popup-error">{error}</div>}

        <div className="auth-header">
          <h3 className="auth-title">Partner Signup</h3>
          <p className="auth-desc">For restaurants & food partners</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Owner / Contact</label>
            <input
              name="fullName"
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Business name</label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Restaurant or brand"
              required
            />
          </div>

          <div className="form-group">
            <label>Business email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="partner@business.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone number</label>
            <input
              name="phone"
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="123-456-7890"
              required
            />
          </div>

          <div className="form-group">
            <label>Business address</label>
            <input
              name="Address"
              id="Address"
              type="text"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street, City, Country"
              required
            />
          </div>

          <div className="form-group">
            <label>Avatar (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Create account
            </button>
            <Link to="/food-partner/login" className="btn btn-ghost">
              Sign in
            </Link>
          </div>

          <div className="simple-footer">
            We will verify your business after signup. (Demo UI)
          </div>
        </form>
      </div>
    </div>
  );
}
