import { PresentRegister} from '../components/Present'
import RegisterForm from '../components/RegisterForm'

function AccessPageRegister() {
    return (
            <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[#0e7490] via-[#3b82f6] to-[#4f46e5]">
    
                <div className="flex w-[65%] max-w-4xl min-h-[75%] bg-[#f4ffff] rounded-[40px] shadow-[0_0_50px_rgba(0,74,173,0.4)]">
                    
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="scale-85">
                            {<RegisterForm />}
                        </div>
                    </div>                    
                    <div className="w-1/2">
                        <PresentRegister />
                    </div>
                    
                </div>

            </div>
    )
}

export default AccessPageRegister