import React, { useState } from 'react'

interface SignTextInputProps {
    onTranslate?: (text: string) => void
    loading?: boolean
}

export default function SeniaTextInput({ onTranslate, loading = false }: SignTextInputProps) {
    const [text, setText] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const cleanText = text.trim()
        if (cleanText && !loading) {
            onTranslate?.(cleanText)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex h-full w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all focus-within:border-[#004aad]"
        >
            <div className="flex flex-col gap-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Texto a traducir
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe una frase aqui para verla en señas..."
                    className="h-32 w-full resize-none rounded-xl border-none bg-slate-50 p-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-slate-400">
                    {text.length} caracteres
                </span>
                <button
                    type="submit"
                    disabled={!text.trim() || loading}
                    className="flex items-center gap-2 rounded-xl bg-[#004aad] px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95 disabled:bg-slate-300"
                >
                    {loading ? 'Traduciendo...' : 'Traducir'}
                </button>
            </div>
        </form>
    )
}
