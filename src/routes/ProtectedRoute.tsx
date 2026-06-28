import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { accessToken, loading } = useAuth();

    if (loading) return null;
    if (!accessToken) return <Navigate to="/" replace />;

    return <>{children}</>;
}
