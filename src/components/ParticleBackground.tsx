import { useMemo, useState, useEffect } from 'react'

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
    return Array.from({ length: 28 }, (_, i) => {
      const r = (offset = 0) => seededRandom(i * 17 + offset)
      return {
        id:       i,
        note:     NOTES[Math.floor(r(0) * NOTES.length)],
        left:     `${r(1) * 96 + 2}%`,
        size:     `${r(2) * 1.4 + 0.8}rem`,
        color:    COLORS[Math.floor(r(3) * COLORS.length)],
        opacity:  r(4) * 0.25 + 0.08,
        duration: `${r(5) * 14 + 10}s`,
        delay:    `-${r(6) * 18}s`,          // negative = already mid-animation on load
        drift:    `${(r(7) - 0.5) * 120}px`, // left/right sway at top
        rotate:   `${(r(8) - 0.5) * 40}deg`,
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
