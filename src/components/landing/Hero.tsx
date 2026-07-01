import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlayCircle } from 'react-icons/fi'
import HeroModel from './HeroModel'

function Hero() {
  return (
    <section id="inicio" className="landing-hero landing-section">
      <div className="landing-hero__background" aria-hidden="true" />
      <div className="landing-hero__model" aria-hidden="true">
        <HeroModel />
      </div>
      <div className="landing-container landing-hero__content reveal">
        <p className="landing-eyebrow">Traduccion inclusiva asistida por IA</p>
        <h1>KINETICA</h1>
        <p className="landing-hero__lead">
          Conecta lengua de senas y texto mediante traduccion inteligente, accesible y visual.
        </p>
        <div className="landing-hero__actions">
          <Link to="/auth/login" className="landing-button landing-button--primary">
            Comenzar
            <FiArrowRight aria-hidden="true" />
          </Link>
          <a href="#nosotros" className="landing-button landing-button--secondary">
            <FiPlayCircle aria-hidden="true" />
            Conocer mas
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
