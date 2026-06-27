import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbitControlsLike {
  target: THREE.Vector3
  update: () => void
}

export interface BoneFocusHandle {
  focusOn: (name: string) => void
}

const BoneFocus = forwardRef<BoneFocusHandle>((_props, ref) => {
  const { scene, controls } = useThree()
  const bonesRef = useRef<Map<string, THREE.Object3D>>(new Map())

  useEffect(() => {
    const map = new Map<string, THREE.Object3D>()
    scene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        map.set(child.name, child)
      }
    })
    bonesRef.current = map
  }, [scene])

  useImperativeHandle(ref, () => ({
    focusOn: (name: string) => {
      const bone = bonesRef.current.get(name)
      if (!bone || !controls) return
      const oc = controls as unknown as OrbitControlsLike
      const pos = new THREE.Vector3()
      bone.getWorldPosition(pos)
      oc.target.copy(pos)
      oc.update()
    }
  }))

  return null
})

export default BoneFocus
