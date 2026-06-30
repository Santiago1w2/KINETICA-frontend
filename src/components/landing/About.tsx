import { FiEye, FiFlag, FiTarget } from 'react-icons/fi'

const cards = [
  {
    icon: FiTarget,
    title: 'Objetivo',
    text: 'Reducir barreras de comunicacion entre personas sordas, oyentes e instituciones.',
  },
  {
    icon: FiFlag,
    title: 'Mision',
    text: 'Crear una experiencia de traduccion clara, rapida y accesible para escenarios cotidianos.',
  },
  {
    icon: FiEye,
    title: 'Vision',
    text: 'Impulsar herramientas inclusivas que acerquen la tecnologia a mas comunidades.',
  },
]

function About() {
  return (
    <section id="nosotros" className="landing-section landing-section--soft">
      <div className="landing-container">
        <div className="landing-section__heading reveal">
          <p className="landing-eyebrow">Quienes somos</p>
          <h2>Un proyecto pensado para comunicacion sin fricciones.</h2>
          <p>
            KINETICA integra vision por computadora, traduccion de texto y un avatar 3D para
            facilitar la comunicacion entre lengua de senas y lenguaje escrito.
          </p>
        </div>

        <div className="landing-card-grid landing-card-grid--three">
          {cards.map(({ icon: Icon, title, text }) => (
            <article className="landing-info-card reveal" key={title}>
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

export default About
