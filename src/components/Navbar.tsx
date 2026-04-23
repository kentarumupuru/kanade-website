import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import MusicPlayer from './MusicPlayer'
import { useLang } from '../context/LanguageContext'
import { useNavItems } from '../hooks/useNavItems'

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const { lang, toggle, t } = useLang()
  const navItems = useNavItems()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center">
        {/* Left — logo + wordmark */}
        <Link
          to="/"
          className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={`${import.meta.env.BASE_URL}logos/logo.png`}
            alt="KANADE logo"
            width={36}
            height={36}
            decoding="async"
            fetchPriority="high"
            className="w-9 h-9 rounded-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <img
            src={`${import.meta.env.BASE_URL}logos/titlelogo.png`}
            alt="KANADE"
            width={180}
            height={40}
            decoding="async"
            fetchPriority="high"
            className="h-10 w-auto"
          />
        </Link>

        {/* Center — desktop nav links */}
        <ul className="hidden md:flex items-center justify-center gap-6 flex-1">
          {navItems.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right — language toggle + music player */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <button
            onClick={toggle}
            className="glass rounded-full px-3 py-1.5 border border-white/10 text-xs tracking-widest
                       text-kanade-sand/75 hover:text-kanade-blush hover:border-kanade-blush/30
                       transition-all duration-200 font-sans select-none"
            aria-label="言語切り替え / Toggle language"
          >
            {lang === 'ja' ? 'EN' : 'JP'}
          </button>
          <div className="glass rounded-full px-3 py-1.5 border border-white/5">
            <MusicPlayer />
          </div>
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden ml-auto">
          <button
            className="text-kanade-sand/80 hover:text-kanade-blush transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={t('メニューを開く', 'Toggle menu')}
          aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden glass-strong transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 py-4' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col items-center gap-5 pb-4">
          {navItems.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link text-base ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Language toggle + music player in mobile menu */}
        <div className="flex justify-center items-center gap-4 pb-2">
          <button
            onClick={toggle}
            className="glass rounded-full px-4 py-2 border border-white/10 text-xs tracking-widest
                       text-kanade-sand/75 hover:text-kanade-blush transition-all duration-200 font-sans"
          >
            {lang === 'ja' ? 'EN' : 'JP'}
          </button>
          <div className="glass rounded-full px-4 py-2 border border-white/5">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </header>
  )
}
