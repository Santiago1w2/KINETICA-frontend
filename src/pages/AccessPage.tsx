import React,{ useState} from 'react'
import LoginForm from '../components/LoginForm'
import {PresentLogin, PresentRegister} from '../components/Present'
import RegisterForm from '../components/RegisterForm'

function AccessPage() {
    const [move, setMove] = useState(false);
    const [pantalla, setPantalla] = useState<"login" | "register">("login")
    return (
            <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[#f4ffff] to-blue-300">
    
                <div className="flex w-[65%] max-w-4xl min-h-[75%] bg-[#f4ffff] rounded-[40px] shadow-[0_0_50px_rgba(0,74,173,0.4)]">
                    
                    
                    
                    {pantalla === "login" &&
                    <div className="w-1/2">
                        <PresentLogin setPantalla={setPantalla} pantalla={pantalla} />
                    </div>}

                

                    { pantalla === "register" && 
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="scale-85">
                            {<RegisterForm />}
                        </div>
                    </div>}
                    { pantalla === "login" && 
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="scale-85">
                            {<LoginForm />}
                        </div>
                    </div>}

                    
                    
                    {pantalla === "register" &&
                    <div className="w-1/2">
                        <PresentRegister setPantalla={setPantalla} pantalla={pantalla}/>
                    </div>}

                    
                </div>

            </div>
    )
}

export default AccessPage