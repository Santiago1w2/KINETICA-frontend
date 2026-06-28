import { useEffect, useRef } from 'react'
import { FiCamera, FiCornerDownRight, FiPlay, FiRefreshCw, FiStopCircle, FiUpload } from 'react-icons/fi'
import { useMediaCamera } from '../hooks/useMediaCamara'
import { useVideoRecorder } from '../hooks/useVideoRecorder'
import { useTranslationFlow } from '../hooks/useTranslationFlow'

export default function TraductorPage() {
    const { videoRef, streamRef, isCameraOn, startCamera, stopCamera } = useMediaCamera()
    const { isRecording, recordedBlob, startRecording, stopRecording } = useVideoRecorder(streamRef.current)
    const {
        predictions,
        sourceText,
        setSourceText,
        finalText,
        status,
        error,
        isSendingModel,
        isSendingBackend,
        submitVideo,
        submitToBackend,
    } = useTranslationFlow()

    const selectedBlobRef = useRef<Blob | null>(null)

    useEffect(() => {
        selectedBlobRef.current = recordedBlob
    }, [recordedBlob])

    const onSendVideo = async () => {
        if (!selectedBlobRef.current) return
        await submitVideo(selectedBlobRef.current)
    }

    return (
    <div className="min-h-screen bg-[#eef5fb] text-slate-900">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-4 rounded-[1.5rem] bg-white px-6 py-5 shadow-[0_18px_50px_rgba(0,74,173,0.12)] ring-1 ring-slate-200">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="rubik text-sm uppercase tracking-[0.22em] text-[#004aad]">Traductor</p>
                        <h1 className="bloksy mt-1 text-4xl text-slate-950 sm:text-5xl">Video a texto</h1>
                    </div>
                </div>
            </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[1.5rem] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3 px-1 pb-3">
                    <div>
                        <h2 className="rubik text-lg font-semibold text-slate-900">Grabación</h2>
                        <p className="rubik text-sm text-slate-500">
                            Activa la cámara, graba y procesa el video completo.
                        </p>
                    </div>
                    <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${isRecording? 'bg-rose-100 text-rose-700': isCameraOn? 'bg-emerald-100 text-emerald-700': 'bg-slate-100 text-slate-500'}`}
                    >
                        {isRecording ? 'Grabando' : isCameraOn ? 'Cámara activa' : 'Detenida'}
                    </div>
                </div>

                <div className="overflow-hidden rounded-[1.25rem] bg-slate-950 shadow-inner">
                    <video ref={videoRef} autoPlay playsInline muted className="h-[320px] w-full object-cover sm:h-[420px]" />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={startCamera}
                        className="inline-flex items-center gap-2 rounded-full bg-[#004aad] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-
                        700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isCameraOn}
                    >
                        <FiCamera />
                        Prender cámara
                    </button>

                    <button
                        type="button"
                        onClick={startRecording}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-
                        800 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!isCameraOn || isRecording}
                    >
                        <FiPlay />
                        Iniciar grabación
                    </button>

                    <button
                        type="button"
                        onClick={stopRecording}
                        className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700
                        disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!isRecording}
                    >
                        <FiStopCircle />
                        Detener
                    </button>

                    <button
                        type="button"
                        onClick={onSendVideo}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-
                        emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!recordedBlob || isSendingModel}
                    >
                        <FiUpload />
                        {isSendingModel ? 'Procesando...' : 'Enviar al modelo'}
                    </button>

                    <button
                        type="button"
                        onClick={stopCamera}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700
                        transition hover:bg-slate-50"
                    >
                        <FiRefreshCw />
                        Apagar cámara
                    </button>
                </div>

                <div className="mt-4 rounded-[1rem] bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FiCornerDownRight className="text-[#004aad]" />
                        Estado
                    </div>
                    <p className="rubik mt-2 text-sm text-slate-600">{status}</p>
                    {error ? <p className="rubik mt-2 text-sm font-semibold text-rose-600">{error}</p> : <></>}
                </div>
            </section>

            <section className="grid gap-4">
                <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
                        <h2 className="rubik text-lg font-semibold text-slate-900">Predicción del modelo</h2>
                        <p className="rubik mt-1 text-sm text-slate-500">
                        Se muestra la secuencia limpia que sale del video.
                        </p>
                    <div className="mt-4 min-h-36 rounded-[1rem] bg-slate-50 p-4 ring-1 ring-slate-200">
                        {predictions.length ? (
                        <div className="space-y-2">
                            {predictions.map((item, index) => (
                            <div
                                key={`${item.frame ?? index}-${item.timestamp ?? index}`}
                                className="flex items-center justify-between rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200"
                                >
                                <span className="text-sm text-slate-500">{Number(item.timestamp ?? 0).toFixed(2)}s</span>
                                <span className="text-sm font-semibold text-slate-900">{item.sign}</span>
                            </div>))}
                        </div>
                        ) : (
                        <p className="rubik text-sm text-slate-500">Aún no hay predicciones.</p>
                        )}
                    </div>

                    <label className="rubik mt-4 block text-sm font-semibold text-slate-700">Texto base</label>
                    <textarea
                        value={sourceText}
                        onChange={(event) => setSourceText(event.target.value)}
                        className="mt-2 min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition
                        focus:border-[#004aad]"
                        placeholder="Aquí aparecerá la secuencia del modelo"
                    />

                    <div className="mt-3 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={submitToBackend}
                            className="inline-flex items-center gap-2 rounded-full bg-[#004aad] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-
                            700 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!sourceText.trim() || isSendingBackend}
                        >
                            <FiUpload />
                            {isSendingBackend ? 'Enviando...' : 'Mandar al backend'}
                        </button>
                    </div>
                </div>

                <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
                    <h2 className="rubik text-lg font-semibold text-slate-900">Resultado final</h2>
                    <p className="rubik mt-1 text-sm text-slate-500">
                    La respuesta final viene del backend y no expone tokens ni endpoints en pantalla.
                    </p>

                    <div className="mt-4 rounded-[1rem] bg-slate-50 p-4 ring-1 ring-slate-200">
                        <label className="rubik block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Oración mejorada
                        </label>
                        <div className="mt-2 min-h-28 rounded-xl bg-white px-4 py-3 text-sm text-slate-800 ring-1 ring-slate-200">
                        {finalText || 'Aún no hay resultado final.'}
                        </div>
                    </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    )
}