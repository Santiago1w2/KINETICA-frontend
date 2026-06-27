import * as THREE from 'three'
import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { type GLTF, SkeletonUtils, GLTFLoader } from 'three-stdlib'


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

export function Model({ activeAnim = null, activeClips, signBase64 = null, testClips = [], ...props }: ModelProps) {
  const group = React.useRef<THREE.Group>(null!)
  const { scene, animations: mainAnims } = useGLTF('/chullov1.1-transformed.glb')

  const signClips = useSignClips(signBase64)

  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone) as unknown as GLTFResult
  const allClips = React.useMemo(
    () => [...mainAnims, ...signClips, ...testClips],
    [mainAnims, signClips, testClips],
  )
  const { actions } = useAnimations(allClips, group)

  React.useEffect(() => {
    Object.values(actions).forEach((a) => a?.fadeOut(0.3))

    const names = activeClips && activeClips.length > 0
      ? activeClips
      : (activeAnim ? [activeAnim] : [])

    names.forEach((name) => {
      if (actions[name]) {
        actions[name]!.reset().play()
      }
    })
  }, [activeAnim, activeClips, actions])

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
