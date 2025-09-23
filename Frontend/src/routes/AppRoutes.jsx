import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import Home from '../pages/general/Home'
import CreateFood from "../pages/food-partner/CreateFoodPartner"
import ProfileUI from '../pages/food-partner/Profile'
import Saved from '../pages/general/Saved'
import CommentsPage from '../pages/general/CommentsPage'
import OwnerVideoPage from '../pages/food-partner/OwnerVideoPage'







export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/login" element={<UserLogin/>} />
        <Route path="/user/register" element={<UserRegister/>} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin/>} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister/>} />
        <Route path="/" element={<Home/>} />
         <Route path="/saved" element={<Saved />} />
        <Route path='/create-food' element={<CreateFood/>}/>
        <Route path='/food-partner/:id' element={<ProfileUI/>}/>
        <Route path='/food/:foodId/comments' element={<CommentsPage/>}/>
        <Route path="/owner-video/:ownerId/:videoId"element={<OwnerVideoPage />}/>
                {/* Fallback for 404 */}
        <Route path="*" element={<div style={{ textAlign: "center", marginTop: 50 }}>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
    
  )
}