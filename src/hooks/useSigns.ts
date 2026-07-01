import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three-stdlib'
import { fetchAllSigns } from '../services/AnimationService'
import type { SignResponse } from '../types/sings/type'

interface SignEntry {
    sign: SignResponse
    clips: THREE.AnimationClip[]
}

interface UseSignsResult {
    entries: SignEntry[]
    loading: boolean
    error: string | null
    selectedLabel: string | null
    selectedClipNames: string[]
    select: (label: string | null) => void
    playAll: () => void
    stopAll: () => void
    isPlayingAll: boolean
    allClips: THREE.AnimationClip[]
    reload: () => void
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

export function useSigns(): UseSignsResult {
    const [entries, setEntries] = useState<SignEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
    const [playQueueIdx, setPlayQueueIdx] = useState<number>(-1)
    const cancelRef = useRef(false)

    const load = useCallback(async () => {
        cancelRef.current = false
        try {
            setLoading(true)
            setError(null)
            const signs = await fetchAllSigns()
            if (cancelRef.current) return

            const decoded: SignEntry[] = []
            for (const sign of signs) {
                try {
                    const clips = sign.animationSrc
                        ? await decodeAnimationSrc(sign.animationSrc)
                        : []
                    decoded.push({ sign, clips })
                } catch {
                    decoded.push({ sign, clips: [] })
                }
            }
            if (!cancelRef.current) setEntries(decoded)
        } catch (err) {
            if (!cancelRef.current) setError(err instanceof Error ? err.message : 'Failed to load signs')
        } finally {
            if (!cancelRef.current) setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
        return () => { cancelRef.current = true }
    }, [load])

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

    const isPlayingAll = playQueueIdx >= 0

    const select = useCallback((label: string | null) => {
        setPlayQueueIdx(-1)
        setSelectedLabel(label)
    }, [])

    const playAll = useCallback(() => {
        if (activeEntryLabels.length === 0) return
        setPlayQueueIdx(0)
        setSelectedLabel(activeEntryLabels[0])
    }, [activeEntryLabels])

    const stopAll = useCallback(() => {
        setPlayQueueIdx(-1)
        setSelectedLabel(null)
    }, [])

    useEffect(() => {
        if (playQueueIdx < 0 || playQueueIdx >= activeEntryLabels.length) return

        const label = activeEntryLabels[playQueueIdx]
        const dur = entryDuration.get(label) ?? 0
        if (dur <= 0) return

        const timer = setTimeout(() => {
            const next = playQueueIdx + 1
            if (next < activeEntryLabels.length) {
                setPlayQueueIdx(next)
                setSelectedLabel(activeEntryLabels[next])
            } else {
                setPlayQueueIdx(-1)
                setSelectedLabel(null)
            }
        }, dur * 1000 + 500)

        return () => clearTimeout(timer)
    }, [playQueueIdx, activeEntryLabels, entryDuration])

    const reload = useCallback(() => {
        load()
    }, [load])

    return {
        entries, loading, error,
        selectedLabel, selectedClipNames,
        select, playAll, stopAll, isPlayingAll,
        allClips,
        reload,
    }
}