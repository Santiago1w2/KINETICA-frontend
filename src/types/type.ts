export interface Credentials{
    email: string;
    password: string;
}

export interface AuthResponse{
    userId: number;
    email: string;
    accessToken: string;
    refreshToken: string;
    tokentype: string;
}

export interface FormRegister extends Credentials {
    username: string;
    repeatPassword: string;
}

export interface AnimationResponse {
    id: number;
    name: string;
    glbBase64: string;
}

export interface AnimationData {
    name: string;
    base64: string;
}