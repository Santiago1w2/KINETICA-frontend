import About from '../../components/landing/About'
import Contact from '../../components/landing/Contact'
import Features from '../../components/landing/Features'
import Footer from '../../components/landing/Footer'
import Hero from '../../components/landing/Hero'
import ModelSection from '../../components/landing/ModelSection'
import Stats from '../../components/landing/Stats'
import './HomePage.css'

function HomePage() {
  return (
    <div className="landing-page">
      <Hero />
      <About />
      <ModelSection />
      <Stats />
      <Features />
      <Contact />
      <Footer />
    </div>
  )
}

export default HomePage
