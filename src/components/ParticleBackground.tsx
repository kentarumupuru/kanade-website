import { useMemo, useState, useEffect } from 'react'

const PARTICLE_COUNT     = 28
const SEED_MULTIPLIER    = 17
const LEFT_MARGIN_PCT    = 2    // minimum left % to keep particles off edge
const LEFT_RANGE_PCT     = 96   // range in % for left position
const MAX_SIZE_REM       = 1.4  // rem added to min size
const MIN_SIZE_REM       = 0.8  // rem base size
const MAX_OPACITY        = 0.25
const MIN_OPACITY        = 0.08
const MAX_FLOAT_DURATION = 14   // seconds of float animation range
const MIN_FLOAT_DURATION = 10   // seconds minimum float
const MAX_DELAY_S        = 18   // seconds of negative delay range (starts mid-animation)
const MAX_DRIFT_PX       = 60   // horizontal sway pixels either side (total range = 2×)
const MAX_ROTATE_DEG     = 20   // rotation degrees either side (total range = 2×)

const NOTES = ['♩', '♪', '♫', '♬', '𝅗𝅥', '♭', '♮', '𝄞']

const COLORS = [
  'rgba(242,196,206,',   // blush
  'rgba(195,174,214,',   // lavender
  'rgba(212,175,122,',   // gold
  'rgba(220,232,240,',   // mist
  'rgba(232,213,245,',   // lilac
]

interface NoteConfig {
  id: number
  note: string
  left: string
  size: string
  color: string
  opacity: number
  duration: string
  delay: string
  drift: string      // horizontal wobble amount
  rotate: string     // end rotation
  startY: string     // initial vertical offset so screen starts populated
}

// Deterministic LCG-style PRNG so the particle layout is identical on every render
// and across SSR/hydration (Math.random() would produce a mismatch).
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export default function ParticleBackground() {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const notes: NoteConfig[] = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const r = (offset = 0) => seededRandom(i * SEED_MULTIPLIER + offset)
      return {
        id:       i,
        note:     NOTES[Math.floor(r(0) * NOTES.length)],
        left:     `${r(1) * LEFT_RANGE_PCT + LEFT_MARGIN_PCT}%`,
        size:     `${r(2) * MAX_SIZE_REM + MIN_SIZE_REM}rem`,
        color:    COLORS[Math.floor(r(3) * COLORS.length)],
        opacity:  r(4) * MAX_OPACITY + MIN_OPACITY,
        duration: `${r(5) * MAX_FLOAT_DURATION + MIN_FLOAT_DURATION}s`,
        delay:    `-${r(6) * MAX_DELAY_S}s`,
        drift:    `${(r(7) - 0.5) * MAX_DRIFT_PX * 2}px`,
        rotate:   `${(r(8) - 0.5) * MAX_ROTATE_DEG * 2}deg`,
        startY:   '105vh',
      }
    })
  }, [])

  if (reducedMotion) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {notes.map(n => (
        <span
          key={n.id}
          className="absolute bottom-0 select-none leading-none"
          style={{
            left:       n.left,
            fontSize:   n.size,
            color:      `${n.color}${n.opacity})`,
            animation:  `noteFloat ${n.duration} linear ${n.delay} infinite`,
            '--drift':  n.drift,
            '--rotate': n.rotate,
          } as React.CSSProperties}
        >
          {n.note}
        </span>
      ))}
    </div>
  )
}
