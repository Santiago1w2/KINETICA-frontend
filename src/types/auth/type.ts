export interface Credentials{
    email: string;
    password: string;
}
export interface User {
    id?: number;
    userId?: number;
    email: string;
    username: string;
    role?: string;
    createdAt?: string;
    created_at?: string;
    accountStatus?: string;
    status?: string;
    nombre?: string;
    apellido?: string;
}

export interface UpdateProfileRequest {
    username: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface MessageResponse {
    message: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
}
export interface AuthResponse{
    userId: number;
    email: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    tokentype: string;
}

export interface FormRegister extends Credentials {
    username: string;
    repeatPassword: string;
}

