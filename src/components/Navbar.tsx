import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
    const { accessToken, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <div className="animate-navbar fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[98%] h-10 px-10 rounded-4xl bg-white shadow-[0_0_50px_rgba(0,74,173,0.4)] flex items-center">
            <div className="bloksy text-[#004aad] text-3xl">KINETICA</div>
            <ul className="rubik absolute left-1/2 -translate-x-1/2 flex items-center gap-20 text-[15px] font-normal">
                <li>Inicio</li>
                <li>Cómo funciona</li>
                <li>Beneficios</li>
                <li>Contacto</li>
                {accessToken ? (
                    <li className="cursor-pointer text-[#004aad] hover:text-blue-400" onClick={handleLogout}>Cerrar Sesión</li>
                ) : (
                    <>
                        <li><Link to='/auth/login'>Login</Link></li>
                        <li><Link to='/auth/register'>Register</Link></li>
                    </>
                )}
            </ul>
        </div>
    )
}

export default Navbar

