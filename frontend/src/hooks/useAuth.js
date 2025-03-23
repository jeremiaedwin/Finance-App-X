import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'
// import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = "Employee"

    // tambahan access roles control
    let isSdgFinHubCurator = false

    if (token) {
        const decoded = jwtDecode(token)
        const { username, displayname, roles } = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        isSdgFinHubCurator = roles.includes('SDG Financing Hub Curator')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"

        return { username, displayname, roles, status, isManager, isAdmin, isSdgFinHubCurator }
    }

    return { username: '', roles: [], isManager, isAdmin, status, isSdgFinHubCurator }
}
export default useAuth