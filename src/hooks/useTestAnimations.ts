import { useEffect, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three-stdlib'
import { fetchTestAnimations } from '../services/TestAnimationService'
import type { AnimationData } from '../types/type'

interface TestClipEntry {
    animation: AnimationData
    clips: THREE.AnimationClip[]
}

interface UseTestAnimationsResult {
    entries: TestClipEntry[]
    loading: boolean
    error: string | null
    selectedName: string | null
    selectedClipNames: string[]
    select: (name: string | null) => void
    playAll: () => void
    stopAll: () => void
    isPlayingAll: boolean
    allClips: THREE.AnimationClip[]
}

export function useTestAnimations(): UseTestAnimationsResult {
    const [entries, setEntries] = useState<TestClipEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedName, setSelectedName] = useState<string | null>(null)
    const [playQueueIdx, setPlayQueueIdx] = useState<number>(-1)

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await fetchTestAnimations()
                const decoded: TestClipEntry[] = []

                for (const item of data) {
                    if (!item.base64) {
                        decoded.push({ animation: item, clips: [] })
                        continue
                    }
                    const binaryString = atob(item.base64)
                    const bytes = new Uint8Array(binaryString.length)
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i)
                    }
                    const gltf = await new Promise<GLTF>((resolve, reject) => {
                        new GLTFLoader().parse(bytes.buffer, '', resolve, reject)
                    })
                    decoded.push({ animation: item, clips: gltf.animations })
                }

                if (!cancelled) setEntries(decoded)
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load test animations')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => { cancelled = true }
    }, [])

    const activeEntryNames = useMemo(
        () => entries.filter((e) => e.clips.length > 0).map((e) => e.animation.name),
        [entries]
    )

    const entryClipNames = useMemo(() => {
        const map = new Map<string, string[]>()
        for (const e of entries) {
            const names = e.clips.map((c) => `${e.animation.name}::${c.name}`)
            map.set(e.animation.name, names)
        }
        return map
    }, [entries])

    const entryDuration = useMemo(() => {
        const map = new Map<string, number>()
        for (const e of entries) {
            const maxDur = e.clips.reduce((max, c) => Math.max(max, c.duration), 0)
            map.set(e.animation.name, maxDur)
        }
        return map
    }, [entries])

    const allClips = useMemo(() =>
        entries.flatMap((e) =>
            e.clips.map((c) => {
                const clone = c.clone()
                clone.name = `${e.animation.name}::${c.name}`
                return clone
            })
        ),
        [entries]
    )

    const selectedClipNames = useMemo(() => {
        if (!selectedName) return []
        return entryClipNames.get(selectedName) ?? []
    }, [selectedName, entryClipNames])

    const isPlayingAll = playQueueIdx >= 0

    const select = useCallback((name: string | null) => {
        setPlayQueueIdx(-1)
        setSelectedName(name)
    }, [])

    const playAll = useCallback(() => {
        if (activeEntryNames.length === 0) return
        setPlayQueueIdx(0)
        setSelectedName(activeEntryNames[0])
    }, [activeEntryNames])

    const stopAll = useCallback(() => {
        setPlayQueueIdx(-1)
        setSelectedName(null)
    }, [])

    useEffect(() => {
        if (playQueueIdx < 0 || playQueueIdx >= activeEntryNames.length) return

        const name = activeEntryNames[playQueueIdx]
        const dur = entryDuration.get(name) ?? 0
        if (dur <= 0) return

        const timer = setTimeout(() => {
            const next = playQueueIdx + 1
            if (next < activeEntryNames.length) {
                setPlayQueueIdx(next)
                setSelectedName(activeEntryNames[next])
            } else {
                setPlayQueueIdx(-1)
                setSelectedName(null)
            }
        }, dur * 1000 + 500)

        return () => clearTimeout(timer)
    }, [playQueueIdx, activeEntryNames, entryDuration])

    return {
        entries, loading, error,
        selectedName, selectedClipNames,
        select, playAll, stopAll, isPlayingAll,
        allClips,
    }
}
