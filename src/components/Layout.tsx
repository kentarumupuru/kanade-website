import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ParticleBackground from './ParticleBackground'
import AnimatedBackground from './AnimatedBackground'

export default function Layout() {
  return (
    <div className="relative min-h-screen">
      {/* Animated gradient/image slideshow with parallax */}
      <AnimatedBackground />

      {/* Particle layer sits above the background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200]
                     focus:px-4 focus:py-2 focus:rounded-full focus:bg-kanade-charcoal
                     focus:border focus:border-kanade-lavender/40 focus:text-kanade-cream focus:text-sm"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
