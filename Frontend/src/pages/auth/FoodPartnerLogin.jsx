import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function FoodPartnerLogin(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
        email, password
      }, { withCredentials:true })

      console.log(response.data)
      navigate("/create-food")
    } catch(err){
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
          <h3 className="auth-title">Food Partner Login</h3>
          <p className="auth-desc">Sign in to manage listings</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Business email</label>
            <input
              name="email"
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">Sign in</button>
            <Link to="/food-partner/register" className="btn btn-ghost">Register</Link>
          </div>

          <div className="small-links">
            <Link to="/user/login" className="anchor">User login</Link>
            <a href="#" className="anchor">Need help?</a>
          </div>
        </form>
      </div>
    </div>
  )
}
