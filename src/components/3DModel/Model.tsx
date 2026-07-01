import * as THREE from 'three'
import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { type GLTF, SkeletonUtils, GLTFLoader } from 'three-stdlib'
import { getAnimationClipsByName } from '../../services/animationLoader'


type GLTFResult = GLTF & {
  nodes: {
    CHULLO: THREE.SkinnedMesh
    raiz: THREE.Bone
  }
  materials: {}
}

type ModelProps = React.JSX.IntrinsicElements['group'] & {
  activeAnim?: string | null
  activeClips?: string[]
  signBase64?: string | null
  testClips?: THREE.AnimationClip[]
  timeScale?: number
}

function useSignClips(signBase64: string | null): THREE.AnimationClip[] {
  const [clips, setClips] = React.useState<THREE.AnimationClip[]>([])
  React.useEffect(() => {
    if (!signBase64) return
    const binary = atob(signBase64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    new GLTFLoader().parse(bytes.buffer, '', (gltf) => setClips(gltf.animations))
  }, [signBase64])
  return clips
}

const BUILTIN_NAMES = ['SaludoEM', 'Suspendido']

export function Model({ activeAnim = null, activeClips, signBase64 = null, testClips = [], timeScale = 1, ...props }: ModelProps) {
  const group = React.useRef<THREE.Group>(null!)
  const { scene, animations: mainAnims } = useGLTF('/chullov1.1-transformed.glb')

  const signClips = useSignClips(signBase64)
  const [builtinClips, setBuiltinClips] = React.useState<THREE.AnimationClip[]>([])

  React.useEffect(() => {
    let cancelled = false
    getAnimationClipsByName(BUILTIN_NAMES).then((clips) => {
      if (!cancelled) setBuiltinClips(clips)
    })
    return () => { cancelled = true }
  }, [])

  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone) as unknown as GLTFResult
  const allClips = React.useMemo(
    () => [...mainAnims, ...signClips, ...testClips, ...builtinClips],
    [mainAnims, signClips, testClips, builtinClips],
  )
  const { actions } = useAnimations(allClips, group)

  const hasUserAnim = activeAnim !== null || (activeClips !== undefined && activeClips.length > 0)
  const entrancePlayed = React.useRef(false)

  React.useEffect(() => {
    if (hasUserAnim) return

    const entranceClip = actions['SaludoEM']
    const idleClip = actions['Suspendido']
    if (!entranceClip && !idleClip) return

    if (entrancePlayed.current) {
      if (idleClip && !idleClip.isRunning()) {
        idleClip.reset().play()
        idleClip.timeScale = timeScale
      }
      return
    }

    if (entranceClip) {
      entranceClip.reset().play()
      entranceClip.timeScale = timeScale
      entrancePlayed.current = true

      const mixer = entranceClip.getMixer()
      const onFinished = () => {
        if (idleClip) {
          idleClip.reset().play()
          idleClip.timeScale = timeScale
        }
      }
      mixer.addEventListener('finished', onFinished)
      return () => mixer.removeEventListener('finished', onFinished)
    } else if (idleClip) {
      idleClip.reset().play()
      idleClip.timeScale = timeScale
      entrancePlayed.current = true
    }
  }, [actions, hasUserAnim, timeScale])

  const seqIdxRef = React.useRef(0)
  const seqCleanupRef = React.useRef<(() => void) | null>(null)

  React.useEffect(() => {
    if (!hasUserAnim) return

    seqCleanupRef.current?.()
    seqCleanupRef.current = null
    seqIdxRef.current = 0

    Object.values(actions).forEach((a) => a?.stop())

    const names = activeClips && activeClips.length > 0
      ? activeClips
      : (activeAnim ? [activeAnim] : [])

    if (names.length === 0) return

    const mixer = actions[names[0]]?.getMixer()
    if (!mixer) return

    const playNext = () => {
      const idx = seqIdxRef.current
      if (idx >= names.length) return

      const name = names[idx]
      const action = actions[name]
      if (!action) return

      action.reset()
      action.loop = THREE.LoopOnce
      action.clampWhenFinished = true
      action.play()
      action.timeScale = timeScale
    }

    const onFinished = () => {
      seqIdxRef.current++
      playNext()
    }

    mixer.addEventListener('finished', onFinished)
    seqCleanupRef.current = () => {
      mixer.removeEventListener('finished', onFinished)
    }

    playNext()
  }, [activeAnim, activeClips, actions, hasUserAnim, timeScale])

  React.useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (action) {
        action.timeScale = timeScale
      }
    })
  }, [timeScale, actions])

  const flatMat = React.useMemo(() => new THREE.MeshBasicMaterial({
    flatShading: true,
    vertexColors: true,
    skinning: true,
    side: THREE.DoubleSide,
  } as any), [])
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" position={[0, -0.991, -0.247]}>
          <primitive object={nodes.raiz} />
        </group>
        <skinnedMesh name="CHULLO" geometry={nodes.CHULLO.geometry} material={flatMat} skeleton={nodes.CHULLO.skeleton} position={[0, -0.991, -0.247]} />
      </group>
    </group>
  )
}

useGLTF.preload('/chullov1.1-transformed.glb')
