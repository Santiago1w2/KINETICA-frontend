import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

const navItems = [
  { label: 'Inicio', href: '/home#inicio' },
  { label: 'Nosotros', href: '/home#nosotros' },
  { label: 'Modelo 3D', href: '/home#modelo' },
  { label: 'Estadisticas', href: '/home#estadisticas' },
  { label: 'Informacion', href: '/home#informacion' },
  { label: 'Contacto', href: '/home#contacto' },
]

function Navbar() {
  const { accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!location.hash) return

    const id = window.setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 0)

    return () => window.clearTimeout(id)
  }, [location])

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logout()
      navigate('/auth/login')
    } finally {
      setLoggingOut(false)
    }
  }

  const handleAnchorClick = (href: string) => {
    setIsOpen(false)
    const hash = href.split('#')[1]
    if (location.pathname === '/home' && hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`animate-navbar fixed left-1/2 top-4 z-50 w-[min(1120px,calc(100%-24px))] -translate-x-1/2 rounded-[28px] border px-5 py-3 transition-all duration-300 md:px-6 ${
        isScrolled
          ? 'border-[#3C8AF2]/30 bg-[#004AAD]/95 shadow-[0_18px_45px_rgba(0,74,173,0.18)] backdrop-blur-xl'
          : 'border-[#3C8AF2]/25 bg-[#004AAD]/90 shadow-[0_18px_55px_rgba(0,74,173,0.16)] backdrop-blur-xl'
      }`}
    >
      {loggingOut && <LoadingSpinner message="Cerrando sesion..." />}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/home#inicio"
          onClick={() => handleAnchorClick('/home#inicio')}
          className="bloksy text-3xl text-white"
        >
          KINETICA
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-bold text-white/85 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                onClick={() => handleAnchorClick(item.href)}
                className="transition-colors hover:text-[#3C8AF2]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {accessToken ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-bold text-white/85 transition-colors hover:text-[#3C8AF2]"
              >
                Traductor
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#004AAD] transition-colors hover:bg-[#3C8AF2] hover:text-white"
              >
                Cerrar sesion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="rounded-full px-4 py-2 text-sm font-bold text-white/85 transition-colors hover:text-[#3C8AF2]"
              >
                Iniciar sesion
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#004AAD] transition-colors hover:bg-[#3C8AF2] hover:text-white"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#3C8AF2]/30 bg-white text-[#004AAD] lg:hidden"
        >
          {isOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 grid gap-2 border-t border-[#3C8AF2]/30 pt-4 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => handleAnchorClick(item.href)}
              className="rounded-2xl px-3 py-2 text-sm font-bold text-white/85 hover:bg-[#3C8AF2] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          {accessToken ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-bold text-white/85 hover:bg-[#3C8AF2] hover:text-white"
              >
                Traductor
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-2xl bg-white px-3 py-2 text-left text-sm font-bold text-[#004AAD] hover:bg-[#3C8AF2] hover:text-white"
              >
                Cerrar sesion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-bold text-white/85 hover:bg-[#3C8AF2] hover:text-white"
              >
                Iniciar sesion
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl bg-white px-3 py-2 text-sm font-bold text-[#004AAD] hover:bg-[#3C8AF2] hover:text-white"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
