import React,{useState, type FormEvent} from 'react'
import { FcGoogle } from "react-icons/fc";
import { login} from "../services/AuthService"
import type { Credentials } from '../types/type';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


function LoginForm() {
    const [form, setForm] = useState<Credentials>({
    email: "",
    password: ""
    })
    const {login: authLogin} = useAuth();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleHome= () =>{
        navigate("/")
    }

    const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const { name, value } = e.target;

            setForm((prev) => ({
            ...prev,[name]: value,
        }));
    };    

    const handleSubmit = async (e: FormEvent) =>{
        
        e.preventDefault();
        setError('');
        const {email, password} = form;


        if(!email || !password){
            setError('Todos los campos obligatorios')
            return;
        }
        try {
            const res = await login({email,password});
            authLogin(res);
            navigate('/')
            //Falta el navigate

        } catch(err: unknown){
            const axiosErr = err as {response?: {data?: {message?: string; error?: string}}};
            const msg = axiosErr.response?.data?.message || axiosErr.response?.data?.error || 'Credenciales incorrectas';
            setError(msg)
        }
    }
    return (
                <div className="w-100 h-150 bg-transparent rounded-3xl border-2 border-transparent flex justify-center items-center">
                    <form onSubmit = {handleSubmit} className="absolute left-0 top-0 w-[85%] max-w-4xl min-h-[85%]">
                        
                        <h1 className="mb-10 bloksy text-[#004aad] flex justify-center text-5xl">KINETICA</h1>
                        
                        <button 
                            onClick={handleGoogleLogin}
                            type='button' 
                            className="rubik my-5 w-full py-3 border border-[#004aad] rounded-2xl flex items-center justify-center gap-3 bg-transparent hover:border-[#1a73e8] hover:bg-blue-100 active:scale-90 transition-all duration-100">
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
                                name='email'
                                type="text"
                                required
                                value={form.email}
                                onChange={handleChange}
                            />
                            <label>
                                Correo Electrónico*
                            </label>
                        </div>



                        <div className="rubik floating-input mt-7 mb-2">
                            <input
                                name='password'
                                type={showPassword? "text" : "password"}
                                required
                                value={form.password}
                                onChange={handleChange}
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
                        <div className="text-red-500 h-6">
                            {error && <p>{error}</p>}
                        </div>
                        
                        <button 
                            type= 'submit'
                            className="rubik mb-2 mt-4 w-full py-3 bg-[#004aad] rounded-xl text-[#f4ffff] hover:bg-[#3879d0] transiton active:scale-90 transition-transform duration-100"
                            onClick={handleSubmit}
                        >
                            Iniciar Sesión
                        </button> 
                        <button 
                            onClick={handleHome}
                            type="button" 
                            className="rubik text-xl font-bold text-[#004aad] hover:text-blue-400  active:scale-90 transition-all duration-100">
                            Volver al Home
                        </button>              
                    </form>

                        
                </div>
    )
}

export default LoginForm

