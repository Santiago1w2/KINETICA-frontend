export interface Credentials{
    email: string;
    password: string;
}
export interface User {
    userId: number;
    email: string;
    username: string;
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

