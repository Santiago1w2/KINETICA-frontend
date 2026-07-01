import { useEffect, useState } from 'react'
import { fetchSign } from '../services/AnimationService'

interface UseAnimationResult {
    signBase64: string | null
    loading: boolean
    error: string | null
}

export function useAnimation(signId?: number): UseAnimationResult {
    const [signBase64, setSignBase64] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (signId === undefined) return
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await fetchSign(signId)
                setSignBase64(data.animationSrc ?? null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load sign')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [signId])

    return { signBase64, loading, error }
}
