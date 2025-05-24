import {getAuthToken} from '@/services/auth.service';
import {ApiError} from '@/api/types';
import {API_BASE_URL} from "@/api/endpoints.ts";


async function handleResponse<T>(response: Response): Promise<T> {
    const data =  await response.json()
    if (!response.ok) {
        throw {
            status: response.status,
            message: data.message,
            error: data.error,
        };
    }

    return data as T;
}

function createRequestOptions(
    method: string,
    data?: unknown,
    customHeaders?: Record<string, string>
): RequestInit {
    const token = getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...customHeaders
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers,
        credentials: 'include'
    };

    if (method !== 'GET' && data !== undefined) {
        options.body = JSON.stringify(data);
    }

    return options;
}

export const api = {
    async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        const options = createRequestOptions('GET', undefined, headers);
        const response = await fetch(fullUrl, options);
        return handleResponse<T>(response);
    },

    async post<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        const options = createRequestOptions('POST', data, headers);
        const response = await fetch(fullUrl, options);
        return handleResponse<T>(response);
    },

    async put<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        const options = createRequestOptions('PUT', data, headers);
        const response = await fetch(fullUrl, options);
        return handleResponse<T>(response);
    },

    async patch<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        const options = createRequestOptions('PATCH', data, headers);
        const response = await fetch(fullUrl, options);
        return handleResponse<T>(response);
    },

    async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        const options = createRequestOptions('DELETE', undefined, headers);
        const response = await fetch(fullUrl, options);
        return handleResponse<T>(response);
    }
};

export type { ApiError };