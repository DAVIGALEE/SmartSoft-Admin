import { api, ApiError } from '@/api/client';
import { AUTH_ENDPOINTS } from '@/api/endpoints';
import { LoginRequest, RegistrationRequest, User } from '@/api/types';
import { setAuthenticated, setUnauthenticated } from '@/services/auth.service';

export interface AuthActionResponse {
    success: boolean;
    message: string;
    user?: User;
}

class AuthActions {
    private processAuthError(error: ApiError): AuthActionResponse {
        return {
            success: false,
            message: error.error || 'An unexpected error occurred'
        };
    }

    async registerUser(userData: RegistrationRequest): Promise<AuthActionResponse> {
        try {
            const requestData = {
                username: userData.username,
                password: userData.password,
                confirm_password: userData.password,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName
            };

            const data = await api.post<User>(AUTH_ENDPOINTS.REGISTER, requestData);
            const user: User = {
                username: data.username,
                token: data.token,
                _id: data._id
            };

            setAuthenticated(user);

            return {
                success: true,
                message: 'Registration successful! Welcome to our platform.',
                user: user
            };
        } catch (error) {
            return this.processAuthError(error as ApiError);
        }
    }

    async loginUser(credentials: LoginRequest): Promise<AuthActionResponse> {
        try {
            const data = await api.post<User>(AUTH_ENDPOINTS.LOGIN, credentials);

            const user: User = {
                username: data.username,
                token: data.token,
                _id: data._id
            };

            setAuthenticated(user);

            return {
                success: true,
                message: 'Login successful! Welcome back.',
                user: user
            };
        } catch (error) {
            console.log('Login error:', error);
            return this.processAuthError(error as ApiError);
        }
    }

    async logoutUser(): Promise<AuthActionResponse> {
        try {
            setUnauthenticated();
            return {
                success: true,
                message: 'You have been successfully logged out.'
            };
        } catch (error) {
            console.error('Logout error:', error);
            setUnauthenticated();

            return {
                success: true,
                message: 'You have been logged out.'
            };
        }
    }
}

export const authActions = new AuthActions();