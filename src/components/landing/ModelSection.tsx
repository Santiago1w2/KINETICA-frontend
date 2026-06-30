import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { FiCpu, FiMessageSquare, FiRefreshCw } from 'react-icons/fi'
import { Model } from '../3DModel/Model'

const steps = [
  {
    icon: FiMessageSquare,
    title: 'Entrada',
    text: 'El usuario escribe texto o registra una sena desde el traductor.',
  },
  {
    icon: FiCpu,
    title: 'Procesamiento',
    text: 'El sistema interpreta la informacion y prepara una salida comprensible.',
  },
  {
    icon: FiRefreshCw,
    title: 'Visualizacion',
    text: 'El avatar 3D representa la traduccion con una experiencia clara e interactiva.',
  },
]

function ModelSection() {
  return (
    <section id="modelo" className="landing-section">
      <div className="landing-container landing-model">
        <div className="landing-model__copy reveal">
          <p className="landing-eyebrow">Modelo 3D</p>
          <h2>Un avatar visual para hacer la traduccion mas natural.</h2>
          <p>
            KINETICA usa el modelo 3D existente del proyecto para representar senas y acompanar
            la traduccion texto a lengua de senas con una experiencia visual directa.
          </p>
          <div className="landing-model__steps">
            {steps.map(({ icon: Icon, title, text }) => (
              <article className="landing-mini-card reveal" key={title}>
                <Icon aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="landing-model__viewer reveal" aria-label="Avatar 3D de KINETICA">
          <Canvas camera={{ position: [0, 1.8, 8], fov: 45 }} gl={{ alpha: true }}>
            <ambientLight intensity={1.8} />
            <directionalLight position={[4, 6, 6]} intensity={2.2} />
            <group position={[0, -0.8, 0]} scale={1.12}>
              <Model />
            </group>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.2} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}

export default ModelSection
