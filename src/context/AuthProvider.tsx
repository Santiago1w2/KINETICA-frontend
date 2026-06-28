import React, { type ReactNode, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import type { AuthResponse } from '../types/type';

export default function AuthProvider({children}:{children:ReactNode}) {
    const[accessToken, setAccesToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null> (null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const savedToken = localStorage.getItem('accessToken');
        setLoading(true);
        if(savedToken){
            setAccesToken(savedToken);
        }
        setLoading(false);
    },[])

    const login = (response: AuthResponse) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        setAccesToken(response.accessToken);
        setRefreshToken(response.refreshToken);
    }
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccesToken(null);
        setRefreshToken(null);
    }
    return (
        <AuthContext.Provider value = {{accessToken,refreshToken,login,logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
    
}

