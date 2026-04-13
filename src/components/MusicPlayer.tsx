import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react'
import { tracks } from '../data/tracks'

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [progress,     setProgress]     = useState(0)
  const [volume,       setVolume]       = useState(0.7)
  const [muted,        setMuted]        = useState(false)
  const [showVolume,   setShowVolume]   = useState(false)
  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<number>(0)

  const current = tracks[currentIndex]

  const stopProgress = useCallback(() => clearInterval(intervalRef.current), [])

  const startProgress = useCallback(() => {
    stopProgress()
    intervalRef.current = window.setInterval(() => {
      const audio = audioRef.current
      if (!audio || !audio.duration) return
      setProgress((audio.currentTime / audio.duration) * 100)
    }, 250)
  }, [stopProgress])

  // Effect 1: load new src when track changes, reset progress
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = current.src ?? ''
    setProgress(0)
  }, [currentIndex, current.src])

  // Effect 2: sync play/pause state to the audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current.src) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
      startProgress()
    } else {
      audio.pause()
      stopProgress()
    }
    return stopProgress
  }, [isPlaying, current.src, startProgress, stopProgress])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !current.src) { setIsPlaying(v => !v); return }
    if (isPlaying) { audio.pause(); stopProgress() }
    else { audio.play().catch(() => {}); startProgress() }
    setIsPlaying(v => !v)
  }

  const skipTo = (dir: 'prev' | 'next') => {
    setCurrentIndex(i =>
      dir === 'next' ? (i + 1) % tracks.length : (i - 1 + tracks.length) % tracks.length,
    )
    setProgress(0)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect  = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * audio.duration
    setProgress(ratio * 100)
  }

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} onEnded={() => skipTo('next')} loop={tracks.length === 1} />

      {/* Music icon — always visible */}
      <Music size={13} className="text-kanade-blush/70 flex-shrink-0" />

      {/* Track title + artist — hidden on small screens */}
      <span className="hidden lg:block text-kanade-sand/50 text-xs truncate max-w-[100px]">
        {current.title}
      </span>
      <span className="hidden lg:block text-kanade-sand/30 text-xs whitespace-nowrap flex-shrink-0">
        by {current.artist}
      </span>

      {/* Prev */}
      <button
        onClick={() => skipTo('prev')}
        className="text-kanade-sand/50 hover:text-kanade-blush transition-colors"
        aria-label="Previous track"
      >
        <SkipBack size={13} />
      </button>

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                   transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #d4788a, #c3aed6)' }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying
          ? <Pause size={10} className="text-white" />
          : <Play  size={10} className="text-white ml-px" />}
      </button>

      {/* Next */}
      <button
        onClick={() => skipTo('next')}
        className="text-kanade-sand/50 hover:text-kanade-blush transition-colors"
        aria-label="Next track"
      >
        <SkipForward size={13} />
      </button>

      {/* Progress bar — hidden on small screens */}
      <div
        className="hidden md:block w-20 lg:w-28 h-0.5 bg-white/10 rounded-full cursor-pointer group"
        onClick={seek}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #d4788a, #c3aed6)',
          }}
        />
      </div>

      {/* Volume toggle */}
      <div className="relative">
        <button
          onClick={() => setShowVolume(v => !v)}
          className="text-kanade-sand/50 hover:text-kanade-blush transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted || volume === 0
            ? <VolumeX size={13} />
            : <Volume2 size={13} />}
        </button>

        {/* Volume popover */}
        {showVolume && (
          <div className="absolute top-full right-0 mt-2 glass-strong rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl z-50">
            <button
              onClick={() => setMuted(v => !v)}
              className="text-kanade-sand/60 hover:text-kanade-blush transition-colors"
            >
              {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
              className="w-16 accent-kanade-blush"
              aria-label="Volume"
            />
          </div>
        )}
      </div>
    </div>
  )
}
