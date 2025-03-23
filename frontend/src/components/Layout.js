import React, { useState } from 'react';
import Sidebar from './Sidebar'
import Header from './Header'
// import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = ({projectsData, projectOwnersData, investorsData, transformProjectsData}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Add this line

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    // <div className='flex flex-row bg-neutral-100 w-[calc(100%-256px)] ml-64 min-h-screen' >
    <div className='flex flex-row bg-neutral-100 min-h-screen'>
      
      {/* <Sidebar projectsData={projectsData} projectOwnersData={projectOwnersData} investorsData={investorsData} transformProjectsData={transformProjectsData} /> */}
      <Sidebar 
        isOpen={isSidebarOpen} // Pass the state and the toggle function as props
        toggleSidebar={toggleSidebar}
      />
      {/* <div className='flex-1' >
        <Header /> */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-12'}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} /> 
        <div className='p-4 overflow-x-auto'>
          <Outlet />
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  )
}

export default Layout

// why can not push