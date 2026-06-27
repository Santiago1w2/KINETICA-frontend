import React,{ useState} from 'react'
import {register} from '../services/AuthService'
import { LuOctagonMinus } from 'react-icons/lu';


function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const verifyPassword = () =>{
        if(repeatPassword.length===0 || password.length===0){
            return false;
        }
        return repeatPassword !== password ;
    }
    const handleRegister= async () =>{
        if(!verifyPassword()){
            await register({
            email,
            password,
        })
        }
        
        setEmail("")
        setPassword("")
    }

    
    
return (
                <div className="w-100 h-150 bg-transparent rounded-3xl border-2 border-transparent flex justify-center items-center">
                    <div className="w-[85%] max-w-4xl min-h-[85%]">
                        
                        <h1 className="mb-10 bloksy text-[#004aad] flex justify-center text-5xl">KINETICA</h1>                    

                        <div className="rubik floating-input my-7">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e)=>setUsername(e.target.value)}
                            />
                            <label>
                                Nombre de Usuario*
                            </label>
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
                        <div className="rubik floating-input my-3">
                            <input
                                type="text"
                                required
                                value={repeatPassword}
                                onChange={(e)=>setRepeatPassword(e.target.value)}
                            />
                            <label>
                                Repetir Contraseña*
                            </label>
                        </div>
                        <div className="text-red-500 h-6">
                            {verifyPassword()&&"Las contraseñas no coinciden"}
                        </div>
                        <button 
                            className="rubik mb-10 mt-4 w-full py-3 bg-[#004aad] rounded-xl text-[#f4ffff] hover:bg-[#3879d0] transiton active:scale-90 transition-transform duration-100"
                            onClick={handleRegister}
                        >
                            Registrarse
                        </button>               
                    </div>
                    
                        
                </div>    
    
)
}

export default RegisterForm