import api from '../api/axios'
import type {
    AuthResponse,
    ChangePasswordRequest,
    Credentials,
    MessageResponse,
    RegisterRequest,
    UpdateProfileRequest,
    User,
} from '../types/auth/type';

const GOOGLE_OAUTH_URL = import.meta.env.VITE_GOOGLE_OAUTH_URL

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
export const getMe = async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    
    return response.data;
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
}

export const changePassword = async (data: ChangePasswordRequest): Promise<MessageResponse> => {
    const response = await api.patch<MessageResponse>('/auth/change-password', data);
    return response.data;
}
