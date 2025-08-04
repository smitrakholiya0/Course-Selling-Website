import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom"
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import { Toaster } from 'react-hot-toast';
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import AdminLogin from './admin/AdminLogin'
import CourseCreate from './admin/CourseCreate'
import Dashboard from './admin/Dashboard'
import OurCourse from './admin/OurCourse'
import UpdateCourse from './admin/UpdateCourse'
import AdminSignup from './admin/AdminSignUp'

const App = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* othor routers */}
        <Route path='/courses' element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route path="/purchases" element={user?<Purchases />: <Navigate to={"/login"}/>} />


        {/* admin routers */}
        <Route path="/admin/signup" element={<AdminSignup/>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={admin?<Dashboard />:<Navigate to={"/admin/login"}/>} />
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/our-courses" element={<OurCourse />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
      </Routes>
      <Toaster />
    </div>
  )
}
  
export default App
