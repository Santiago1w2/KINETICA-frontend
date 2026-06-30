import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/HomeIcon.js";
import TextIcon from "../assets/icons/TextIcon.js";
import SingIcon from "../assets/icons/SingIcon.js";
import PerfilIcon from "../assets/icons/PerfilIcon.js";
import LogoutIcon from "../assets/icons/LogoutIcon.js";
import { useAuth } from "../hooks/useAuth.js";
type PropsAcount = {
    username: string;
    email: string;
    logout:()=>void;
}
function UserAccount({ username, email,logout }:PropsAcount) {
  return (
    <div className="w-full flex items-center gap-3  rounded-xl cursor-pointer transition">
      {/* Avatar */}
      <div className="font-nunito w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
        {username?.[0]?.toUpperCase()}
      </div>

      {/* Texts */}
      <div className="flex flex-col min-w-0">
        <span className="font-nunito text-sm font-medium truncate">{username}</span>
        <span className="font-nunito text-xs text-slate-500 truncate">{email}</span>

      </div>
      <div className="hover:bg-slate-200 p-2 rounded-2xl active:scale-90 transition-all duration-100" onClick={logout}><LogoutIcon size={20}/></div>
      
    </div>
  );
}
type PropsLogo = {
    username: string;
}
function UserLogo({ username }: PropsLogo) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6">
        
      <div className="font-nunito w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-3xl shadow-md">
        {username?.[0]?.toUpperCase()}
      </div>

      <span className="font-poppins text-lg font-semibold text-slate-700 text-center truncate max-w-[200px] ">
        {username} 
      </span>
    </div>
  );
}

export default function Sidebar() {
    const {logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/home");
    };
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 h-screen sticky top-0 bg-white border-r border-slate-200 shadow-md flex flex-col">
        
        {/* HEADER */}
        <div className="p-3">
          <div className="flex justify-center py-2">
            <h1 className="bloksy text-3xl font-bold text-[#004aad] tracking-wide">
              KINETICA
            </h1>
          </div>

          <UserLogo username="Santiago Morales Portella" />
        </div>

        {/* NAV */}
        <nav className="flex-1 px-2 flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-[#004aad] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            <HomeIcon size={20} />
            Home
          </NavLink>

          <NavLink
            to="/dashboard/text-to-sing"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-[#004aad] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            <TextIcon size={20} />
            Texto a seña
          </NavLink>

          <NavLink
            to="/dashboard/sing-to-text"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-[#004aad] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            <SingIcon size={20} />
            Seña a texto
          </NavLink>

          <NavLink
            to="/dashboard/perfil"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-[#004aad] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            <PerfilIcon size={20} />
            Perfil
          </NavLink>
        </nav>

        <div className="mt-auto border-t border-slate-200 p-3 space-y-3">
          
          <UserAccount
            username="Santiago Cesar Morales Portella"
            email="santiago.morales@utec.edu.pe"
            logout={handleLogout}
          />

          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
    

 
          </div>
        </div>
      </aside>
    </div>
  );
}
