import { Canvas } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three'
import { Model } from './Model'
import { Grid, OrbitControls } from '@react-three/drei'
import { useAnimation } from '../../hooks/useAnimation'
import BoneFocus from './BoneFocus'
import type { BoneFocusHandle } from './BoneFocus'

interface ModelCanvasProps {
  activeClips?: string[]
  testClips?: THREE.AnimationClip[]
  onClearTestSelection?: () => void
}

const ANIMS = [
  { key: 'sixseven', label: 'Sixseven' },
  { key: 'count1', label: 'Count 1' },
] as const

const FOCUS_BONES = [
  { key: 'cabeza', label: 'Cabeza' },
  { key: 'palma_L', label: 'Palma Izq' },
  { key: 'palma_R', label: 'Palma Der' },
] as const

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: '#252525',
  position: 'relative',
}

const barStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 32,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  display: 'flex',
  gap: 12,
}

const btnStyle = (active: boolean): React.CSSProperties => ({
  padding: '10px 22px',
  fontSize: 15,
  border: active ? '2px solid #fff' : '2px solid #666',
  borderRadius: 8,
  background: active ? '#555' : '#2a2a2a',
  color: active ? '#fff' : '#999',
  cursor: 'pointer',
  transition: 'all 0.15s',
})

const cornerBtnStyle: React.CSSProperties = {
  padding: '6px 14px',
  fontSize: 13,
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: 6,
  background: 'rgba(0,0,0,0.5)',
  color: '#ccc',
  cursor: 'pointer',
  transition: 'all 0.15s',
}

function ModelCanvas({ activeClips, testClips, onClearTestSelection }: ModelCanvasProps): React.JSX.Element {
  const [activeAnim, setActiveAnim] = React.useState<string | null>(null)
  const { signBase64 } = useAnimation()
  const boneFocusRef = React.useRef<BoneFocusHandle>(null!)

  const toggle = (key: string) => {
    onClearTestSelection?.()
    setActiveAnim((prev) => (prev === key ? null : key))
  }

  return (
    <div style={containerStyle}>
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <Model
          activeAnim={activeAnim}
          activeClips={activeClips}
          signBase64={signBase64}
          testClips={testClips}
        />
        <Grid cellColor="#6f6f6f" sectionColor="#9d9d9d" infiniteGrid />
        <OrbitControls enableZoom={true} makeDefault />
        <BoneFocus ref={boneFocusRef} />
      </Canvas>
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        display: 'flex',
        gap: 6,
      }}>
        {FOCUS_BONES.map(({ key, label }) => (
          <button
            key={key}
            style={cornerBtnStyle}
            onClick={() => boneFocusRef.current.focusOn(key)}
            onPointerEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.color = '#fff'
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.5)'
              e.currentTarget.style.color = '#ccc'
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={barStyle}>
        {ANIMS.map(({ key, label }) => (
          <button
            key={key}
            style={btnStyle(activeAnim === key)}
            onClick={() => toggle(key)}
          >
            {activeAnim === key ? `◼ ${label}` : `▶ ${label}`}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ModelCanvas
