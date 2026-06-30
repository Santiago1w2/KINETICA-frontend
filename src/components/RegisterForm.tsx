import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/AuthService'
import type { FormRegister } from '../types/auth/type'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

function RegisterForm() {
    const [form, setForm] = useState<FormRegister>({
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
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

    const passwordsDoNotMatch = () => {
        if (form.repeatPassword.length === 0 || form.password.length === 0) {
            return false
        }
        return form.repeatPassword !== form.password
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (loading) return

        setError('')
        const { email, password, username } = form

        if (!email || !password || !username) {
            setError('Todos los campos son obligatorios')
            return
        }

        if (passwordsDoNotMatch()) {
            setError('Las contrasenas no coinciden')
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/
        if (!passwordRegex.test(password)) {
            setError('La contrasena debe tener minimo 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial')
            return
        }

        setLoading(true)
        try {
            const res = await register({ email, password, username })
            authLogin(res)
            navigate('/dashboard')
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string; error?: string } } }
            const msg = axiosErr.response?.data?.message || axiosErr.response?.data?.error || 'No se pudo crear la cuenta'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-150 w-100 items-center justify-center rounded-3xl border-2 border-transparent bg-transparent">
            {loading && <LoadingSpinner message="Creando cuenta..." />}

            <form onSubmit={handleSubmit} className="min-h-[85%] w-[85%] max-w-4xl" noValidate>
                <h1 className="bloksy mb-10 flex justify-center text-5xl text-[#004aad]">KINETICA</h1>

                <div className="rubik floating-input my-7">
                    <input
                        name="username"
                        type="text"
                        required
                        value={form.username}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <label>Nombre de usuario*</label>
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

                <div className="rubik floating-input my-3">
                    <input
                        name="repeatPassword"
                        type="password"
                        required
                        value={form.repeatPassword}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <label>Repetir contrasena*</label>
                </div>

                <div className="h-6 text-red-500">
                    {passwordsDoNotMatch() && 'Las contrasenas no coinciden'} {error && <p>{error}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="rubik mb-10 mt-4 w-full rounded-xl bg-[#004aad] py-3 text-[#f4ffff] transition-transform duration-100 hover:bg-[#3879d0] active:scale-90 disabled:opacity-60"
                >
                    Registrarse
                </button>
            </form>
        </div>
    )
}

export default RegisterForm
