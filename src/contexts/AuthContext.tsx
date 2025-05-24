import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/api/types';
import { isAuthenticated, getCurrentUser } from '@/services/auth.service';
import { LoginRequest, RegistrationRequest } from '@/api/types';
import {
    AuthActionResponse,
    loginUser,
    logoutUser,
    registerUser
} from "@/actions/auth.actions";


interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
}

interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<AuthActionResponse>;
    register: (userData: RegistrationRequest) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        isLoading: true,
        isAuthenticated: false,
        user: null,
        error: null
    });

    useEffect(() => {
        const initAuth = () => {
            if (isAuthenticated()) {
                const storedUser = getCurrentUser();
                if (storedUser) {
                    setState({
                        user: storedUser as User,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                    return;
                }
            }
            setState(prev => ({ ...prev, isLoading: false }));
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequest): Promise<AuthActionResponse> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await loginUser(credentials);

            if (response.success && response.user) {
                setState({
                    isLoading: false,
                    isAuthenticated: true,
                    user: response.user,
                    error: null
                });
            } else {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: response.message
                }));
            }

            return response;
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = 'Login failed. Please try again.';
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }));

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const register = async (userData: RegistrationRequest): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await registerUser(userData);

            if (response.success && response.user) {
                setState({
                    isLoading: false,
                    isAuthenticated: true,
                    user: response.user,
                    error: null
                });
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: response.message || 'Registration failed'
                }));
                return false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Registration failed. Please try again.'
            }));
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            await logoutUser();
        } catch (error) {
            console.error('Error during logout:', error);
        }

        setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: null
        });
    };

    const clearError = (): void => {
        setState(prev => ({ ...prev, error: null }));
    };

    const contextValue: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export { AuthContext };