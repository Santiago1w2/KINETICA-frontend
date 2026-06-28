import { useEffect, useRef, useState } from 'react'

export function useMediaCamera() {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const [isCameraOn, setIsCameraOn] = useState(false)

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop())
        }
    }, [])

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        streamRef.current = stream
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
        setIsCameraOn(true)
    }

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
        setIsCameraOn(false)
    }

    return {
        videoRef,
        streamRef,
        isCameraOn,
        startCamera,
        stopCamera,
    }
}
