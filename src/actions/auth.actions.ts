import { api, ApiError } from '@/api/client';
import { AUTH_ENDPOINTS } from '@/api/endpoints';
import { LoginRequest, RegistrationRequest, User } from '@/api/types';
import { setAuthenticated, setUnauthenticated } from '@/services/auth.service';

export interface AuthActionResponse {
    success: boolean;
    message: string;
    user?: User;
}

const processAuthError = (error: ApiError): AuthActionResponse => {

    return {
        success: false,
        message: error.error || 'An unexpected error occurred'
    };
};

export const registerUser = async (
    userData: RegistrationRequest
): Promise<AuthActionResponse> => {
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
        return processAuthError(error as ApiError);
    }
};

export const loginUser = async (
    credentials: LoginRequest
): Promise<AuthActionResponse> => {
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
        return processAuthError(error as ApiError);
    }
};

export const logoutUser = async (): Promise<AuthActionResponse> => {
    try {
        await api.post(AUTH_ENDPOINTS.LOGOUT);
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
};