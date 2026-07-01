import React, { useState, type FormEvent } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { getGoogleOAuthUrl, login } from '../services/AuthService'
import type { Credentials } from '../types/auth/type'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

function LoginForm() {
    const [form, setForm] = useState<Credentials>({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { login: authLogin } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleGoogleLogin = () => {
        window.location.href = getGoogleOAuthUrl()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (loading) return

        setError('')
        const { email, password } = form

        if (!email || !password) {
            setError('Todos los campos son obligatorios')
            return
        }

        setLoading(true)
        try {
            const res = await login({ email, password })
            authLogin(res)
            navigate('/dashboard')
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string; error?: string } } }
            const msg = axiosErr.response?.data?.message || axiosErr.response?.data?.error || 'Credenciales incorrectas'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-150 w-100 items-center justify-center rounded-3xl border-2 border-transparent bg-transparent">
            {loading && <LoadingSpinner message="Iniciando sesion..." />}

            <form onSubmit={handleSubmit} className="absolute left-0 top-0 min-h-[85%] w-[85%] max-w-4xl" noValidate>
                <h1 className="bloksy mb-10 flex justify-center text-5xl text-[#004aad]">KINETICA</h1>

                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    disabled={loading}
                    className="rubik my-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#004aad] bg-transparent py-3 transition-all duration-100 hover:border-[#1a73e8] hover:bg-blue-100 active:scale-90 disabled:opacity-60"
                >
                    <FcGoogle className="text-3xl" />
                    Continuar con Google
                </button>

                <div className="flex w-full items-center">
                    <div className="h-[1px] flex-1 bg-[#004aad] opacity-50"></div>
                    <span className="relative top-[-1px] mx-2 text-[16px] leading-none text-[#004aad]">o</span>
                    <div className="h-[1px] flex-1 bg-[#004aad] opacity-50"></div>
                </div>

                <div className="rubik floating-input my-7">
                    <input
                        name="email"
                        type="text"
                        required
                        value={form.email}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <label>Correo Electronico*</label>
                </div>

                <div className="rubik floating-input mb-2 mt-7">
                    <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <label>Contrasena*</label>
                </div>

                <div className="mb-4 text-[#004aad]">
                    <div className="checkbox-wrapper-15 flex items-center">
                        <input
                            type="checkbox"
                            className="inp-cbx"
                            id="cbx-15"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            disabled={loading}
                            style={{ display: 'none' }}
                        />
                        <label className="cbx" htmlFor="cbx-15">
                            <span>
                                <svg width="12px" height="9px" viewBox="0 0 12 9">
                                    <polyline points="1 5 4 8 11 1"></polyline>
                                </svg>
                            </span>
                        </label>
                        <div className="rubik ml-3">
                            {showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                        </div>
                    </div>
                </div>

                <div className="h-6 text-red-500">
                    {error && <p>{error}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="rubik mb-2 mt-4 w-full rounded-xl bg-[#004aad] py-3 text-[#f4ffff] transition-transform duration-100 hover:bg-[#3879d0] active:scale-90 disabled:opacity-60"
                >
                    Iniciar sesion
                </button>

                <button
                    onClick={() => navigate('/home')}
                    type="button"
                    disabled={loading}
                    className="rubik text-xl font-bold text-[#004aad] transition-all duration-100 hover:text-blue-400 active:scale-90 disabled:opacity-60"
                >
                    {'<-Volver al Home'}
                </button>
            </form>
        </div>
    )
}

export default LoginForm
