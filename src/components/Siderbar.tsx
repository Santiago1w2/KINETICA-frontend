import { NavLink } from "react-router-dom"
import HomeIcon from '../assets/icons/HomeIcon.js'
import TextIcon from "../assets/icons/TextIcon.js";
import SingIcon from "../assets/icons/SingIcon.js";
import PerfilIcon from "../assets/icons/PerfilIcon.js";
function Siderbar() {
return (
<div className="flex min-h-screen bg-slate-100">
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-slate-200 bg-white shadow-md">
        <div className="p-2">
            <div className="flex justify-center">
                <h1 className="bloksy text-3xl text-[#004aad]">
                    KINETICA
                </h1>
            </div>

            <nav className="mt-8 flex flex-col gap-2 px-0">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                        isActive
                        ? "bg-[#004aad] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                        }`
                    }
                >
                <HomeIcon size={20}/>Home
                </NavLink>

                <NavLink
                    to="/dashboard/text-to-sing"
                    className={({ isActive }) =>
                        `flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                        isActive
                        ? "bg-[#004aad] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                        }`
                    }
                >
                    <TextIcon size={20} />Texto a seña
                </NavLink>


                <NavLink
                    to="/dashboard/sing-to-text"
                    className={({ isActive }) =>
                        `flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                        isActive
                        ? "bg-[#004aad] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                        }`
                    }
                >
                    <SingIcon size={20}/>Seña a texto
                </NavLink>

                <NavLink
                    to="/dashboard/perfil"
                    className={({ isActive }) =>
                        `flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                        isActive
                        ? "bg-[#004aad] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                        }`
                    }
                >
                    <PerfilIcon size={20}/> Perfil
                </NavLink>
            </nav>
            <div>
                Sesion iniciada:
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
            </div>
        </div>
    </aside>
</div>
)
}

export default Siderbar