import { useEffect, useRef, useState } from 'react'

function getSupportedMimeType() {
    const candidates = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
    ]
    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? ''
}

export function useVideoRecorder(stream: MediaStream | null) {
    const recorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const [isRecording, setIsRecording] = useState(false)
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

    useEffect(() => {
        return () => {
            if (recorderRef.current && recorderRef.current.state === 'recording') {
                recorderRef.current.stop()
            }
        }
    }, [])

const startRecording = () => {
    if (!stream) {
        throw new Error('Primero prende la camara.')
    }

    chunksRef.current = []
    setRecordedBlob(null)

    const mimeType = getSupportedMimeType()
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)

    recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunksRef.current.push(event.data)
        }
    }

    recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' })
        setRecordedBlob(blob)
        setIsRecording(false)
    }

    recorderRef.current = recorder
    recorder.start()
    setIsRecording(true)
    }

    const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
        recorderRef.current.stop()
    }
    }

    return {
        isRecording,
        recordedBlob,
        startRecording,
        stopRecording,
    }
}