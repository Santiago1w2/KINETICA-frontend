import { createContext } from "react";
import type { AuthResponse, User } from "../types/auth/type";

export interface AuthContextType{
    user: User | null;
    accessToken: string | null;
    refreshToken: string |null;
    login: (response: AuthResponse) => void;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);