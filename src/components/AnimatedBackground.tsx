import { useEffect, useRef, useState } from 'react'

/**
 * Slides to cycle through.
 *
 * To use real images: add src paths like '/bg1.jpg', '/bg2.jpg', etc.
 * Until then, each slide shows a rich gradient as a placeholder.
 * The gradient is always visible behind the image, so if the image
 * fails to load the background still looks great.
 */
const SLIDES = [
  {
    src: '/bg1.jpg',
    gradient: 'radial-gradient(ellipse at 30% 60%, #4a2060 0%, #1a1225 55%), radial-gradient(ellipse at 80% 20%, #2d1845 0%, transparent 60%)',
    accent:   'radial-gradient(ellipse at 60% 80%, rgba(212,120,138,0.35) 0%, transparent 55%)',
  },
  {
    src: '/bg2.jpg',
    gradient: 'radial-gradient(ellipse at 70% 40%, #1e2d50 0%, #1a1225 55%), radial-gradient(ellipse at 20% 70%, #2d1f3d 0%, transparent 60%)',
    accent:   'radial-gradient(ellipse at 30% 30%, rgba(195,174,214,0.30) 0%, transparent 55%)',
  },
  {
    src: '/bg3.jpg',
    gradient: 'radial-gradient(ellipse at 50% 30%, #2d1f3d 0%, #1a1225 55%), radial-gradient(ellipse at 80% 80%, #1e1535 0%, transparent 60%)',
    accent:   'radial-gradient(ellipse at 70% 60%, rgba(212,175,122,0.25) 0%, transparent 55%)',
  },
]

const SLIDE_DURATION  = 7000  // ms each slide is visible
const FADE_DURATION   = 2000  // ms crossfade

export default function AnimatedBackground() {
  const [current,  setCurrent]  = useState(0)
  const [next,     setNext]     = useState<number | null>(null)
  const [fading,   setFading]   = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Crossfade cycle
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const nextIdx = (current + 1) % SLIDES.length
      setNext(nextIdx)
      setFading(true)

      setTimeout(() => {
        setCurrent(nextIdx)
        setNext(null)
        setFading(false)
      }, FADE_DURATION)
    }, SLIDE_DURATION)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current])

  // Scroll parallax — clamp so the background never scrolls past its extended area
  // Disabled on mobile: container is 100% height so there's no room to shift
  useEffect(() => {
    if (isMobile) {
      if (parallaxRef.current) parallaxRef.current.style.transform = ''
      return
    }
    const onScroll = () => {
      if (parallaxRef.current) {
        const maxShift = parallaxRef.current.offsetHeight - window.innerHeight
        const raw = window.scrollY * 0.2
        const y = Math.min(raw, maxShift)
        parallaxRef.current.style.transform = `translateY(-${y}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-kanade-charcoal">
      {/* Parallax container — moves up as you scroll */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 will-change-transform"
        style={{
          top: isMobile ? '0%' : '-20%',
          height: isMobile ? '100%' : '140%',
        }}
      >
        {/* Current slide */}
        <Slide slide={SLIDES[current]} visible kenBurns />

        {/* Next slide fades in on top during transition */}
        {fading && next !== null && (
          <Slide slide={SLIDES[next]} visible={false} fadingIn kenBurns={false} />
        )}
      </div>

      {/* Overlay — lighter so the background shows through more vividly */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(26,18,37,0.45) 0%, rgba(26,18,37,0.30) 50%, rgba(26,18,37,0.55) 100%)',
        }}
      />

      {/* Radial vignette for depth */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(26,18,37,0.6) 100%)',
        }}
      />

      {/* Soft top/bottom gradient blends into page content */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(26,18,37,0.7), transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(26,18,37,0.85), transparent)' }}
      />
    </div>
  )
}

function Slide({
  slide,
  visible,
  fadingIn,
  kenBurns,
}: {
  slide: typeof SLIDES[number]
  visible: boolean
  fadingIn?: boolean
  kenBurns: boolean
}) {
  return (
    <div
      className="absolute inset-0 transition-opacity"
      style={{
        opacity:           fadingIn ? undefined : visible ? 1 : 0,
        transitionDuration: fadingIn ? `${FADE_DURATION}ms` : '0ms',
        animation:          fadingIn ? `bgFadeIn ${FADE_DURATION}ms ease forwards` : undefined,
      }}
    >
      {/* Gradient base — always visible, doubles as placeholder */}
      <div
        className="absolute inset-0"
        style={{ background: slide.gradient }}
      />

      {/* Accent colour layer */}
      <div
        className="absolute inset-0"
        style={{ background: slide.accent }}
      />

      {/* Real image — Ken Burns zoom when active, hidden on load error */}
      <img
        src={slide.src}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          animation: kenBurns ? 'kenBurns 12s ease-in-out infinite alternate' : undefined,
          mixBlendMode: 'luminosity',
          opacity: 0.55,
        }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
    </div>
  )
}
