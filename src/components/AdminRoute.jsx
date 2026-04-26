import { Navigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'

const AdminRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth()
    const { user } = useUser()

    // still loading Clerk
    if (!isLoaded) return null

    // not logged in
    if (!isSignedIn) {
        return <Navigate to="/login" replace />
    }

    // check role from Clerk metadata
    const role = user?.publicMetadata?.role

    // not admin
    if (role !== 'admin') {
        return <Navigate to="/" replace />
    }

    // admin allowed
    return children
}

export default AdminRoute