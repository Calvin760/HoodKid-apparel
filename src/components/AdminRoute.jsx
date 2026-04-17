import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'))

    // not logged in
    if (!user) {
        console.log('not logged in')
        return <Navigate to="/login" replace />
    }

    // logged in but NOT admin
    if (user.role !== 'admin') {
        console.log('not admin')
        return <Navigate to="/" replace />
    }

    // admin allowed
    return children
}

export default AdminRoute