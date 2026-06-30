import { useEffect, useRef, useState } from 'react'
import { FiActivity, FiBarChart2, FiGlobe, FiUsers } from 'react-icons/fi'

const stats = [
  { icon: FiUsers, value: 430, suffix: 'M+', label: 'personas con discapacidad auditiva' },
  { icon: FiGlobe, value: 2, suffix: '', label: 'modos de traduccion principales' },
  { icon: FiActivity, value: 3, suffix: 's', label: 'tiempo promedio estimado' },
  { icon: FiBarChart2, value: 92, suffix: '%', label: 'precision objetivo del sistema' },
]

function useAnimatedCount(target: number) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    let frame = 0
    const totalFrames = 60
    const animate = () => {
      frame += 1
      const progress = Math.min(frame / totalFrames, 1)
      setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [started, target])

  return { count, ref }
}

function StatCard({ value, suffix, label, icon: Icon }: (typeof stats)[number]) {
  const { count, ref } = useAnimatedCount(value)

  return (
    <article className="landing-stat-card reveal" ref={ref}>
      <Icon aria-hidden="true" />
      <strong>
        {count}
        {suffix}
      </strong>
      <span>{label}</span>
    </article>
  )
}

function Stats() {
  return (
    <section id="estadisticas" className="landing-section landing-section--dark">
      <div className="landing-container">
        <div className="landing-section__heading reveal">
          <p className="landing-eyebrow">Estadisticas</p>
          <h2>Indicadores para dimensionar el impacto.</h2>
        </div>
        <div className="landing-stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
