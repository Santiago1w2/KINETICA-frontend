import { useEffect, useState } from 'react'
import { fetchAnimation } from '../services/AnimationService'

interface UseAnimationResult {
    signBase64: string | null
    loading: boolean
    error: string | null
}

export function useAnimation(animationId?: number): UseAnimationResult {
    const [signBase64, setSignBase64] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await fetchAnimation(animationId)
                setSignBase64(data.glbBase64)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load animation')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [animationId])

    return { signBase64, loading, error }
}
