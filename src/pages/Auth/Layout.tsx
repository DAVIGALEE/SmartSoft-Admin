import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {isAuthenticated} from "@/services/auth.service.ts";


export const AuthLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const authRoutes = ['/login', '/register'];

    useEffect(() => {
        const currentPath = location.pathname;
        const isAuthRoute = authRoutes.includes(currentPath);

        if (isAuthenticated() && isAuthRoute) {
            navigate('/captions', { replace: true });
        }
    }, [location.pathname, navigate, isAuthenticated]);

    return <Outlet />;
};