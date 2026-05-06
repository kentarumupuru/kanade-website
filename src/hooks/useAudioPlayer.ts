import { useReducer, useRef, useEffect, useCallback } from 'react'

export interface Track {
  title: string
  artist: string
  src?: string
}

interface State {
  index: number
  playing: boolean
  progress: number
  volume: number
  muted: boolean
  showVolumeUI: boolean
}

type Action =
  | { type: 'TOGGLE_PLAY' }
  | { type: 'PLAYBACK_FAILED' }
  | { type: 'SKIP_NEXT'; total: number }
  | { type: 'SKIP_PREV'; total: number }
  | { type: 'RESET_PROGRESS' }
  | { type: 'SET_PROGRESS'; value: number }
  | { type: 'SET_VOLUME'; value: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_VOLUME_UI' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_PLAY':
      return { ...state, playing: !state.playing }
    case 'PLAYBACK_FAILED':
      return { ...state, playing: false }
    case 'SKIP_NEXT':
      return { ...state, index: (state.index + 1) % action.total, progress: 0 }
    case 'SKIP_PREV':
      return { ...state, index: (state.index - 1 + action.total) % action.total, progress: 0 }
    case 'RESET_PROGRESS':
      return { ...state, progress: 0 }
    case 'SET_PROGRESS':
      return { ...state, progress: action.value }
    case 'SET_VOLUME':
      return { ...state, volume: action.value, muted: false }
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted }
    case 'TOGGLE_VOLUME_UI':
      return { ...state, showVolumeUI: !state.showVolumeUI }
    default:
      return state
  }
}

const INITIAL: State = {
  index: 0,
  playing: false,
  progress: 0,
  volume: 0.7,
  muted: false,
  showVolumeUI: false,
}

export function useAudioPlayer(tracks: Track[]) {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const current = tracks[state.index]

  // Index-change effect: swap src, restart-if-playing. Intentionally omits `state.playing`
  // from deps — we want to persist the current playing flag through an index change without
  // reacting to pause/play in this effect (that's handled separately below).
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    audio.src = current.src ?? ''
    dispatch({ type: 'RESET_PROGRESS' })
    if (state.playing && current.src) {
      audio.play().catch(() => dispatch({ type: 'PLAYBACK_FAILED' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index])

  // Play/pause sync — runs whenever playing flips or the track src changes.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current?.src) return
    if (state.playing) {
      audio.play().catch(() => dispatch({ type: 'PLAYBACK_FAILED' }))
    } else {
      audio.pause()
    }
  }, [state.playing, current?.src])

  // Unmount cleanup: stop playback and release the media resource.
  useEffect(() => {
    return () => {
      const audio = audioRef.current
      if (!audio) return
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Progress tracking.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTimeUpdate = () => {
      if (audio.duration) dispatch({ type: 'SET_PROGRESS', value: (audio.currentTime / audio.duration) * 100 })
    }
    audio.addEventListener('timeupdate', onTimeUpdate)
    return () => audio.removeEventListener('timeupdate', onTimeUpdate)
  }, [])

  // Volume sync.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = state.muted ? 0 : state.volume
  }, [state.volume, state.muted])

  const togglePlay = useCallback(() => dispatch({ type: 'TOGGLE_PLAY' }), [])
  const skipNext = useCallback(() => dispatch({ type: 'SKIP_NEXT', total: tracks.length }), [tracks.length])
  const skipPrev = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      dispatch({ type: 'RESET_PROGRESS' })
      return
    }
    dispatch({ type: 'SKIP_PREV', total: tracks.length })
  }, [tracks.length])
  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = ratio * audio.duration
    dispatch({ type: 'SET_PROGRESS', value: ratio * 100 })
  }, [])
  const setVolume = useCallback((value: number) => dispatch({ type: 'SET_VOLUME', value }), [])
  const toggleMute = useCallback(() => dispatch({ type: 'TOGGLE_MUTE' }), [])
  const toggleVolumeUI = useCallback(() => dispatch({ type: 'TOGGLE_VOLUME_UI' }), [])

  return {
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
  }
}
