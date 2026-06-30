import api from '../api/axios'
import type { AuthResponse, Credentials, RegisterRequest } from '../types/auth/type';

const API_URL = import.meta.env.VITE_API_URL


export const login = async (data:Credentials) => {
    const response = await api.post<AuthResponse>(`${API_URL}/auth/login`,data)
    return response.data;
}

export const register = async (data:RegisterRequest) => {
    const response = await api.post<AuthResponse>(`${API_URL}/auth/register`,data)
    return response.data;
}

