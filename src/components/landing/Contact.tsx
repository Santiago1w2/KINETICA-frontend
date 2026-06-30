import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'

function Contact() {
  return (
    <section id="contacto" className="landing-section">
      <div className="landing-container landing-contact">
        <div className="landing-contact__copy reveal">
          <p className="landing-eyebrow">Contacto</p>
          <h2>Conversemos sobre accesibilidad, tecnologia e inclusion.</h2>
          <p>
            Usa el formulario o los canales directos para conocer mas sobre KINETICA,
            colaborar o proponer mejoras para la plataforma.
          </p>
          <div className="landing-contact__links">
            <a href="mailto:contacto@kinetica.app">
              <FiMail aria-hidden="true" />
              contacto@kinetica.app
            </a>
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              <FiGithub aria-hidden="true" />
              GitHub
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              <FiLinkedin aria-hidden="true" />
              LinkedIn
            </a>
          </div>
        </div>

        <form className="landing-contact__form reveal">
          <label>
            Nombre
            <input type="text" name="name" placeholder="Tu nombre" />
          </label>
          <label>
            Correo
            <input type="email" name="email" placeholder="tu@correo.com" />
          </label>
          <label>
            Mensaje
            <textarea name="message" rows={5} placeholder="Escribe tu mensaje" />
          </label>
          <button type="submit" className="landing-button landing-button--primary">
            Enviar
            <FiSend aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
