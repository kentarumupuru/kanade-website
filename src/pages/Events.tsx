import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL
import { Calendar, Clock, MapPin, ExternalLink, Tag, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { events, type Event } from '../data/events'
import { useLang } from '../context/LanguageContext'
import { useInView } from '../hooks/useInView'

function PageHeader() {
  const { t } = useLang()
  const { ref, inView } = useInView()
  return (
    <section className="pt-32 pb-12 px-6 text-center">
      <div ref={ref} className={`reveal-up${inView ? ' is-visible' : ''}`}>
        <p className="text-kanade-lavender/60 tracking-[0.4em] text-xs uppercase mb-4 font-sans">
          {t('スケジュール', 'Schedule')}
        </p>
        <h1 className="section-title">{t('イベント', 'Events')}</h1>
        <div className="section-divider" />
        <p className="text-kanade-sand/50 max-w-xl mx-auto text-sm leading-relaxed">
          {t(
            'エオルゼア各地でのライブパフォーマンス、コンサート、特別公演にぜひご参加ください。特に記載がない限り、すべてのイベントはTonberryサーバーのゲーム内で開催されます。',
            'Join us for live performances, concerts, and special occasions across Eorzea. All events are held in-game on the Tonberry server unless otherwise noted.'
          )}
        </p>
      </div>
    </section>
  )
}

function PosterLightbox({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 glass rounded-full p-2 text-kanade-sand/70 hover:text-kanade-sand transition-colors"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {hasPrev && (
        <button
          onClick={e => { e.stopPropagation(); setIndex(i => i - 1) }}
          className="absolute left-4 glass rounded-full p-2 text-kanade-sand/70 hover:text-kanade-sand transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <img
        src={images[index]}
        alt={`Event image ${index + 1}`}
        className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
        onClick={e => e.stopPropagation()}
      />

      {hasNext && (
        <button
          onClick={e => { e.stopPropagation(); setIndex(i => i + 1) }}
          className="absolute right-4 glass rounded-full p-2 text-kanade-sand/70 hover:text-kanade-sand transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-2" onClick={e => e.stopPropagation()}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${i === index ? 'bg-kanade-blush scale-125' : 'bg-kanade-sand/40 hover:bg-kanade-sand/70'}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const { ref, inView } = useInView({ threshold: 0.1 })
  const [showPoster, setShowPoster] = useState(false)
  const date = new Date(event.date)
  const isPast = event.status === 'past'
  const delayClass = `reveal-delay-${Math.min(index % 4 + 1, 6)}`

  return (
    <>
      {showPoster && (event.posterImage || event.bannerImage) && (
        <PosterLightbox
          images={[event.bannerImage, event.posterImage].filter(Boolean).map(p => `${BASE}${p}`)}
          onClose={() => setShowPoster(false)}
        />
      )}
      <article
        ref={ref}
        className={`card group relative overflow-hidden ${isPast ? 'opacity-60' : ''} reveal-up ${delayClass}${inView ? ' is-visible' : ''}`}
      >
        {/* Banner image */}
        {event.bannerImage && (
          <div className="relative -mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl h-44">
            <img
              src={`${BASE}${event.bannerImage}`}
              alt={event.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-kanade-charcoal/90" />
            {event.posterImage && (
              <button
                onClick={() => setShowPoster(true)}
                className="absolute bottom-3 right-3 glass rounded-full px-3 py-1.5 text-xs text-kanade-sand/80 hover:text-kanade-sand transition-colors tracking-wide"
              >
                {t('ポスターを見る', 'View Poster')}
              </button>
            )}
          </div>
        )}

        {/* Status ribbon */}
        {!isPast && (
          <div className={`flex items-center gap-1.5 ${event.bannerImage ? 'mb-3' : 'absolute top-4 right-4'}`}>
            {!event.bannerImage && (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-kanade-blush animate-pulse" />
                <span className="text-kanade-blush text-xs tracking-widest uppercase">
                  {t('開催予定', 'Upcoming')}
                </span>
              </>
            )}
          </div>
        )}
        {isPast && !event.bannerImage && (
          <div className="absolute top-4 right-4">
            <span className="text-kanade-sand/40 text-xs tracking-widest uppercase">
              {t('終了', 'Past')}
            </span>
          </div>
        )}

        <div className="flex gap-5">
          {/* Date block */}
          <div className="flex-shrink-0 text-center">
            <div className="glass rounded-xl px-4 py-3 min-w-[72px]">
              <p className={`font-serif text-3xl font-light leading-none ${isPast ? 'text-kanade-sand/40' : 'text-kanade-blush'}`}>
                {date.getDate()}
              </p>
              <p className="text-kanade-sand/50 text-xs uppercase tracking-wider mt-1">
                {date.toLocaleString(lang === 'ja' ? 'ja' : 'en', { month: 'short' })}
              </p>
              <p className="text-kanade-sand/30 text-xs mt-0.5">
                {date.getFullYear()}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h2 className={`font-serif text-xl font-light mb-2 transition-colors duration-200
                           ${isPast ? '' : 'group-hover:text-kanade-blush'}`}>
              {event.title}
            </h2>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              <span className="flex items-center gap-1.5 text-xs text-kanade-sand/50">
                <Clock size={12} className="text-kanade-lavender/60" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-kanade-sand/50">
                <MapPin size={12} className="text-kanade-lavender/60" />
                {event.venue}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-kanade-sand/50">
                <Calendar size={12} className="text-kanade-lavender/60" />
                {event.world}
              </span>
            </div>

            <p className="text-kanade-sand/60 text-sm leading-relaxed mb-4">{event.description}</p>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                {event.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full
                               border border-kanade-lavender/20 text-kanade-lavender/60"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => navigate(`/events/${event.slug}`)}
                className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-5"
              >
                {t('イベント詳細', 'Event Info')}
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

type Filter = 'all' | 'upcoming' | 'past'

export default function Events() {
  const [filter, setFilter] = useState<Filter>('all')
  const { t } = useLang()
  const { ref: filtersRef, inView: filtersInView } = useInView()

  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter)
  const upcoming = events.filter(e => e.status === 'upcoming')
  const past     = events.filter(e => e.status === 'past')

  const filterLabels: Record<Filter, string> = {
    all:      t(`すべて (${events.length})`,       `All (${events.length})`),
    upcoming: t(`開催予定 (${upcoming.length})`,   `Upcoming (${upcoming.length})`),
    past:     t(`終了済み (${past.length})`,        `Past (${past.length})`),
  }

  return (
    <>
      <PageHeader />

      <div className="max-w-3xl mx-auto px-6 pb-24">
        {/* Filter tabs */}
        <div
          ref={filtersRef}
          className={`flex items-center justify-center gap-2 mb-10 reveal-fade${filtersInView ? ' is-visible' : ''}`}
        >
          {(['all', 'upcoming', 'past'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-sans transition-all duration-200
                ${filter === f
                  ? 'bg-gradient-to-r from-kanade-rose to-kanade-lavender text-white shadow-lg shadow-kanade-rose/20'
                  : 'glass text-kanade-sand/50 hover:text-kanade-sand/80'}`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        {/* Event list */}
        <div className="flex flex-col gap-6">
          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              <Calendar size={40} className="mx-auto text-kanade-lavender/30 mb-4" />
              <p className="text-kanade-sand/40 text-sm">
                {t('この種別のイベントはまだありません。', 'No events in this category yet.')}
              </p>
            </div>
          ) : (
            filtered.map((event, i) => <EventCard key={event.id} event={event} index={i} />)
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-kanade-sand/30 text-xs mt-10 tracking-wider">
          {t(
            'イベント詳細は変更になる場合があります。最新情報はX（旧Twitter）でご確認ください。',
            'Event details are subject to change. Follow us on X for real-time updates.'
          )}
        </p>
      </div>
    </>
  )
}
