export interface User {
    username: string;
    token: string;
    _id: string;
}

export interface RegistrationRequest {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface ApiError {
    message?: string;
    status?: number;
    error?: string;
}