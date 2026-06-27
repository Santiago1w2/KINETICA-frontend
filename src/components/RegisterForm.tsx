import React,{ useState, type FormEvent} from 'react'
import {register} from '../services/AuthService'
import type {FormRegister } from '../types/type';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


function RegisterForm() {
    const [form, setForm] = useState<FormRegister>({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {login : authLogin} = useAuth();
    const navigate = useNavigate();


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const { name, value } = e.target;

            setForm((prev) => ({
            ...prev,[name]: value,
        }));
    };    


    const verifyPassword = () =>{
        if(form.repeatPassword.length===0 || form.password.length===0){
            return false;
        }
        return form.repeatPassword !== form.password ;
    }
    const handleSubmit = async (e: FormEvent) =>{
        
        e.preventDefault();
        setError('');
        const {email, password, username} = form;


        if(!email || !password){
            setError('Todos los campos obligatorios')
            return;
        }
        try {
            const res = await register({email,password});
            authLogin(res);
            localStorage.setItem('username', username);
            navigate('/')

        } catch(err: unknown){
            const axiosErr = err as {response?: {data?: {message?: string; error?: string}}};
            const msg = axiosErr.response?.data?.message || axiosErr.response?.data?.error || 'Credenciales incorrectas';
            setError(msg)
        }
    }
    
    
return (
                <div className="w-100 h-150 bg-transparent rounded-3xl border-2 border-transparent flex justify-center items-center">
                    <form onSubmit = {handleSubmit} className="w-[85%] max-w-4xl min-h-[85%]">
                        
                        <h1 className="mb-10 bloksy text-[#004aad] flex justify-center text-5xl">KINETICA</h1>                    

                        <div className="rubik floating-input my-7">
                            <input
                                name = 'username'
                                type="text"
                                required
                                value={form.username}
                                onChange={handleChange}
                            />
                            <label>
                                Nombre de Usuario*
                            </label>
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
                        <div className="rubik floating-input my-3">
                            <input
                                name='repeatPassword'
                                type="text"
                                required
                                value={form.repeatPassword}
                                onChange={handleChange}
                            />
                            <label>
                                Repetir Contraseña*
                            </label>
                        </div>
                        <div className="*:h-6">
                            {verifyPassword()&&"Las contraseñas no coinciden"} || {error && <p>{error}</p>}
                        </div>
                        <button
                            type= 'submit' 
                            className="rubik mb-10 mt-4 w-full py-3 bg-[#004aad] rounded-xl text-[#f4ffff] hover:bg-[#3879d0] transiton active:scale-90 transition-transform duration-100"
                        >
                            Registrarse
                        </button>               
                    </form>
                    
                        
                </div>    
    
)
}

export default RegisterForm