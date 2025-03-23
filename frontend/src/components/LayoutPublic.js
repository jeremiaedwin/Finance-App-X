import React from 'react'
import { Outlet } from 'react-router-dom'
import PublicHeader from './PublicHeader'
import PublicFooter3 from './PublicFooter3'

const LayoutPublic = ({companyProfileContent}) => {
  return (
    <div>
        {/* <PublicHeader companyProfileContent={companyProfileContent} /> */}
        <Outlet />
        {/* <PublicFooter3 /> */}
    </div>
  )
}

export default LayoutPublic