import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div style={{ backgroundColor: "aquamarine", paddingTop:"5px", padding: "5px" }}>
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}
export default DashLayout