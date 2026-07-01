import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext';
import { type  User, type AuthResponse } from '../types/auth/type';
import api from '../api/axios';

function persistUser(user: User) {
    const userId = user.userId ?? user.id

    if (userId !== undefined) {
        localStorage.setItem('userId', String(userId));
    }

    localStorage.setItem('email', user.email);
    localStorage.setItem('username', user.username);
    localStorage.setItem('user', JSON.stringify(user));
}

function clearPersistedUser() {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
}

export default function AuthProvider({children}:{children:ReactNode}) {
    
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccesToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null> (null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        let cancelled = false;

        const restoreSession = async () => {
        setLoading(true);
        const savedTokenAccess = localStorage.getItem('accessToken');
        const savedTokenRefresh = localStorage.getItem('refreshToken');
        const savedUser = localStorage.getItem('user');
        const savedUserId = localStorage.getItem('userId');
        const savedEmail = localStorage.getItem('email');
        const savedUsername = localStorage.getItem('username');

        if(savedTokenAccess && savedTokenRefresh){
            setAccesToken(savedTokenAccess);
            setRefreshToken(savedTokenRefresh);
        }

        if(savedUser){
            try {
                setUser(JSON.parse(savedUser) as User);
            } catch {
                localStorage.removeItem('user');
            }
        } else if(savedUserId && savedEmail && savedUsername){
            setUser({ userId: Number(savedUserId), email: savedEmail, username: savedUsername });
        }

        if(savedTokenAccess && savedTokenRefresh){
            try {
                const response = await api.get<User>('/auth/me');
                if (!cancelled) {
                    persistUser(response.data);
                    setUser(response.data);
                }
            } catch {
                if (!cancelled && !savedUser && savedUserId && savedEmail && savedUsername) {
                    setUser({ userId: Number(savedUserId), email: savedEmail, username: savedUsername });
                }
            }
        }

        if (!cancelled) setLoading(false);
        }

        restoreSession();

        return () => {
            cancelled = true;
        }
    },[])

    const login = useCallback(async (response: AuthResponse) => {
        const authUser = { userId: response.userId, email: response.email, username: response.username };

        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        persistUser(authUser);
        setAccesToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setUser(authUser);

        try {
            const currentUser = await api.get<User>('/auth/me');
            persistUser(currentUser.data);
            setUser(currentUser.data);
        } catch {
            setUser(authUser);
        }
    }, [])

    const updateUser = useCallback((partialUser: Partial<User>) => {
        setUser((current) => {
            if (!current && (!partialUser.email || !partialUser.username)) {
                return current;
            }

            const nextUser = {
                ...(current ?? {}),
                ...partialUser,
            } as User;

            if (nextUser.email && nextUser.username) {
                persistUser(nextUser);
            }

            return nextUser;
        });
    }, []);

    const refreshCurrentUser = useCallback(async () => {
        const response = await api.get<User>('/auth/me');
        updateUser(response.data);
        return response.data;
    }, [updateUser]);

    const logout = useCallback(async () => {
        const rt = refreshToken ?? localStorage.getItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        clearPersistedUser();
        setAccesToken(null);
        setRefreshToken(null);
        setUser(null);
        if (rt) {
            try {
                await api.post('/auth/logout', { refreshToken: rt });
            } catch {
            }
        }
        
    }, [refreshToken])

    const isAuthenticated = !!accessToken;
    const value = useMemo(
        () => ({
            accessToken,
            refreshToken,
            login,
            logout,
            updateUser,
            refreshCurrentUser,
            loading,
            user,
            isAuthenticated,
        }),
        [accessToken, refreshToken, login, logout, updateUser, refreshCurrentUser, loading, user, isAuthenticated]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
    
}

