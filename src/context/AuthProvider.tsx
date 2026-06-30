import React, { type ReactNode, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { type  User, type AuthResponse } from '../types/auth/type';
import api from '../api/axios';

export default function AuthProvider({children}:{children:ReactNode}) {
    
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccesToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null> (null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true);
        const savedTokenAccess = localStorage.getItem('accessToken');
        const savedTokenRefresh = localStorage.getItem('refreshToken');
        const savedUserId = localStorage.getItem('userId');
        const savedEmail = localStorage.getItem('email');
        const savedUsername = localStorage.getItem('username');
        if(savedTokenAccess && savedTokenRefresh){
            setAccesToken(savedTokenAccess);
            setRefreshToken(savedTokenRefresh);
        }
        if(savedUserId && savedEmail && savedUsername){
            setUser({ userId: Number(savedUserId), email: savedEmail, username: savedUsername });
        }
        setLoading(false);
    },[])

    const login = (response: AuthResponse) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('userId', String(response.userId));
        localStorage.setItem('email', response.email);
        localStorage.setItem('username', response.username);
        setAccesToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setUser({ userId: response.userId, email: response.email, username: response.username });
    }
    const logout = async () => {
        const rt = refreshToken ?? localStorage.getItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        setAccesToken(null);
        setRefreshToken(null);
        setUser(null);
        if (rt) {
            try {
                await api.post('/auth/logout', { refreshToken: rt });
            } catch {
            }
        }
        
    }
    const isAuthenticated = !!accessToken;
    return (
        <AuthContext.Provider value = {{accessToken,refreshToken,login,logout, loading, user,isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
    
}

