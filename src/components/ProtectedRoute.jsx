import { Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext)

    if (loading) return null // or spinner

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminRoute