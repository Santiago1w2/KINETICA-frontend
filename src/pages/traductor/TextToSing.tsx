import { useEffect, useMemo, useState } from 'react'
import AnimationList from '../../components/AnimationList'
import { useSigns } from '../../hooks/useSigns'
import SeniaTextInput from '../../components/SeniaTextInput'
import ModelCanvas from '../../components/3DModel/ModelCanvas'
import { createTranslation, pollTranslation } from '../../services/translationService'
import { useSignQueue } from '../../hooks/useSignQueue'
import type { TranslationResponse } from '../../types/translator/type'
import LoadingSpinner from '../../components/LoadingSpinner'

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
    const [loadingMessage, setLoadingMessage] = useState('Generando glosas...')
    const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null)
    const [shouldPlayLoadedSigns, setShouldPlayLoadedSigns] = useState(false)

    const {
        entries,
        loading: signsLoading,
        selectedLabel: selectedName,
        selectedClipNames,
        select: signSelect,
        playAll,
        stopAll,
        isPlayingAll,
        allClips,
    } = useSigns()

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
        setLoadingMessage('Generando glosas...')
        setStatus('Enviando texto al backend...')

        try {
            const requestId = await createTranslation('TEXT_TO_SIGN', sourceText)
            setStatus('Backend acepto la traduccion. Consultando resultado...')

            const result = await pollTranslation(requestId)
            setTranslationResult(result)

            const signRef = result.signOutputRef?.trim() ?? ''
            const ids = parseNumberList(signRef)

            if (ids.length > 0) {
                setLoadingMessage('Preparando animacion...')
                setStatus('Cargando senas por id...')
                await loadByIds(ids)
                setShouldPlayLoadedSigns(true)
            } else {
                const labels = getSignLabels(result)
                if (labels.length === 0) {
                    throw new Error('El backend no devolvio glosas o referencias de senas.')
                }

                setLoadingMessage('Preparando animacion...')
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
                    activeClips={selectedClipNames}
                    testClips={allClips}
                    onClearTestSelection={() => signSelect(null)}
                />
            </div>

     
            <div className="w-[90vw] md:w-[75vw] flex flex-col md:flex-row gap-6 mt-10 mb-20 z-10">
                
         
                <div className="flex-1">
                    <SeniaTextInput onTranslate={(t) => console.log("Padre recibió:", t)} />
                </div>

         
                <div className="flex-1">
                    <AnimationList
                        animations={entries.map((e) => ({ name: e.sign.label }))}
                        selectedName={selectedName}
                        onSelect={(name) => signSelect(name)}
                        onPlayAll={playAll}
                        onStopAll={stopAll}
                        isPlayingAll={isPlayingAll}
                        loading={signsLoading}
                    />
                </div>

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
                                {isPlaying ? 'Reproduciendo' : `${entries.length} senas`}
                            </span>
                        </div>

                        <AnimationList
                            animations={entries.map((entry) => ({
                                name: entry.sign.label,
                                base64: entry.sign.animationSrc ?? '',
                            }))}
                            selectedName={selectedLabel}
                            onSelect={select}
                            onPlayAll={() => playSequence(signLabels)}
                            onStopAll={stop}
                            isPlayingAll={isPlaying}
                            loading={signsLoading}
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
                </div>
            </section>
        </main>
    )
}

export default TextToSing
