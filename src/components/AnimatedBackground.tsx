import { useEffect, useRef, useState } from 'react'

const SLIDES = [
  {
    src: `${import.meta.env.BASE_URL}backgrounds/bg1.webp`,
    gradient: 'radial-gradient(ellipse at 30% 60%, #4a2060 0%, #1a1225 55%), radial-gradient(ellipse at 80% 20%, #2d1845 0%, transparent 60%)',
    accent:   'radial-gradient(ellipse at 60% 80%, rgba(212,120,138,0.35) 0%, transparent 55%)',
  },
  {
    src: `${import.meta.env.BASE_URL}backgrounds/bg2.webp`,
    gradient: 'radial-gradient(ellipse at 70% 40%, #1e2d50 0%, #1a1225 55%), radial-gradient(ellipse at 20% 70%, #2d1f3d 0%, transparent 60%)',
    accent:   'radial-gradient(ellipse at 30% 30%, rgba(195,174,214,0.30) 0%, transparent 55%)',
  },
  {
    src: `${import.meta.env.BASE_URL}backgrounds/bg3.webp`,
    gradient: 'radial-gradient(ellipse at 50% 30%, #2d1f3d 0%, #1a1225 55%), radial-gradient(ellipse at 80% 80%, #1e1535 0%, transparent 60%)',
    accent:   'radial-gradient(ellipse at 70% 60%, rgba(212,175,122,0.25) 0%, transparent 55%)',
  },
  {
    src: `${import.meta.env.BASE_URL}backgrounds/bg4.webp`,
    gradient: 'radial-gradient(ellipse at 40% 50%, #1f3044 0%, #1a1225 55%), radial-gradient(ellipse at 85% 25%, #23304a 0%, transparent 60%)',
    accent:   'radial-gradient(ellipse at 25% 75%, rgba(160,196,214,0.28) 0%, transparent 55%)',
  },
]

const SLIDE_DURATION = 7000  // ms each slide is visible
const FADE_DURATION  = 2000  // ms crossfade

// Each slide has a different Ken Burns start offset so they look varied
const KB_OFFSETS = ['-4s', '-8s', '-11s', '-14s']

export default function AnimatedBackground() {
  const [current,  setCurrent]  = useState(0)
  const [fading,   setFading]   = useState(false)
  const [next,     setNext]     = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const parallaxRef    = useRef<HTMLDivElement>(null)
  const cycleTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Crossfade cycle. `live` guard prevents state updates if the component unmounts while
  // a timer is in flight — clearTimeout alone isn't enough because the callback may have
  // already started executing when cleanup runs.
  useEffect(() => {
    let live = true

    cycleTimerRef.current = setTimeout(() => {
      if (!live) return
      const nextIdx = (current + 1) % SLIDES.length
      setNext(nextIdx)
      setFading(true)

      fadeTimerRef.current = setTimeout(() => {
        if (!live) return
        setCurrent(nextIdx)
        requestAnimationFrame(() => {
          if (!live) return
          setNext(null)
          setFading(false)
        })
      }, FADE_DURATION)
    }, SLIDE_DURATION)

    return () => {
      live = false
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current)
      if (fadeTimerRef.current)  clearTimeout(fadeTimerRef.current)
    }
  }, [current])

  // Scroll parallax
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
      <div
        ref={parallaxRef}
        className="absolute inset-0 will-change-transform"
        style={{
          top:    isMobile ? '0%'  : '-20%',
          height: isMobile ? '100%' : '140%',
        }}
      >
        {SLIDES.map((slide, i) => {
          const isCurrentSettled = i === current && !fading
          const isCurrentFading  = i === current && fading
          const isFadingIn       = i === next && fading

          const opacity = (isCurrentSettled || isCurrentFading || isFadingIn) ? 1 : 0
          const transitionDuration = isFadingIn ? `${FADE_DURATION}ms` : '0ms'

          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                opacity,
                transition: `opacity ${transitionDuration} ease`,
              }}
            >
              <div className="absolute inset-0" style={{ background: slide.gradient }} />
              <div className="absolute inset-0" style={{ background: slide.accent }} />
              <img
                src={slide.src}
                alt=""
                aria-hidden="true"
                width={1920}
                height={1080}
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  animation: `kenBurns 12s ease-in-out infinite alternate`,
                  animationDelay: KB_OFFSETS[i],
                  mixBlendMode: 'luminosity',
                  opacity: 0.55,
                }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )
        })}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(26,18,37,0.45) 0%, rgba(26,18,37,0.30) 50%, rgba(26,18,37,0.55) 100%)',
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(26,18,37,0.6) 100%)',
        }}
      />

      {/* Top/bottom fades */}
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
