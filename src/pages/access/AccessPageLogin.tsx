import LoginForm from '../../components/LoginForm'
import { PresentLogin } from '../../components/Present'

function AccessPageLogin() {
        return (
            <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[#f4ffff] to-blue-300">
                <div className="flex w-[65%] max-w-4xl min-h-[75%] bg-[#f4ffff] rounded-[40px] shadow-[0_0_50px_rgba(0,74,173,0.4)]">
                    <div className="w-1/2">
                        <PresentLogin />
                    </div>
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="scale-85">
                            {<LoginForm />}
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AccessPageLogin
