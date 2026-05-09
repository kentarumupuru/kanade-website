# Vibe Code Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all issues identified in the vibe code audit: accessibility gaps, silent failures, fragile DOM coupling, hardcoded URLs, and React anti-patterns.

**Architecture:** Targeted, file-by-file fixes with no structural rewrites. Each task is self-contained and leaves the app fully working after it completes. No new dependencies required.

**Tech Stack:** React 18, Vite 5, TypeScript (strict), Tailwind CSS, react-router-dom v6

---

## File Map

| File | Change |
|------|--------|
| `src/components/Lightbox.tsx` | Add focus trap, ARIA dialog role, restore focus on close, fix img alt/role, fix dot key |
| `src/components/MusicPlayer.tsx` | Replace seek div with `<input type="range">`, add `onError` to audio element |
| `src/components/ErrorBoundary.tsx` | Guard `console.error` behind `import.meta.env.DEV` |
| `src/hooks/useAudioPlayer.ts` | Add `error` field to State, set it on PLAYBACK_FAILED, clear on play |
| `src/data/config.ts` | Replace hardcoded `SITE_URL` with env var + fallback |
| `src/utils/eventJsonLd.ts` | Replace hardcoded organizer URL with imported `SITE_URL` |
| `src/pages/Gallery.tsx` | Fix GalleryTile img error handler (state not DOM), fix Space key, close lightbox on category change, fix lightbox bounds check |
| `src/pages/Members.tsx` | Use `revealDelayClass()` instead of inline calculation, hoist `useInView` options |
| `src/pages/Home.tsx` | Hoist `useInView` option objects to module-level constants |
| `src/pages/Events.tsx` | Hoist `useInView` option objects to module-level constants |
| `src/components/ParticleBackground.tsx` | Extract magic numbers to named constants |

---

### Task 1: Fix `SITE_URL` to use env var and fix JSON-LD organizer URL

**Files:**
- Modify: `src/data/config.ts`
- Modify: `src/utils/eventJsonLd.ts`

- [ ] **Step 1: Update `config.ts` to use env var with fallback**

Replace the hardcoded `SITE_URL` line in `src/data/config.ts`:

```ts
export const TWITTER_URL   = 'https://x.com/FF14_Kanade2020'
export const CONTACT_EMAIL = 'kanade.ff14@gmail.com'
export const SITE_URL      = import.meta.env.VITE_SITE_URL ?? 'https://wolfie0420.github.io/kanade-website'
export const BASE_URL      = import.meta.env.BASE_URL
```

- [ ] **Step 2: Fix hardcoded organizer URL in `eventJsonLd.ts`**

The file at `src/utils/eventJsonLd.ts` already imports `SITE_URL` but has a hardcoded URL in the organizer field. Replace line 12:

```ts
import type { Event } from '../data/events'
import { SITE_URL } from '../data/config'

export function buildEventJsonLd(event: Event): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: `${event.date}T${event.time.replace(' JST', '+09:00')}`,
    location: { '@type': 'Place', name: `${event.venue}, ${event.world}` },
    description: event.description,
    organizer: { '@type': 'Organization', name: 'KANADE', url: SITE_URL },
    ...(event.bannerImage && { image: `${SITE_URL}/${event.bannerImage}` }),
  }
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build completes with no TypeScript errors.

---

### Task 2: Guard `console.error` in ErrorBoundary

**Files:**
- Modify: `src/components/ErrorBoundary.tsx`

- [ ] **Step 1: Wrap console.error in DEV guard**

Full file after change:

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught error:', error, info.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-kanade-charcoal flex items-center justify-center text-center px-6">
          <div>
            <p className="text-kanade-cream font-serif text-2xl mb-3">Something went wrong.</p>
            <p className="text-kanade-sand/70 text-sm mb-6">Please refresh the page to continue.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full border border-kanade-rose/40 text-kanade-rose text-sm hover:bg-kanade-rose/10 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: No errors.

---

### Task 3: Add `error` state to `useAudioPlayer` and surface it in `MusicPlayer`

**Files:**
- Modify: `src/hooks/useAudioPlayer.ts`
- Modify: `src/components/MusicPlayer.tsx`

- [ ] **Step 1: Add `error` field to State and handle it in reducer**

Full updated `src/hooks/useAudioPlayer.ts`:

```ts
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
  error: string | null
}

type Action =
  | { type: 'TOGGLE_PLAY' }
  | { type: 'PLAYBACK_FAILED' }
  | { type: 'CLEAR_ERROR' }
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
      return { ...state, playing: !state.playing, error: null }
    case 'PLAYBACK_FAILED':
      return { ...state, playing: false, error: 'Playback failed. Check your browser settings.' }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'SKIP_NEXT':
      return { ...state, index: (state.index + 1) % action.total, progress: 0, error: null }
    case 'SKIP_PREV':
      return { ...state, index: (state.index - 1 + action.total) % action.total, progress: 0, error: null }
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
  error: null,
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

  const togglePlay  = useCallback(() => dispatch({ type: 'TOGGLE_PLAY' }), [])
  const skipNext    = useCallback(() => dispatch({ type: 'SKIP_NEXT', total: tracks.length }), [tracks.length])
  const skipPrev    = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      dispatch({ type: 'RESET_PROGRESS' })
      return
    }
    dispatch({ type: 'SKIP_PREV', total: tracks.length })
  }, [tracks.length])
  const seek        = useCallback((ratio: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = ratio * audio.duration
    dispatch({ type: 'SET_PROGRESS', value: ratio * 100 })
  }, [])
  const setVolume   = useCallback((value: number) => dispatch({ type: 'SET_VOLUME', value }), [])
  const toggleMute  = useCallback(() => dispatch({ type: 'TOGGLE_MUTE' }), [])
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
```

- [ ] **Step 2: Replace seek div with `<input type="range">` and add audio error handler and error display in MusicPlayer**

Full updated `src/components/MusicPlayer.tsx`:

```tsx
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
      <audio
        ref={audioRef}
        onEnded={skipNext}
        loop={tracks.length === 1}
        onError={() => {/* error surfaces via PLAYBACK_FAILED dispatch in useAudioPlayer */}}
      />

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
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: No TypeScript errors.

---

### Task 4: Fix `Lightbox` — focus trap, ARIA dialog, img alt/role, dot key fix

**Files:**
- Modify: `src/components/Lightbox.tsx`

- [ ] **Step 1: Rewrite Lightbox with focus trap, ARIA semantics, corrected img alt and dot key**

Full updated `src/components/Lightbox.tsx`:

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

interface LightboxProps {
  images: string[]
  startIndex: number
  onClose: () => void
}

export default function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex]   = useState(startIndex)
  const { t }               = useLang()
  const closeRef            = useRef<HTMLButtonElement>(null)
  const previousFocusRef    = useRef<HTMLElement | null>(null)

  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

  // Save the previously focused element and move focus into the dialog on open.
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
    closeRef.current?.focus()
    return () => {
      previousFocusRef.current?.focus()
    }
  }, [])

  // Keyboard navigation.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('画像ビューアー', 'Image viewer')}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-4 right-4 glass rounded-full p-2 text-white/60 hover:text-white transition-colors"
        aria-label={t('閉じる', 'Close')}
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-4 md:left-10 glass rounded-full p-2 text-white/60 hover:text-white transition-colors"
          aria-label={t('前の画像', 'Previous image')}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <img
        src={images[index]}
        alt={t(`画像 ${index + 1} / ${images.length}`, `Image ${index + 1} of ${images.length}`)}
        decoding="async"
        className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
        onClick={e => e.stopPropagation()}
      />

      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-4 md:right-10 glass rounded-full p-2 text-white/60 hover:text-white transition-colors"
          aria-label={t('次の画像', 'Next image')}
        >
          <ChevronRight size={24} />
        </button>
      )}

      {images.length > 1 && (
        <div
          className="absolute bottom-4 flex gap-2"
          onClick={e => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === index ? 'bg-kanade-blush scale-125' : 'bg-kanade-sand/40 hover:bg-kanade-sand/70'
              }`}
              aria-label={`${t('画像', 'Image')} ${i + 1}`}
            />
          ))}
        </div>
      )}

      <p className="absolute bottom-4 right-4 text-white/30 text-xs" aria-hidden="true">
        {index + 1} / {images.length}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: No TypeScript errors.

---

### Task 5: Fix `Gallery.tsx` — React state error handler, Space key, lightbox bounds/category reset

**Files:**
- Modify: `src/pages/Gallery.tsx`

- [ ] **Step 1: Update `GalleryTile` to use React state for image error, fix Space key, close lightbox on category change, add bounds check**

Full updated `src/pages/Gallery.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { revealDelayClass } from '../utils/animations'
import { ImageIcon } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useInView } from '../hooks/useInView'
import Lightbox from '../components/Lightbox'
import { galleryImages, type GalleryImage } from '../data/gallery'

function PlaceholderTile({ image }: { image: GalleryImage }) {
  const gradients = [
    'from-kanade-blush/30 to-kanade-lavender/30',
    'from-kanade-lavender/30 to-kanade-mist/30',
    'from-kanade-gold/20 to-kanade-blush/20',
    'from-kanade-mist/30 to-kanade-lavender/20',
    'from-kanade-rose/20 to-kanade-gold/20',
    'from-kanade-lilac/20 to-kanade-blush/20',
  ]
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[image.id % gradients.length]}
                     flex items-center justify-center`}>
      <ImageIcon size={32} className="text-kanade-cream/20" />
    </div>
  )
}

const TILE_INVIEW_OPTS = { threshold: 0.08 }

function GalleryTile({
  image,
  index,
  caption,
  onClick,
}: {
  image: GalleryImage
  index: number
  caption: string | undefined
  onClick: () => void
}) {
  const { t } = useLang()
  const { ref, inView } = useInView(TILE_INVIEW_OPTS)
  const delayClass = revealDelayClass(index)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      ref={ref}
      className={`break-inside-avoid rounded-xl overflow-hidden cursor-pointer
                 group relative glass hover:ring-1 hover:ring-kanade-lavender/30
                 transition-all duration-300 hover:shadow-lg hover:shadow-kanade-lavender/10
                 reveal-scale ${delayClass}${inView ? ' is-visible' : ''}`}
      style={{ aspectRatio: index % 5 === 0 ? '1/1.3' : index % 3 === 0 ? '1/0.8' : '1/1' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={t(`${caption}を表示`, `View ${image.alt}`)}
    >
      {imgError
        ? <PlaceholderTile image={image} />
        : (
          <img
            src={image.thumbnail}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        )
      }

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-kanade-deep/60 opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 flex items-end p-3">
        {caption && (
          <p className="text-kanade-cream/80 text-xs leading-snug">{caption}</p>
        )}
      </div>
    </div>
  )
}

const HEADER_INVIEW_OPTS  = {}
const FILTERS_INVIEW_OPTS = {}

export default function Gallery() {
  useSEO({ title: 'Gallery — KANADE', description: 'Screenshots from our events', url: '/gallery' })
  const [activeCategory, setActiveCategory] = useState<GalleryImage['category'] | 'all'>('all')
  const [lightboxIndex,  setLightboxIndex]  = useState<number | null>(null)
  const { t, lang } = useLang()
  const { ref: headerRef,  inView: headerInView  } = useInView(HEADER_INVIEW_OPTS)
  const { ref: filtersRef, inView: filtersInView } = useInView(FILTERS_INVIEW_OPTS)

  const categoryLabels: Record<GalleryImage['category'] | 'all', string> = {
    all:                 t('すべて',       'All'),
    performance:         t('パフォーマンス', 'Performances'),
    venue:               t('会場',         'Venues'),
    group:               t('グループ',      'Group'),
    'behind-the-scenes': t('舞台裏',        'Behind the Scenes'),
  }

  const filtered = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory)

  // Close lightbox when the category filter changes to avoid out-of-bounds index.
  useEffect(() => {
    setLightboxIndex(null)
  }, [activeCategory])

  const closeLightbox = () => setLightboxIndex(null)

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-6 text-center">
        <div ref={headerRef} className={`reveal-up${headerInView ? ' is-visible' : ''}`}>
          <p className="text-kanade-lavender/80 tracking-[0.4em] text-xs uppercase mb-4 font-sans">
            {t('思い出', 'Memories')}
          </p>
          <h1 className="section-title">{t('ギャラリー', 'Gallery')}</h1>
          <div className="section-divider" />
          <p className="text-kanade-sand/70 max-w-xl mx-auto text-sm leading-relaxed">
            {t(
              'KANADEの歩みを彩るスクリーンショット、パフォーマンスの瞬間、舞台裏の一幕をお届けします。',
              'Screenshots, performance moments, and behind-the-scenes glimpses from KANADE\'s journey.'
            )}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Category filters */}
        <div
          ref={filtersRef}
          className={`flex flex-wrap justify-center gap-2 mb-10 reveal-fade${filtersInView ? ' is-visible' : ''}`}
        >
          {(Object.keys(categoryLabels) as (GalleryImage['category'] | 'all')[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-sans transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-gradient-to-r from-kanade-rose to-kanade-lavender text-white shadow-lg shadow-kanade-rose/20'
                  : 'glass text-kanade-sand/70 hover:text-kanade-sand/80'}`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((image, i) => {
            const caption = lang === 'ja' ? (image.captionJa ?? image.caption) : image.caption
            return (
              <GalleryTile
                key={image.id}
                image={image}
                index={i}
                caption={caption}
                onClick={() => setLightboxIndex(i)}
              />
            )
          })}
        </div>

        {/* Upload note */}
        <div className="card text-center mt-12 py-10">
          <ImageIcon size={36} className="mx-auto text-kanade-lavender/30 mb-4" />
          <p className="text-kanade-sand/40 text-sm mb-2">
            {t(
              'スクリーンショットやイベント写真はここに表示されます。',
              'Screenshots and event photos will appear here.'
            )}
          </p>
          <p className="text-kanade-sand/25 text-xs">
            {t('画像は ', 'Place images in ')}<code className="text-kanade-lavender/40">public/gallery/</code>
            {t(' に配置してください。', ' following the naming convention above.')}
          </p>
        </div>
      </div>

      {lightboxIndex !== null && lightboxIndex < filtered.length && (
        <Lightbox
          images={filtered.map(img => img.src)}
          startIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  )
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: No TypeScript errors.

---

### Task 6: Fix `Members.tsx` — use `revealDelayClass()`, hoist `useInView` options

**Files:**
- Modify: `src/pages/Members.tsx`

- [ ] **Step 1: Replace inline delayClass calculation with `revealDelayClass()` and hoist options**

In `src/pages/Members.tsx`, find the `MemberCard` function. Change line 44:

```tsx
// Before:
const delayClass = `reveal-delay-${Math.min((index % 4) + 1, 6)}`

// After:
const delayClass = revealDelayClass(index)
```

Also hoist the `useInView` options object. Add this constant above the `MemberCard` function definition:

```tsx
const MEMBER_CARD_INVIEW_OPTS = { threshold: 0.1 }
```

Then change the `useInView` call inside `MemberCard` from:
```tsx
const { ref, inView } = useInView({ threshold: 0.1 })
```
to:
```tsx
const { ref, inView } = useInView(MEMBER_CARD_INVIEW_OPTS)
```

Make sure `revealDelayClass` is imported. Add to the imports at the top if not already present:
```tsx
import { revealDelayClass } from '../utils/animations'
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: No TypeScript errors.

---

### Task 7: Hoist `useInView` option objects in `Home.tsx` and `Events.tsx`

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Events.tsx`

- [ ] **Step 1: Hoist inline `useInView` option objects in `Home.tsx`**

Read `src/pages/Home.tsx` and find every call like `useInView({ threshold: 0.1 })`. Add module-level constants before the component definitions. Look for the sub-components (HeroSection, UpcomingEvents, FeaturedMembers, etc.) that call `useInView` with options. For each unique threshold value, add:

```tsx
// At module level, before any component definitions:
const INVIEW_OPTS_01  = { threshold: 0.1 }
const INVIEW_OPTS_015 = { threshold: 0.15 }
```

Then replace each inline `{ threshold: 0.1 }` with `INVIEW_OPTS_01` and `{ threshold: 0.15 }` with `INVIEW_OPTS_015`. Calls with no argument (`useInView()`) need no change.

- [ ] **Step 2: Hoist inline `useInView` option objects in `Events.tsx`**

Same pattern — find any `useInView({ threshold: X })` calls in `src/pages/Events.tsx` and replace with module-level constants.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: No TypeScript errors.

---

### Task 8: Extract magic numbers in `ParticleBackground.tsx`

**Files:**
- Modify: `src/components/ParticleBackground.tsx`

- [ ] **Step 1: Replace magic numbers with named constants**

Add these constants at the top of the file (after the imports, before `NOTES`):

```tsx
const PARTICLE_COUNT      = 28
const SEED_MULTIPLIER     = 17
const LEFT_MARGIN_PCT     = 2      // minimum left % to keep particles off edge
const LEFT_RANGE_PCT      = 96     // range in % for left position
const MAX_SIZE_REM        = 1.4    // rem added to min size
const MIN_SIZE_REM        = 0.8    // rem base size
const MAX_OPACITY         = 0.25
const MIN_OPACITY         = 0.08
const MAX_FLOAT_DURATION  = 14     // seconds of float animation range
const MIN_FLOAT_DURATION  = 10     // seconds minimum float
const MAX_DELAY_S         = 18     // seconds of negative delay range
const MAX_DRIFT_PX        = 120    // horizontal sway pixels (half either side)
const MAX_ROTATE_DEG      = 40     // rotation degrees (half either side)
```

Then update the `useMemo` body to use these constants:

```tsx
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
```

- [ ] **Step 2: Verify build passes and visual output is unchanged**

Run: `npm run build`
Expected: No errors. The particle animation should look identical to before since we only renamed the constants — math is equivalent.

---

### Task 9: Final verification

- [ ] **Step 1: Run full build**

```
npm run build
```

Expected: `✓ built in X.XXs` — zero TypeScript errors, zero Vite warnings about unresolved imports.

- [ ] **Step 2: Start dev server and manually verify**

```
npm run dev
```

Check the following manually:
1. **Lightbox** — open any gallery tile, press Tab: focus should stay inside the lightbox. Press Escape: lightbox closes. Close button should be focused on open. After close, focus returns to the tile that opened it.
2. **Music player** — seek bar is now a native range input; Arrow keys move playback position.
3. **Gallery filter** — change category while lightbox is open → lightbox closes automatically.
4. **Gallery tiles** — break an image URL in devtools → placeholder gradient appears (not invisible gap).
5. **Gallery Space key** — Tab to a gallery tile, press Space → lightbox opens.
6. **ErrorBoundary** — `console.error` only fires in dev mode (check Network/Console in production build served via `npm run preview`).
