import { useEffect, useRef, useState } from 'react'
import { FiCamera, FiCornerDownRight, FiPlay, FiRefreshCw, FiStopCircle, FiUpload } from 'react-icons/fi'
import { useMediaCamera } from '../../hooks/useMediaCamara'
import { useVideoRecorder } from '../../hooks/useVideoRecorder'
import { useTranslationFlow } from '../../hooks/useTranslationFlow'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function TraductorPage() {
    const { videoRef, streamRef, isCameraOn, startCamera, stopCamera } = useMediaCamera()
    const { isRecording, recordedBlob, startRecording, stopRecording } = useVideoRecorder(streamRef.current)
    const [loading, setLoading] = useState(false);
    const {
        status,
        sourceText,
        error,
        isSendingModel,
        submitVideo,
        submitToBackend,
    } = useTranslationFlow()

    const selectedBlobRef = useRef<Blob | null>(null)

    useEffect(() => {
        selectedBlobRef.current = recordedBlob
    }, [recordedBlob])

    const onSendVideo = async () => {
        if (!selectedBlobRef.current) return

        setLoading(true)

        try {
    
            await submitVideo(selectedBlobRef.current)

            await submitToBackend()

        } finally {
            setLoading(false)
        }
}

    return (
    <main className="flex-1">
<div >
        {loading && <LoadingSpinner />}
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
            <div className="bg-white px-6 py-5 shadow-[0_18px_50px_rgba(0,74,173,0.12)] ring-1 ring-slate-200">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="rubik text-sm uppercase tracking-[0.22em] text-[#004aad]">Traductor</p>
                        <h1 className="bloksy mt-1 text-4xl text-slate-950 sm:text-5xl">Seña a texto</h1>
                    </div>
                </div>
            </div>

        <div className="grid flex-1 gap-4">
            <section className=" bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3 px-1 pb-3">
                    <div>
                        <h2 className="rubik text-lg font-semibold text-slate-900">Grabación</h2>
                        <p className="rubik text-sm text-slate-500">
                            Activa la cámara, graba y traduce las señas que tu quieras!!
                        </p>
                    </div>
                    <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${isRecording? 'bg-rose-100 text-rose-700': isCameraOn? 'bg-emerald-100 text-emerald-700': 'bg-slate-100 text-slate-500'}`}
                    >
                        {isRecording ? 'Grabando' : isCameraOn ? 'Cámara activa' : 'Detenida'}
                    </div>
                </div>

                <div className="overflow-hidden rounded-[1.25rem] bg-slate-950 shadow-inner">
                    <video ref={videoRef} autoPlay playsInline muted className="h-[500px] w-full object-contain" />
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
                        className="btn-2 bg-emerald-600"
                        disabled={!recordedBlob || isSendingModel} 
                        onClick={onSendVideo}>
                            <div className="svg-wrapper-1">
                                <div className="svg-wrapper">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                    >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path
                                        fill="currentColor"
                                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <span>{isSendingModel ? 'Procesando...' : 'Traducir'}</span>
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
                    <h1>{sourceText}</h1>
                    <p className="rubik mt-2 text-sm text-slate-600">{status}</p>
                    {error ? <p className="rubik mt-2 text-sm font-semibold text-rose-600">{error}</p> : <></>}
                </div>
            </section>

            </div>
        </div>
    </div>
    </main>

);

}