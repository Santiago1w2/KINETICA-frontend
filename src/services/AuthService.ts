import api from '../api/axios'
import type { AuthResponse, Credentials, RegisterRequest } from '../types/auth/type';

const API_URL = import.meta.env.VITE_API_URL
const GOOGLE_OAUTH_URL = import.meta.env.VITE_GOOGLE_OAUTH_URL

const getBackendOrigin = () => {
    if (!API_URL) return ''
    return API_URL.replace(/\/api\/v\d+\/?$/, '')
}


export const login = async (data:Credentials) => {
    const response = await api.post<AuthResponse>('/auth/login',data)
    return response.data;
}

export const register = async (data:RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register',data)
    return response.data;
}

export const getGoogleOAuthUrl = () => {
    return GOOGLE_OAUTH_URL;
}
export const getMe = async () => {
    const response = await api.get("/auth/me");
    
    return response.data;
}
