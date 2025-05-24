import { useContext, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { isAuthenticated } from '@/services/auth.service';

export const useAuth = (options?: {
    requireAuth?: boolean;
    redirectTo?: string;
    redirectIfFound?: boolean;
}) => {
    const router = useRouter();
    const auth = useContext(AuthContext);
    const { requireAuth, redirectTo, redirectIfFound } = options || {};

    const checkAuth = useCallback(() => {
        if (requireAuth && !isAuthenticated() && redirectTo) {
            router.push(redirectTo);
            return false;
        }

        if (redirectIfFound && isAuthenticated() && redirectTo) {
            router.push(redirectTo);
            return false;
        }

        return true;
    }, [requireAuth, redirectIfFound, redirectTo, router]);

    useEffect(() => {
        if (!auth?.isLoading) {
            checkAuth();
        }
    }, [auth?.isLoading, checkAuth, router.pathname]);

    return {
        ...auth,
        verifyAuth: checkAuth
    };
};

export default useAuth;