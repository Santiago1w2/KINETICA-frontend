import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three-stdlib'
import { fetchSigns, fetchSignsByIds } from '../services/SignService'
import type { SignResponse } from '../types/sings/type'

interface SignEntry {
    sign: SignResponse
    clips: THREE.AnimationClip[]
}

interface UseSignQueueResult {
    entries: SignEntry[]
    loading: boolean
    error: string | null
    selectedLabel: string | null
    selectedClipNames: string[]
    allClips: THREE.AnimationClip[]
    select: (label: string | null) => void
    loadByIds: (ids: number[]) => Promise<void>
    loadByLabels: (labels: string[]) => Promise<void>
    playSequence: (labels: string[]) => void
    stop: () => void
    isPlaying: boolean
    signLabels: string[]
}

function extractBase64(src: string): string {
    const commaIdx = src.indexOf(',')
    return commaIdx !== -1 ? src.slice(commaIdx + 1) : src
}

async function decodeAnimationSrc(animationSrc: string): Promise<THREE.AnimationClip[]> {
    const base64 = extractBase64(animationSrc)
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    const gltf = await new Promise<GLTF>((resolve, reject) => {
        new GLTFLoader().parse(bytes.buffer, '', resolve, reject)
    })
    return gltf.animations
}

export function useSignQueue(): UseSignQueueResult {
    const [entries, setEntries] = useState<SignEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
    const [playQueue, setPlayQueue] = useState<string[]>([])
    const [playIdx, setPlayIdx] = useState(-1)
    const cancelledRef = useRef(false)

    useEffect(() => {
        return () => { cancelledRef.current = true }
    }, [])

    const processSigns = useCallback(async (signs: SignResponse[]) => {
        const results: SignEntry[] = []
        for (const sign of signs) {
            try {
                const clips = sign.animationSrc
                    ? await decodeAnimationSrc(sign.animationSrc)
                    : []
                results.push({ sign, clips })
            } catch {
                results.push({ sign, clips: [] })
            }
        }
        return results
    }, [])

    const loadByIds = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return
        setLoading(true)
        setError(null)
        try {
            const signs = await fetchSignsByIds(ids)
            if (cancelledRef.current) return
            const processed = await processSigns(signs)
            if (cancelledRef.current) return
            setEntries(processed)
        } catch (err) {
            if (!cancelledRef.current) {
                setError(err instanceof Error ? err.message : 'Failed to load signs')
            }
        } finally {
            if (!cancelledRef.current) setLoading(false)
        }
    }, [processSigns])

    const loadByLabels = useCallback(async (labels: string[]) => {
        const normalizedLabels = labels
            .map((label) => normalizeSignKey(label))
            .filter(Boolean)

        if (normalizedLabels.length === 0) return

        setLoading(true)
        setError(null)
        try {
            const signs = await fetchSigns()
            if (cancelledRef.current) return

            const filteredSigns = signs.filter((sign) =>
                normalizedLabels.includes(normalizeSignKey(sign.label ?? ''))
            )

            const processed = await processSigns(filteredSigns)
            if (cancelledRef.current) return
            setEntries(processed)
        } catch (err) {
            if (!cancelledRef.current) {
                setError(err instanceof Error ? err.message : 'Failed to load signs')
            }
        } finally {
            if (!cancelledRef.current) setLoading(false)
        }
    }, [processSigns])

    const activeEntryLabels = useMemo(
        () => entries.filter((e) => e.clips.length > 0).map((e) => e.sign.label),
        [entries]
    )

    const entryClipNamesMap = useMemo(() => {
        const map = new Map<string, string[]>()
        for (const e of entries) {
            const names = e.clips.map((c) => `${e.sign.label}::${c.name}`)
            map.set(e.sign.label, names)
        }
        return map
    }, [entries])

    const entryDuration = useMemo(() => {
        const map = new Map<string, number>()
        for (const e of entries) {
            const maxDur = e.clips.reduce((max, c) => Math.max(max, c.duration), 0)
            map.set(e.sign.label, maxDur)
        }
        return map
    }, [entries])

    const allClips = useMemo(() =>
        entries.flatMap((e) =>
            e.clips.map((c) => {
                const clone = c.clone()
                clone.name = `${e.sign.label}::${c.name}`
                return clone
            })
        ),
        [entries]
    )

    const selectedClipNames = useMemo(() => {
        if (!selectedLabel) return []
        return entryClipNamesMap.get(selectedLabel) ?? []
    }, [selectedLabel, entryClipNamesMap])

    const isPlaying = playIdx >= 0

    const select = useCallback((label: string | null) => {
        setPlayIdx(-1)
        setPlayQueue([])
        setSelectedLabel(label)
    }, [])

    const playSequence = useCallback((labels: string[]) => {
        const available = labels.filter((l) => activeEntryLabels.includes(l))
        if (available.length === 0) return
        setPlayQueue(available)
        setPlayIdx(0)
        setSelectedLabel(available[0])
    }, [activeEntryLabels])

    const stop = useCallback(() => {
        setPlayIdx(-1)
        setPlayQueue([])
        setSelectedLabel(null)
    }, [])

    useEffect(() => {
        if (playIdx < 0 || playIdx >= playQueue.length) return

        const label = playQueue[playIdx]
        const dur = entryDuration.get(label) ?? 0
        if (dur <= 0) return

        const timer = setTimeout(() => {
            const next = playIdx + 1
            if (next < playQueue.length) {
                setPlayIdx(next)
                setSelectedLabel(playQueue[next])
            } else {
                setPlayIdx(-1)
                setPlayQueue([])
                setSelectedLabel(null)
            }
        }, dur * 1000 + 500)

        return () => clearTimeout(timer)
    }, [playIdx, playQueue, entryDuration])

    const signLabels = useMemo(
        () => entries.filter((e) => e.clips.length > 0).map((e) => e.sign.label),
        [entries]
    )

    return {
        entries,
        loading,
        error,
        selectedLabel,
        selectedClipNames,
        allClips,
        signLabels,
        select,
        loadByIds,
        loadByLabels,
        playSequence,
        stop,
        isPlaying,
    }
}

function normalizeSignKey(value: string) {
    return value.trim().toLowerCase()
}
