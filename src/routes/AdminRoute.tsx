import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminRoute() {
    const { loading, user } = useAuth()

    if (loading) {
        return null
    }

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
