import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="h-screen w-screen flex bg-gray-200">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
