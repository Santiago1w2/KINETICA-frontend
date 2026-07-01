import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three-stdlib'

type AnimationEntry = {
    name: string
    clips: THREE.AnimationClip[]
}

let cache: AnimationEntry[] | null = null
let loading: Promise<AnimationEntry[]> | null = null

async function decodeBase64(base64: string): Promise<THREE.AnimationClip[]> {
    const commaIdx = base64.indexOf(',')
    const raw = commaIdx !== -1 ? base64.slice(commaIdx + 1) : base64
    const binaryString = atob(raw)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    const gltf = await new Promise<GLTF>((resolve, reject) => {
        new GLTFLoader().parse(bytes.buffer, '', resolve, reject)
    })
    return gltf.animations
}

async function fetchAnimationsJson(): Promise<AnimationEntry[]> {
    if (cache) return cache
    if (loading) return loading

    loading = (async () => {
        const response = await fetch('/TestAnimations/animations.json')
        if (!response.ok) {
            throw new Error('Failed to load animations.json')
        }
        const data: { name: string; base64: string }[] = await response.json()
        const entries: AnimationEntry[] = []
        for (const item of data) {
            try {
                const clips = await decodeBase64(item.base64)
                entries.push({ name: item.name, clips })
            } catch {
                entries.push({ name: item.name, clips: [] })
            }
        }
        cache = entries
        return entries
    })()

    return loading
}

export async function getAnimationClipsByName(names: string[]): Promise<THREE.AnimationClip[]> {
    const entries = await fetchAnimationsJson()
    const result: THREE.AnimationClip[] = []
    for (const name of names) {
        const entry = entries.find((e) => e.name === name)
        if (entry) {
            for (const clip of entry.clips) {
                const clone = clip.clone()
                clone.name = name
                result.push(clone)
            }
        }
    }
    return result
}
