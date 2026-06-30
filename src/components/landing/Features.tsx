import {
  FiBox,
  FiEye,
  FiMessageCircle,
  FiRefreshCcw,
  FiType,
} from 'react-icons/fi'

const features = [
  {
    icon: FiType,
    title: 'Texto a lengua de senas',
    text: 'Convierte frases escritas en representaciones visuales con apoyo del avatar.',
  },
  {
    icon: FiMessageCircle,
    title: 'Lengua de senas a texto',
    text: 'Procesa videos para obtener predicciones y construir una respuesta textual.',
  },
  {
    icon: FiRefreshCcw,
    title: 'Traduccion en tiempo real',
    text: 'Flujos pensados para reducir esperas y mantener una interaccion fluida.',
  },
  {
    icon: FiBox,
    title: 'Uso del modelo 3D',
    text: 'Visualizacion interactiva para reforzar el aprendizaje y la comprension.',
  },
  {
    icon: FiEye,
    title: 'Accesibilidad',
    text: 'Interfaz clara, responsive y orientada a usuarios con distintas necesidades.',
  },
]

function Features() {
  return (
    <section id="informacion" className="landing-section landing-section--soft">
      <div className="landing-container">
        <div className="landing-section__heading reveal">
          <p className="landing-eyebrow">Informacion</p>
          <h2>Funciones principales en una experiencia integrada.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid--features">
          {features.map(({ icon: Icon, title, text }) => (
            <article className="landing-feature-card reveal" key={title}>
              <span className="landing-icon">
                <Icon aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
