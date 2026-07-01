import { NavLink, useNavigate } from "react-router-dom"
import HomeIcon from "../assets/icons/HomeIcon.js"
import TextIcon from "../assets/icons/TextIcon.js"
import SingIcon from "../assets/icons/SingIcon.js"
import PerfilIcon from "../assets/icons/PerfilIcon.js"
import LogoutIcon from "../assets/icons/LogoutIcon.js"
import { useAuth } from "../hooks/useAuth.js"
import { useState } from "react"
import LoadingSpinner from "./LoadingSpinner"
import { FiSettings } from "react-icons/fi"

type PropsAcount = {
    username: string | undefined
    email: string
    logout: () => void
    disabled?: boolean
}

function UserAccount({ username, email, logout, disabled = false }: PropsAcount) {
    return (
        <div className="flex w-full items-center gap-3 rounded-xl transition">
            <div className="font-nunito flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                {username?.[0]?.toUpperCase()}
            </div>

            <div className="flex min-w-0 flex-col">
                <span className="font-nunito truncate text-sm font-medium">{username}</span>
                <span className="font-nunito truncate text-xs text-slate-500">{email}</span>
            </div>

            <button
                type="button"
                className="rounded-2xl p-2 transition-all duration-100 hover:bg-slate-200 active:scale-90"
                onClick={logout}
                disabled={disabled}
                title="Cerrar sesion"
            >
                <LogoutIcon size={20} />
            </button>
        </div>
    )
}

function UserLogo({ username }: { username: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-6">
            <div className="font-nunito flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-bold text-white shadow-md">
                {username?.[0]?.toUpperCase()}
            </div>

            <span className="font-poppins max-w-[200px] truncate text-center text-lg font-semibold text-slate-700">
                {username}
            </span>
        </div>
    )
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 transition ${
        isActive
            ? "bg-[#004aad] text-white"
            : "text-slate-700 hover:bg-slate-100"
    }`

export default function Sidebar() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const [loggingOut, setLoggingOut] = useState(false)
    const isAdmin = user?.role === "ADMIN"

    const handleLogout = async () => {
        if (loggingOut) return
        setLoggingOut(true)
        try {
            await logout()
            navigate("/home")
        } finally {
            setLoggingOut(false)
        }
    }

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-md">
            {loggingOut ? <LoadingSpinner message="Cerrando sesion..." /> : null}
            <div className="p-3">
                <div className="flex justify-center py-2">
                    <h1 className="bloksy text-3xl font-bold tracking-wide text-[#004aad]">
                        KINETICA
                    </h1>
                </div>

                <UserLogo username={user?.username || ""} />
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-2">
                <NavLink to="/dashboard" end className={navLinkClass}>
                    <HomeIcon size={20} />
                    Home
                </NavLink>

                <NavLink to="/dashboard/sing-to-text" className={navLinkClass}>
                    <SingIcon size={20} />
                    Se&ntilde;a a texto
                </NavLink>

                <NavLink to="/dashboard/text-to-sing" className={navLinkClass}>
                    <TextIcon size={20} />
                    Texto a se&ntilde;a
                </NavLink>

                <NavLink to="/dashboard/perfil" className={navLinkClass}>
                    <PerfilIcon size={20} />
                    Perfil
                </NavLink>

                {isAdmin ? (
                    <NavLink to="/dashboard/signs-admin" className={navLinkClass}>
                        <FiSettings size={20} />
                        Administrar se&ntilde;as
                    </NavLink>
                ) : null}
            </nav>

            <div className="mt-auto space-y-3 border-t border-slate-200 p-3">
                <UserAccount
                    username={user?.username || ""}
                    email={user?.email || ""}
                    logout={handleLogout}
                    disabled={loggingOut}
                />
            </div>
        </aside>
    )
}
