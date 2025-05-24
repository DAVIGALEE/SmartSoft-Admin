import { User } from '@/api/types';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const setAuthenticated = (user: User): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, user.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify({
        username: user.username,
        _id: user._id
    }));
};

export const setUnauthenticated = (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token && token.trim() !== '';
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getCurrentUser = (): Partial<User> | null => {
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error('Error parsing user data from storage:', error);
        return null;
    }
};