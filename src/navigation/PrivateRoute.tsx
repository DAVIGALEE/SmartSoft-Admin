import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('PrivateRoute must be used within an AuthProvider');
    }

    const { isAuthenticated } = authContext;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export { PrivateRoute };
