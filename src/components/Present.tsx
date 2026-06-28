import React from 'react'
import img1 from "../assets/img1.png";
import { useNavigate } from 'react-router-dom';



export function PresentLogin() {
    const navigate = useNavigate();
    return (
        <div className= "flex w-full h-full flex-col justify-center items-center bg-[#004aad] border-transparent rounded-r-[200px] rounded-l-[40px]">

        
                <h1 className="rubik font-bold text-[#f4ffff] text-4xl">
                    Hola, Bienvenido!
                </h1>
                <div className="w-[75%] h-[60%]">
                    <img
                        src={img1}
                        className="w-full h-full object-cover brightness-120"
                    />
                </div>

                <p className="rubik text-[#f4ffff] text-lg">
                    ¿No tienes cuenta?
                </p>
                <button
                    className="py-2 px-4 bg-transparent border-2 rounded-xl border-[#f4ffff] text-[#f4ffff] active:bg-[#f4ffff] active:text-[#004aad] active:border-[#3879d0] active:scale-90 transition-transform duration-100"
                    onClick={()=>navigate('/auth/register')}
                >
                    Registrarse
                </button>

        </div>
    );
}

export function PresentRegister() {
    const navigate = useNavigate();
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#004aad] border-transparent rounded-l-[200px] rounded-r-[40px]">

        
                <h1 className="rubik font-bold text-[#f4ffff] text-4xl">
                    Bienvenido de nuevo!
                </h1>

                <p className="rubik text-[#f4ffff] text-lg">
                    ¿Ya tienes una cuenta? 
                </p>

                <button
                    className="py-2 px-4 bg-transparent border-2 rounded-xl border-[#f4ffff] text-[#f4ffff] active:bg-[#f4ffff] active:text-[#004aad] active:border-[#3879d0] active:scale-90 transition-transform duration-100"
                    onClick={()=>navigate('/auth/login')}
                >
                    Inciar Sesión
                </button>

        </div>
    );
}
