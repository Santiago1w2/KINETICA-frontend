import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiRefreshCw, FiSave, FiTrash2, FiX } from 'react-icons/fi'
import LoadingSpinner from '../../components/LoadingSpinner'
import { createSign, deleteSign, fetchSigns, updateSign } from '../../services/SignService'
import type { SignRequest, SignResponse } from '../../types/sings/type'

const emptyForm: SignRequest = {
    label: '',
    mediaRef: '',
    locale: 'es-PE',
    active: true,
    animationSrc: '',
}

function getErrorMessage(err: unknown, fallback: string) {
    const axiosErr = err as { response?: { status?: number; data?: { message?: string; error?: string; details?: string[] } } }
    const status = axiosErr.response?.status

    if (status === 401) return 'No autenticado. Inicia sesion nuevamente.'
    if (status === 403) return 'No autorizado. Esta accion requiere rol ADMIN.'

    return axiosErr.response?.data?.message
        || axiosErr.response?.data?.error
        || axiosErr.response?.data?.details?.[0]
        || (err instanceof Error ? err.message : fallback)
}

function toForm(sign: SignResponse): SignRequest {
    return {
        label: sign.label ?? '',
        mediaRef: sign.mediaRef ?? '',
        locale: sign.locale ?? 'es-PE',
        active: sign.active ?? true,
        animationSrc: sign.animationSrc ?? '',
    }
}

export default function SignsAdminPage() {
    const [signs, setSigns] = useState<SignResponse[]>([])
    const [form, setForm] = useState<SignRequest>(emptyForm)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const isEditing = editingId !== null
    const isBusy = loading || saving || deletingId !== null

    const sortedSigns = useMemo(
        () => [...signs].sort((a, b) => a.label.localeCompare(b.label)),
        [signs]
    )

    const loadSigns = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await fetchSigns()
            setSigns(data)
        } catch (err) {
            setError(getErrorMessage(err, 'No se pudo cargar el listado de senas.'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSigns()
    }, [])

    const resetForm = () => {
        setForm(emptyForm)
        setEditingId(null)
    }

    const handleChange = (field: keyof SignRequest, value: string | boolean) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    const handleEdit = (sign: SignResponse) => {
        setError('')
        setSuccess('')
        setEditingId(sign.id)
        setForm(toForm(sign))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        const payload: SignRequest = {
            label: form.label.trim(),
            mediaRef: form.mediaRef.trim(),
            locale: form.locale.trim() || 'es-PE',
            active: form.active,
            animationSrc: form.animationSrc.trim(),
        }

        if (!payload.label) {
            setError('El campo label es obligatorio.')
            return
        }

        setSaving(true)
        try {
            if (editingId !== null) {
                const updated = await updateSign(editingId, payload)
                setSigns((current) => current.map((sign) => sign.id === editingId ? updated : sign))
                setSuccess('Sena actualizada correctamente.')
            } else {
                const created = await createSign(payload)
                setSigns((current) => [created, ...current])
                setSuccess('Sena creada correctamente.')
            }

            resetForm()
        } catch (err) {
            setError(getErrorMessage(err, isEditing ? 'No se pudo actualizar la sena.' : 'No se pudo crear la sena.'))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (sign: SignResponse) => {
        const shouldDelete = window.confirm(`Eliminar la sena "${sign.label}"?`)
        if (!shouldDelete) return

        setError('')
        setSuccess('')
        setDeletingId(sign.id)
        try {
            await deleteSign(sign.id)
            setSigns((current) => current.filter((item) => item.id !== sign.id))
            if (editingId === sign.id) resetForm()
            setSuccess('Sena eliminada correctamente.')
        } catch (err) {
            setError(getErrorMessage(err, 'No se pudo eliminar la sena.'))
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            {(loading || saving || deletingId !== null) ? (
                <LoadingSpinner message={saving ? 'Guardando sena...' : deletingId !== null ? 'Eliminando sena...' : 'Cargando senas...'} />
            ) : null}

            <section className="bg-white px-6 py-5 shadow-[0_18px_50px_rgba(0,74,173,0.12)] ring-1 ring-slate-200">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="rubik text-sm uppercase tracking-[0.22em] text-[#004aad]">Administracion</p>
                        <h1 className="bloksy mt-1 text-4xl text-slate-950 sm:text-5xl">Administrar se&ntilde;as</h1>
                        <p className="rubik mt-2 max-w-3xl text-sm text-slate-600">
                            Crea, edita y elimina las senas disponibles para el traductor.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadSigns}
                        disabled={isBusy}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FiRefreshCw />
                        Recargar
                    </button>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8">
                {error ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                        {error}
                    </div>
                ) : null}

                {success ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                        {success}
                    </div>
                ) : null}

                <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.75fr)_minmax(0,1.25fr)]">
                    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="rubik text-xl font-bold text-slate-950">
                                    {isEditing ? 'Editar sena' : 'Nueva sena'}
                                </h2>
                                <p className="rubik mt-1 text-sm text-slate-500">
                                    Completa los campos requeridos por el backend.
                                </p>
                            </div>

                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={isBusy}
                                    className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                                    title="Cancelar edicion"
                                >
                                    <FiX />
                                </button>
                            ) : null}
                        </div>

                        <div className="mt-5 grid gap-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Label</span>
                                <input
                                    value={form.label}
                                    onChange={(event) => handleChange('label', event.target.value)}
                                    disabled={isBusy}
                                    required
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Media ref</span>
                                <input
                                    value={form.mediaRef}
                                    onChange={(event) => handleChange('mediaRef', event.target.value)}
                                    disabled={isBusy}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                                />
                            </label>

                            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-700">Locale</span>
                                    <input
                                        value={form.locale}
                                        onChange={(event) => handleChange('locale', event.target.value)}
                                        disabled={isBusy}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:mt-7">
                                    <input
                                        type="checkbox"
                                        checked={form.active}
                                        onChange={(event) => handleChange('active', event.target.checked)}
                                        disabled={isBusy}
                                        className="h-5 w-5 accent-[#004aad]"
                                    />
                                    <span className="text-sm font-semibold text-slate-700">Activa</span>
                                </label>
                            </div>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Animation src</span>
                                <textarea
                                    value={form.animationSrc}
                                    onChange={(event) => handleChange('animationSrc', event.target.value)}
                                    disabled={isBusy}
                                    rows={7}
                                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isBusy}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#004aad] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {isEditing ? <FiSave /> : <FiPlus />}
                            {isEditing ? 'Guardar cambios' : 'Crear sena'}
                        </button>
                    </form>

                    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="rubik text-xl font-bold text-slate-950">Listado</h2>
                                <p className="rubik mt-1 text-sm text-slate-500">
                                    {sortedSigns.length} senas registradas.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                            <div className="grid min-w-[720px] grid-cols-[80px_minmax(160px,1fr)_120px_100px_130px] bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                                <span>ID</span>
                                <span>Label</span>
                                <span>Locale</span>
                                <span>Estado</span>
                                <span className="text-right">Acciones</span>
                            </div>

                            <div className="max-h-[620px] min-w-[720px] divide-y divide-slate-200 overflow-auto">
                                {sortedSigns.length === 0 && !loading ? (
                                    <div className="px-4 py-8 text-center text-sm font-medium text-slate-500">
                                        No hay senas registradas.
                                    </div>
                                ) : null}

                                {sortedSigns.map((sign) => (
                                    <div
                                        key={sign.id}
                                        className="grid grid-cols-[80px_minmax(160px,1fr)_120px_100px_130px] items-center gap-2 px-4 py-3 text-sm text-slate-700"
                                    >
                                        <span className="font-semibold text-slate-500">#{sign.id}</span>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-950">{sign.label}</p>
                                            <p className="truncate text-xs text-slate-500">{sign.mediaRef || sign.normalizedLabel}</p>
                                        </div>
                                        <span>{sign.locale}</span>
                                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${sign.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {sign.active ? 'Activa' : 'Inactiva'}
                                        </span>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(sign)}
                                                disabled={isBusy}
                                                className="rounded-xl p-2 text-[#004aad] transition hover:bg-blue-50 disabled:opacity-50"
                                                title="Editar"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(sign)}
                                                disabled={isBusy}
                                                className="rounded-xl p-2 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                                                title="Eliminar"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    )
}
