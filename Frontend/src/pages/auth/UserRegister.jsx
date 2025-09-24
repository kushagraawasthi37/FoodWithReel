import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from "../../api/axiosInstance.js"
import { useNavigate } from 'react-router-dom'

export default function UserRegister(){
  const navigate = useNavigate()
  const [fullName, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    try {
      const response = await axiosInstance.post("/api/auth/user/register", {
        fullName, email, password
      }
      //  { withCredentials:true }//Cookie use nhi kar rhe ye cookie ko aage send krta hai
      )


      // Save JWT token after registration
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    // Optionally store user info if returned
    // setUser(response.data.user);

      console.log(response.data)
      navigate('/')
    } catch(err) {
      const msg = err.response?.data?.message || "Something went wrong"
      setError(msg)
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {error && <div className="popup-error">{error}</div>}

        <div className="auth-header">
          <h3 className="auth-title">Create account</h3>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input
              id='fullName'
              type="text"
              value={fullName}
              name="fullName"
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

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
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">Create account</button>
            <Link to="/user/login" className="btn btn-ghost">Sign in</Link>
          </div>

          <div className="simple-footer">By continuing you agree to terms. (Demo UI)</div>
        </form>
      </div>
    </div>
  )
}
