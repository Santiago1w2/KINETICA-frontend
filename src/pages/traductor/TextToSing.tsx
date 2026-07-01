import { useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import AnimationList from '../../components/AnimationList'
import { useSigns } from '../../hooks/useSigns'
import SeniaTextInput from '../../components/SeniaTextInput'
import ModelCanvas from '../../components/3DModel/ModelCanvas'
import { createTranslation, pollTranslation } from '../../services/translationService'
import { useSignQueue } from '../../hooks/useSignQueue'
import type { TranslationResponse } from '../../types/translator/type'

function parseNumberList(value: string) {
    const parts = value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)

    if (parts.length === 0 || parts.some((part) => !/^\d+$/.test(part))) {
        return []
    }

    return parts.map(Number)
}

function parseLabelList(value: string) {
    return value
        .split(/[,\n;]+/)
        .flatMap((part) => part.trim().split(/\s+/))
        .map((part) => part.trim())
        .filter(Boolean)
}

function getSignLabels(result: TranslationResponse) {
    const signRef = result.signOutputRef?.trim() ?? ''
    const gloss = result.glossOutput?.trim() ?? ''

    if (signRef && parseNumberList(signRef).length === 0) {
        return parseLabelList(signRef)
    }

    return parseLabelList(gloss)
}

function TextToSing() {
    const [status, setStatus] = useState('Escribe un texto para traducirlo a senas.')
    const [error, setError] = useState('')
    const [loadingTranslation, setLoadingTranslation] = useState(false)
    const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null)
    const [shouldPlayLoadedSigns, setShouldPlayLoadedSigns] = useState(false)
    const [base64Input, setBase64Input] = useState('')
    const [customClips, setCustomClips] = useState<THREE.AnimationClip[]>([])
    const [customClipNames, setCustomClipNames] = useState<string[]>([])
    const [customClipError, setCustomClipError] = useState('')

    const handleSendBase64 = useCallback(async () => {
        const raw = base64Input.trim()
        if (!raw) return
        setCustomClipError('')
        setCustomClips([])
        setCustomClipNames([])
        try {
            const commaIdx = raw.indexOf(',')
            const base64 = commaIdx !== -1 ? raw.slice(commaIdx + 1) : raw
            const binaryString = atob(base64)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
            }
            const gltf = await new Promise<THREE.AnimationClip[]>((resolve, reject) => {
                new GLTFLoader().parse(bytes.buffer, '', (gl) => resolve(gl.animations), reject)
            })
            setCustomClips(gltf)
            setCustomClipNames(gltf.map((c) => c.name))
        } catch (err) {
            setCustomClipError(err instanceof Error ? err.message : 'Error decodificando base64')
        }
    }, [base64Input])

    const {
        entries,
        loading: signsLoading,
        selectedClipNames,
        allClips,
        reload: reloadSigns,
    } = useSigns()

    const {
        entries: queueEntries,
        loading: queueLoading,
        error: signsError,
        selectedLabel,
        playSequence,
        stop,
        loadByIds,
        loadByLabels,
        isPlaying,
        select,
        signLabels,
    } = useSignQueue()

    useEffect(() => {
        if (!shouldPlayLoadedSigns || signLabels.length === 0) return
        playSequence(signLabels)
        setShouldPlayLoadedSigns(false)
    }, [playSequence, shouldPlayLoadedSigns, signLabels])

    const handleTranslate = async (text: string) => {
        const sourceText = text.trim()
        if (!sourceText) return

        setLoadingTranslation(true)
        setError('')
        setTranslationResult(null)
        stop()
        setStatus('Enviando texto al backend...')

        try {
            const requestId = await createTranslation('TEXT_TO_SIGN', sourceText)
            setStatus('Backend acepto la traduccion. Consultando resultado...')

            const result = await pollTranslation(requestId)
            setTranslationResult(result)

            const signRef = result.signOutputRef?.trim() ?? ''
            const ids = parseNumberList(signRef)

            if (ids.length > 0) {
                setStatus('Cargando senas por id...')
                await loadByIds(ids)
                setShouldPlayLoadedSigns(true)
            } else {
                const labels = getSignLabels(result)
                if (labels.length === 0) {
                    throw new Error('El backend no devolvio glosas o referencias de senas.')
                }

                setStatus('Cargando senas por glosa...')
                await loadByLabels(labels)
                setShouldPlayLoadedSigns(true)
            }

            setStatus('Traduccion lista.')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error traduciendo texto a senas.')
            setStatus('No se pudo completar la traduccion.')
        } finally {
            setLoadingTranslation(false)
        }
    }

    return (
        <main className="min-h-screen w-full bg-white relative flex flex-col items-center">

            {/* Fondo de circuito (Circuit Board Pattern) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
                        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
                        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
                        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
                    `,
                    backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
                }}
            />

            {/* Sección del Modelo 3D */}
            <div className="w-[90vw] md:w-[65vw] aspect-[16/9] md:aspect-[21/9] relative rounded-3xl overflow-hidden z-10 bg-slate-900 shadow-2xl mt-8">
                <ModelCanvas
                    activeClips={customClipNames.length > 0 ? customClipNames : selectedClipNames}
                    testClips={customClips.length > 0 ? customClips : allClips}
                />
            </div>

     
            <div className="w-[90vw] md:w-[75vw] mt-10 mb-20 z-10">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <SeniaTextInput onTranslate={handleTranslate} loading={loadingTranslation || signsLoading} />

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="rubik text-lg font-semibold text-slate-900">Senas cargadas</h2>
                                <p className="rubik mt-1 text-sm text-slate-500">
                                    Selecciona una sena o reproduce la secuencia completa.
                                </p>
                            </div>
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#004aad]">
                                {isPlaying ? 'Reproduciendo' : `${queueEntries.length} senas`}
                            </span>
                        </div>

                        <AnimationList
                            animations={queueEntries.map((entry) => ({
                                name: entry.sign.label,
                                base64: entry.sign.animationSrc ?? '',
                            }))}
                            selectedName={selectedLabel}
                            onSelect={select}
                            onPlayAll={() => playSequence(signLabels)}
                            onStopAll={stop}
                            isPlayingAll={isPlaying}
                            loading={queueLoading}
                        />

                        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="rubik text-sm font-semibold text-slate-700">Estado</p>
                            <p className="rubik mt-1 text-sm text-slate-600">{status}</p>
                            {translationResult?.glossOutput ? (
                                <p className="rubik mt-2 text-sm text-slate-700">
                                    <span className="font-semibold">Glosa:</span> {translationResult.glossOutput}
                                </p>
                            ) : null}
                            {translationResult?.signOutputRef ? (
                                <p className="rubik mt-1 text-sm text-slate-700">
                                    <span className="font-semibold">Referencias:</span> {translationResult.signOutputRef}
                                </p>
                            ) : null}
                            {error || signsError ? (
                                <p className="rubik mt-2 text-sm font-semibold text-rose-600">{error || signsError}</p>
                            ) : null}
                        </div>
                    </div>

                    <hr className="my-5 border-slate-200" />

                    <div>
                        <h2 className="rubik text-base font-semibold text-slate-900 mb-3">Depurar animacion</h2>
                        <div className="relative">
                            <textarea
                                className="rubik w-full rounded-xl border border-slate-300 bg-slate-50 p-3 pb-12 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#004aad] focus:outline-none focus:ring-2 focus:ring-[#004aad]/20 resize-y"
                                rows={4}
                                placeholder="Pega el base64 de la animacion aqui..."
                                value={base64Input}
                                onChange={(e) => setBase64Input(e.target.value)}
                            />
                            <button
                                onClick={handleSendBase64}
                                className="absolute bottom-2 right-2 rounded-xl bg-[#004aad] px-5 py-1.5 text-sm font-semibold text-white hover:bg-[#003a8a] transition"
                            >
                                Enviar
                            </button>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                            {customClips.length > 0 && (
                                <span className="rubik text-sm text-emerald-600">
                                    {customClips.length} clip(s) cargados
                                </span>
                            )}
                            {customClipError && (
                                <span className="rubik text-sm text-rose-600">{customClipError}</span>
                            )}
                        </div>
                    </div>
                </div>
                </div>

            <div className="w-[90vw] md:w-[75vw] mx-auto mt-8 mb-20 z-10">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="rubik text-lg font-semibold text-slate-900">Todas las senas</h2>
                            <button
                                onClick={reloadSigns}
                                className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                            >
                                Recargar
                            </button>
                        </div>
                        {signsLoading && (
                            <span className="rubik text-xs text-slate-400">Cargando...</span>
                        )}
                    </div>
                    {!signsLoading && entries.length === 0 ? (
                        <p className="rubik text-sm text-slate-500">No se encontraron senas.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {entries.map(({ sign }) => (
                                <div
                                    key={sign.id}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                                >
                                    {sign.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default TextToSing
