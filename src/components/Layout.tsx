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
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
