import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='font-poppins'>
      <Navbar />
      <div className="h-screen w-full flex bg-gray-200">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
