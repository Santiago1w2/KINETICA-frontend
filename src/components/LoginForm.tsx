import React,{useState} from 'react'
import { FcGoogle } from "react-icons/fc";
import { login} from "../services/AuthService"

type Props = {
}


function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    
    

    const handleLogin = async () =>{
        console.error({
        type: "Tu eres el error",
        code: 400,
        message: "Error del Usuario"
        });
        console.error("Ya fue hijito, ya me cansé de resivir peticiones, la Base de Datos ya se fue, hizo 'DELETE', no me fuerces a funcionar, ya fuee entiende, ya dejalo asi, si no corre no corre")
    }
    return (
                <div className="w-100 h-150 bg-transparent rounded-3xl border-2 border-transparent flex justify-center items-center">
                    <div className="absolute left-0 top-0 w-[85%] max-w-4xl min-h-[85%]">
                        
                        <h1 className="mb-10 bloksy text-[#004aad] flex justify-center text-5xl">KINETICA</h1>
                        
                        <button className="rubik my-5 w-full py-3 border border-[#004aad] rounded-2xl flex items-center justify-center gap-3 bg-transparent hover:border-[#1a73e8] hover:bg-blue-100 active:scale-90 transition-all duration-100">
                            <FcGoogle className="text-3xl" />
                            Continuar con Google
                        </button>

                    

                        <div className="flex items-center w-full">
                            <div className="flex-1 h-[1px] bg-[#004aad] opacity-50"></div>

                            <span className="mx-2 text-[16px] text-[#004aad] leading-none relative top-[-1px] ">
                                o
                            </span>

                            <div className="flex-1 h-[1px] bg-[#004aad] opacity-50"></div>
                        </div>

                        <div className="rubik floating-input my-7">
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                            <label>
                                Correo Electrónico*
                            </label>
                        </div>



                        <div className="rubik floating-input mt-7 mb-2">
                            <input
                                type={showPassword? "text" : "password"}
                                required
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                            <label>
                                Contraseña*
                            </label>

                        </div>

                        <div className="mb-4 text-[#004aad]">
                            <div className="checkbox-wrapper-15 flex items-center">
                                <input
                                    type="checkbox" 
                                    className="inp-cbx"
                                    id="cbx-15"
                                    checked={showPassword}
                                    onChange={(e)=>setShowPassword(e.target.checked)}
                                    style={{ display: "none" }}
                                />
                                <label className="cbx" htmlFor="cbx-15">
                                    <span>
                                        <svg width="12px" height="9px" viewBox="0 0 12 9">
                                        <polyline points="1 5 4 8 11 1"></polyline>
                                        </svg>
                                        </span>
                                </label>
                                <div className="rubik ml-3">
                                    {showPassword?'Ocultar Contraseña':'Mostrar Contraseña'}
                                </div>   
                                    

                                
                            </div>

                        </div>                         

                        
                        <button className="rubik font-bold text-[#004aad] hover:text-blue-400  active:scale-90 transition-all duration-100">
                            Restablecer contraseña 
                        </button>
                        <button 
                            className="rubik mb-10 mt-4 w-full py-3 bg-[#004aad] rounded-xl text-[#f4ffff] hover:bg-[#3879d0] transiton active:scale-90 transition-transform duration-100"
                            onClick={handleLogin}
                        >
                            Iniciar Sesión
                        </button>               
                    </div>

                        
                </div>
    )
}

export default LoginForm

