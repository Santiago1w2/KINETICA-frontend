import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Model } from '../3DModel/Model'

function HeroModel() {
  return (
    <div className="hero-model-container">
      <Canvas camera={{ position: [0, 1.5, 15], fov: 30 }} gl={{ alpha: true }}>
        <ambientLight intensity={2} />
        <directionalLight position={[4, 6, 6]} intensity={2.5} />
        <group position={[0, -0.9, 0]} scale={0.95}>
          <Model timeScale={0.5} />
        </group>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  )
}

export default HeroModel
