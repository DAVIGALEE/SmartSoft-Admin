import { useContext, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { isAuthenticated } from '@/services/auth.service';

interface PrivateRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
}

const PrivateRoute = ({ children, fallback }: PrivateRouteProps) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        throw new Error('PrivateRoute must be used within an AuthProvider');
    }

    const { isLoading } = authContext;

    if (isLoading) {
        return fallback || <div>Loading...</div>;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export { PrivateRoute };