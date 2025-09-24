import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from "../../api/axiosInstance.js"
import { useNavigate } from 'react-router-dom'

export default function UserLogin(){
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    try {
      const response = await axiosInstance.post("/api/auth/user/login", {
        email, password
      }
      // { 
      //   withCredentials: true//Cokkie ka use nahi kr rhe hai na
      // }
    );

    // Save JWT token in localStorage for authentication
    localStorage.setItem("token", response.data.token);
    
    // Optionally store user info if returned
    // setUser(response.data.user);

      console.log(response.data)
      navigate("/") // Redirect to home after login
    } catch(err) {
      const msg = err.response?.data?.message || "Something went wrong"
      setError(msg)
      setTimeout(() => setError(''), 3000) // auto-hide after 3 sec
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {error && <div className="popup-error">{error}</div>}

        <div className="auth-header">
          <h3 className="auth-title">User Login</h3>
          <p className="auth-desc">Sign in to your account</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">Sign in</button>
            <Link to="/user/register" className="btn btn-ghost">Register</Link>
          </div>

          <div className="small-links">
            <Link to="/food-partner/login" className="anchor">Partner login</Link>
            <a href="#" className="anchor">Forgot?</a>
          </div>

          <div className="simple-footer">You can also sign in with Google / Apple later</div>
        </form>
      </div>
    </div>
  )
}
