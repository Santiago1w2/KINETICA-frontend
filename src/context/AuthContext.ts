import { createContext } from "react";
import type { AuthResponse, User } from "../types/auth/type";

export interface AuthContextType{
    user: User | null;
    accessToken: string | null;
    refreshToken: string |null;
    login: (response: AuthResponse) => Promise<void>;
    logout: () => void;
    updateUser: (partialUser: Partial<User>) => void;
    refreshCurrentUser: () => Promise<User>;
    loading: boolean;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
