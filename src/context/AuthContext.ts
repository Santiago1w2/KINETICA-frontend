import { createContext } from "react";
import type { AuthResponse } from "../types/type";

export interface AuthContextType{
    accesToken: string | null;
    refreshToken: string |null;
    login: (response: AuthResponse) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);