import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
    const { accessToken, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
<nav className="animate-navbar fixed left-1/2 -translate-x-1/2 z-50 w-[98%] h-15 px-10 rounded-4xl bg-white shadow-[0_0_50px_rgba(0,74,173,0.4)] flex items-center justify-between">

    {/* Logo */}
    <div className="bloksy text-[#004aad] text-3xl">
        KINETICA
    </div>

    {/* Menú central */}
    <ul className="rubik flex gap-20 text-[16px]">
        <li><NavLink to="/home/about-us">Conócenos</NavLink></li>
        <li><NavLink to="/home">Cómo funciona</NavLink></li>
        <li><NavLink to="/home/help">Soporte</NavLink></li>
        <li><Link to='/dashboard'>Traductor</Link></li>
        <li>Contacto</li>
    </ul>

    {/* Menú derecho */}
    <ul className="rubik flex gap-6 items-center">
        {accessToken ? (
            <>
                <li
                    onClick={handleLogout}
                    className="cursor-pointer rounded-full bg-[#004aad] px-4 py-1 text-white hover:bg-blue-700">
                    Cerrar sesión
                </li>
            </>
        ) : (
            <>
                <li>
                    <Link to="/auth/login">Iniciar sesión</Link>
                </li>

                <li>
                    <Link
                        to="/auth/register"
                        className="rounded-full bg-[#004aad]
                                px-4 py-1 text-white hover:bg-blue-700">
                        Registrarse
                    </Link>
                </li>
            </>
        )}
    </ul>

</nav>
    )
}

export default Navbar

