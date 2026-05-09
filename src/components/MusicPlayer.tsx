import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react'
import { tracks } from '../data/tracks'
import { useAudioPlayer } from '../hooks/useAudioPlayer'

export default function MusicPlayer() {
  const {
    audioRef,
    current,
    state,
    togglePlay,
    skipNext,
    skipPrev,
    seek,
    setVolume,
    toggleMute,
    toggleVolumeUI,
  } = useAudioPlayer(tracks)

  if (!current) return null

  return (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} onEnded={skipNext} loop={tracks.length === 1} />

      <Music size={13} className="text-kanade-blush/70 flex-shrink-0" />

      <span className="hidden lg:block text-kanade-sand/70 text-xs truncate max-w-[100px]">
        {current.title}
      </span>
      <span className="hidden lg:block text-kanade-sand/30 text-xs whitespace-nowrap flex-shrink-0">
        by {current.artist}
      </span>

      <button
        onClick={skipPrev}
        className="text-kanade-sand/70 hover:text-kanade-blush transition-colors"
        aria-label="Previous track"
      >
        <SkipBack size={13} />
      </button>

      <button
        onClick={togglePlay}
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                   transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #d4788a, #c3aed6)' }}
        aria-label={state.playing ? 'Pause' : 'Play'}
      >
        {state.playing
          ? <Pause size={10} className="text-white" />
          : <Play  size={10} className="text-white ml-px" />}
      </button>

      <button
        onClick={skipNext}
        className="text-kanade-sand/70 hover:text-kanade-blush transition-colors"
        aria-label="Next track"
      >
        <SkipForward size={13} />
      </button>

      {state.error && (
        <span className="text-kanade-rose/70 text-xs hidden sm:block" role="alert">
          {state.error}
        </span>
      )}

      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={state.progress}
        onChange={e => seek(Number(e.target.value) / 100)}
        className="hidden md:block w-20 lg:w-28 accent-kanade-blush cursor-pointer"
        aria-label="Seek"
      />

      <div className="relative">
        <button
          onClick={toggleVolumeUI}
          className="text-kanade-sand/70 hover:text-kanade-blush transition-colors"
          aria-label={state.muted ? 'Unmute' : 'Mute'}
        >
          {state.muted || state.volume === 0
            ? <VolumeX size={13} />
            : <Volume2 size={13} />}
        </button>

        {state.showVolumeUI && (
          <div className="absolute top-full right-0 mt-2 glass-strong rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl z-50">
            <button
              onClick={toggleMute}
              className="text-kanade-sand/75 hover:text-kanade-blush transition-colors"
            >
              {state.muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.muted ? 0 : state.volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-16 accent-kanade-blush"
              aria-label="Volume"
            />
          </div>
        )}
      </div>
    </div>
  )
}
