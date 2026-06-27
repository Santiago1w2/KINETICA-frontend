import React, { type ReactNode, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import type { AuthResponse } from '../types/type';

export default function AuthProvider({children}:{children:ReactNode}) {
    const[accesToken, setAccesToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null> (null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const savedToken = localStorage.getItem('accesToken');
        setLoading(true);
        if(savedToken){
            setAccesToken(savedToken);
        }
        setLoading(false);
    },[])

    const login = (response: AuthResponse) => {
        localStorage.setItem('accesToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        setAccesToken(accesToken);
        setRefreshToken(refreshToken);
    }
    const logout = () => {
        localStorage.removeItem('accesToken');
        localStorage.removeItem('refreshToken');
        setAccesToken(null);
        setRefreshToken(null);
    }
    return (
        <AuthContext.Provider value = {{accesToken,refreshToken,login,logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
    
}

