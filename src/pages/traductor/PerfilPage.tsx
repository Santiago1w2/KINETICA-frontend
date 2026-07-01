import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiLock, FiLogOut, FiMail, FiShield, FiUser } from 'react-icons/fi'
import { changePassword, getMe, updateProfile } from '../../services/AuthService'
import { useAuth } from '../../hooks/useAuth'
import type { User } from '../../types/auth/type'
import LoadingSpinner from '../../components/LoadingSpinner'

const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 30
const PASSWORD_MIN_LENGTH = 8

type AlertKind = 'info' | 'success' | 'error'

function Alert({ kind, message }: { kind: AlertKind; message: string }) {
    const styles = {
        info: 'border-blue-200 bg-blue-50 text-blue-800',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        error: 'border-rose-200 bg-rose-50 text-rose-800',
    }

    const Icon = kind === 'success' ? FiCheckCircle : FiAlertCircle

    return (
        <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${styles[kind]}`}>
            <Icon className="mt-0.5 shrink-0" />
            <span>{message}</span>
        </div>
    )
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon: typeof FiUser }) {
    return (
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                <Icon className="text-[#004aad]" />
                {label}
            </div>
            <p className="mt-2 break-words text-base font-semibold text-slate-900">{value || 'No disponible'}</p>
        </div>
    )
}

function formatDate(value?: string) {
    if (!value) return 'No disponible'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat('es-PE', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    }).format(date)
}

function getInitial(user?: User | null) {
    return (user?.username || user?.email || 'U').trim()[0]?.toUpperCase() ?? 'U'
}

function getErrorMessage(err: unknown, fallback: string) {
    const axiosErr = err as { response?: { data?: { message?: string; error?: string; details?: string[] } } }
    return axiosErr.response?.data?.message
        || axiosErr.response?.data?.error
        || axiosErr.response?.data?.details?.[0]
        || (err instanceof Error ? err.message : fallback)
}

function PerfilPage() {
    const navigate = useNavigate()
    const { accessToken, logout, updateUser, user } = useAuth()
    const [profile, setProfile] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [savingProfile, setSavingProfile] = useState(false)
    const [savingPassword, setSavingPassword] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [success, setSuccess] = useState('')
    const [form, setForm] = useState({
        username: '',
    })
    const [securityForm, setSecurityForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        let cancelled = false

        const loadProfile = async () => {
            if (!accessToken) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError('')

            try {
                const data = await getMe()
                if (cancelled) return

                setProfile(data)
                updateUser(data)
                setForm({
                    username: data.username ?? '',
                })
            } catch (err) {
                if (!cancelled) {
                    setError(getErrorMessage(err, 'No se pudo cargar el perfil.'))
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadProfile()

        return () => {
            cancelled = true
        }
    }, [accessToken, updateUser])

    useEffect(() => {
        if (!user) return

        setProfile((current) => ({
            ...(current ?? user),
            ...user,
        }))
        setForm((current) => (
            current.username === user.username
                ? current
                : { ...current, username: user.username ?? '' }
        ))
    }, [
        user?.id,
        user?.userId,
        user?.email,
        user?.username,
        user?.role,
        user?.accountStatus,
        user?.status,
    ])

    const usernameError = useMemo(() => {
        const username = form.username.trim()
        if (!username) return 'El nombre de usuario es obligatorio.'
        if (username.length < USERNAME_MIN_LENGTH) return `Debe tener al menos ${USERNAME_MIN_LENGTH} caracteres.`
        if (username.length > USERNAME_MAX_LENGTH) return `No debe superar ${USERNAME_MAX_LENGTH} caracteres.`
        return ''
    }, [form.username])

    const createdAt = profile?.createdAt ?? profile?.created_at
    const accountStatus = profile?.accountStatus ?? profile?.status ?? 'Activa'
    const role = profile?.role ?? 'USUARIO'
    const isBusy = loading || savingProfile || savingPassword || loggingOut

    const handleProfileSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setNotice('')
        setError('')
        setSuccess('')

        if (usernameError) {
            setError(usernameError)
            return
        }

        setSavingProfile(true)
        try {
            const updated = await updateProfile({ username: form.username.trim() })
            const updatedUser = {
                ...updated,
                username: updated.username ?? form.username.trim(),
            }

            updateUser(updatedUser)
            setProfile((current) => ({ ...(current ?? user ?? updatedUser), ...updatedUser }))
            setForm({ username: updatedUser.username })
            setSuccess('Perfil actualizado correctamente.')
        } catch (err) {
            setError(getErrorMessage(err, 'No se pudo actualizar el perfil.'))
        } finally {
            setSavingProfile(false)
        }
    }

    const handleSecuritySubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setNotice('')
        setError('')
        setSuccess('')

        if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
            setError('Completa todos los campos de seguridad.')
            return
        }

        if (securityForm.newPassword.length < PASSWORD_MIN_LENGTH) {
            setError(`La nueva contrasena debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`)
            return
        }

        if (securityForm.newPassword !== securityForm.confirmPassword) {
            setError('La nueva contrasena y la confirmacion no coinciden.')
            return
        }

        setSavingPassword(true)
        try {
            const response = await changePassword(securityForm)
            setSecurityForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
            setSuccess(response.message || 'Contrasena actualizada correctamente.')
        } catch (err) {
            setError(getErrorMessage(err, 'No se pudo actualizar la contrasena.'))
        } finally {
            setSavingPassword(false)
        }
    }

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await logout()
            navigate('/home')
        } finally {
            setLoggingOut(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            {loading ? <LoadingSpinner message="Cargando perfil..." /> : null}
            {savingProfile ? <LoadingSpinner message="Guardando cambios..." /> : null}
            {savingPassword ? <LoadingSpinner message="Actualizando contrasena..." /> : null}
            {loggingOut ? <LoadingSpinner message="Cerrando sesion..." /> : null}

            <section className="bg-white px-6 py-8 shadow-[0_18px_50px_rgba(0,74,173,0.12)] ring-1 ring-slate-200">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-5">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#004aad] to-blue-700 text-4xl font-bold text-white shadow-md">
                            {getInitial(profile)}
                        </div>
                        <div>
                            <p className="rubik text-sm uppercase tracking-[0.22em] text-[#004aad]">Perfil de usuario</p>
                            <h1 className="bloksy mt-1 text-4xl text-slate-950 sm:text-5xl">{profile?.username}</h1>
                            <p className="rubik mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <FiMail className="text-[#004aad]" />
                                {profile?.email}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isBusy}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <FiLogOut />
                        Cerrar sesion
                    </button>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8">
                {error ? <Alert kind="error" message={error} /> : null}
                {notice ? <Alert kind="info" message={notice} /> : null}
                {success ? <Alert kind="success" message={success} /> : null}

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h2 className="rubik text-xl font-bold text-slate-950">Informacion personal</h2>
                        <p className="rubik mt-2 text-sm text-slate-500">
                            Datos obtenidos desde el usuario autenticado con el token actual.
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field label="Usuario" value={profile?.username ?? ''} icon={FiUser} />
                            <Field label="Correo" value={profile?.email ?? ''} icon={FiMail} />
                            <Field label="Rol" value={role} icon={FiShield} />
                            <Field label="Creacion" value={formatDate(createdAt)} icon={FiCalendar} />
                            <Field label="Estado" value={accountStatus} icon={FiCheckCircle} />
                        </div>
                    </article>

                    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h2 className="rubik text-xl font-bold text-slate-950">Editar perfil</h2>
                        <p className="rubik mt-2 text-sm text-slate-500">
                            Solo se preparan campos editables seguros. Email, rol e id permanecen bloqueados.
                        </p>

                        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Username</span>
                                <input
                                    value={form.username}
                                    onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                                    minLength={USERNAME_MIN_LENGTH}
                                    maxLength={USERNAME_MAX_LENGTH}
                                    required
                                    disabled={isBusy}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                                />
                                {usernameError ? <span className="mt-1 block text-xs font-semibold text-rose-600">{usernameError}</span> : null}
                            </label>

                            <Alert kind="info" message="Solo puedes actualizar tu username. El correo, rol e id no se pueden modificar." />

                            <button
                                type="submit"
                                disabled={isBusy || !!usernameError}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#004aad] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-slate-300"
                            >
                                {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </form>
                    </article>
                </div>

                <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <FiLock />
                        </span>
                        <div>
                            <h2 className="rubik text-xl font-bold text-slate-950">Seguridad</h2>
                            <p className="rubik mt-1 text-sm text-slate-500">
                                Cambia tu contrasena sin cerrar la sesion actual.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSecuritySubmit} className="mt-5 grid gap-4 lg:grid-cols-3">
                        <input
                            type="password"
                            value={securityForm.currentPassword}
                            onChange={(event) => setSecurityForm((current) => ({ ...current, currentPassword: event.target.value }))}
                            placeholder="Contrasena actual"
                            disabled={isBusy}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                        />
                        <input
                            type="password"
                            value={securityForm.newPassword}
                            onChange={(event) => setSecurityForm((current) => ({ ...current, newPassword: event.target.value }))}
                            placeholder="Nueva contrasena"
                            disabled={isBusy}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                        />
                        <input
                            type="password"
                            value={securityForm.confirmPassword}
                            onChange={(event) => setSecurityForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                            placeholder="Confirmar contrasena"
                            disabled={isBusy}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                        />
                        <button
                            type="submit"
                            disabled={isBusy}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 lg:col-span-3"
                        >
                            <FiLock />
                            Cambiar contrasena
                        </button>
                    </form>
                </article>
            </section>
        </main>
    )
}

export default PerfilPage
