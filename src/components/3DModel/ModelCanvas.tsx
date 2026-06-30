import { Canvas } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { Model } from './Model'
import { OrbitControls } from '@react-three/drei'
import { useAnimation } from '../../hooks/useAnimation'
import BoneFocus from './BoneFocus'
import type { BoneFocusHandle } from './BoneFocus'
import AnimationSpeedSlider from './AnimationSpeedSlider'

interface ModelCanvasProps {
  activeClips?: string[]
  testClips?: THREE.AnimationClip[]
  onClearTestSelection?: () => void
}

const FOCUS_BONES = [
  { key: 'cabeza', label: 'Cabeza' },
  { key: 'palma_L', label: 'Palma Izq' },
  { key: 'palma_R', label: 'Palma Der' },
] as const


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

function ModelCanvas({ activeClips, testClips }: ModelCanvasProps): React.JSX.Element {
  const activeAnim = null
  const { signBase64 } = useAnimation()
  const boneFocusRef = useRef<BoneFocusHandle>(null!)
  const [speed, setSpeed] = useState<number>(1)


  return (
    <div className="w-full h-full bg-[#020617] relative overflow-hidden rounded-xl">
      
      {/* 2. Magenta Orb Grid Background (z-0) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />

      <div className="absolute inset-0 z-10 w-full h-full">
        <Canvas camera={{ position: [0, 2, 10], fov: 60 }} gl={{ alpha: true }}>
          <Model
            activeAnim={activeAnim}
            activeClips={activeClips}
            signBase64={signBase64}
            testClips={testClips}
            timeScale={speed}
          />
          <OrbitControls enableZoom={true} makeDefault dampingFactor={0.1} />
          <BoneFocus ref={boneFocusRef} />
        </Canvas>
      </div>

      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
        <AnimationSpeedSlider speed={speed} onSpeedChange={setSpeed} />
      </div>
        
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 20,
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
    </div>
  )
}

export default ModelCanvas
