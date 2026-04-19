import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ExternalLink } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { events, isEventPast, isEventOngoing, type Event } from '../data/events'
import { useLang } from '../context/LanguageContext'
import { useInView } from '../hooks/useInView'
import Lightbox from '../components/Lightbox'
import { revealDelayClass } from '../utils/animations'
import { StatusBadge, EventDateBlock, EventMeta, EventTags, EventsPageHeader } from '../components/events'

const BASE = import.meta.env.BASE_URL

type Filter = 'all' | 'upcoming' | 'ongoing' | 'past'

function EventBanner({ event, onViewPoster }: { event: Event; onViewPoster: () => void }) {
  const { t } = useLang()
  if (!event.bannerImage) return null
  return (
    <div className="relative -mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl h-44">
      <img
        src={`${BASE}${event.bannerImage}`}
        alt={event.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: event.bannerPosition ?? '50% 40%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-kanade-charcoal/90" />
      {event.posterImage && (
        <button
          onClick={onViewPoster}
          className="absolute bottom-3 right-3 glass rounded-full px-3 py-1.5 text-xs text-kanade-sand/80 hover:text-kanade-sand transition-colors tracking-wide"
        >
          {t('ポスターを見る', 'View Poster')}
        </button>
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
  const ongoing = isEventOngoing(event)
  const isPast = !ongoing && isEventPast(event)
  const posterImages = [event.bannerImage, event.posterImage].filter(Boolean).map(p => `${BASE}${p}`)

  return (
    <>
      {showPoster && posterImages.length > 0 && (
        <Lightbox images={posterImages} startIndex={0} onClose={() => setShowPoster(false)} />
      )}
      <article
        ref={ref}
        className={`card group relative overflow-hidden ${isPast ? 'opacity-60' : ''} reveal-up ${revealDelayClass(index)}${inView ? ' is-visible' : ''}`}
      >
        <EventBanner event={event} onViewPoster={() => setShowPoster(true)} />
        <StatusBadge event={event} />

        <div className="flex gap-5">
          <EventDateBlock date={date} isPast={isPast} isOngoing={ongoing} lang={lang} />

          <div className="flex-1 min-w-0">
            <h2 className={`font-serif text-xl font-light mb-2 transition-colors duration-200 ${isPast ? '' : 'group-hover:text-kanade-blush'}`}>
              {event.title}
            </h2>
            <EventMeta event={event} />
            <p className="text-kanade-sand/75 text-sm leading-relaxed mb-4">{event.description}</p>
            <div className="flex flex-col gap-3">
              <EventTags tags={event.tags} />
              <div className="flex justify-end">
                <button
                  onClick={() => navigate(`/events/${event.slug}`)}
                  className="btn-primary flex items-center gap-2 text-xs py-2 px-5"
                >
                  {t('イベント詳細', 'Event Info')}
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

export default function Events() {
  useSEO({ title: 'Events — KANADE', description: 'Live performances across Eorzea', url: '/events' })
  const [filter, setFilter] = useState<Filter>('all')
  const { t } = useLang()
  const { ref: filtersRef, inView: filtersInView } = useInView()

  const ongoing  = events.filter(e => isEventOngoing(e))
  const upcoming = events.filter(e => !isEventPast(e) && !isEventOngoing(e))
  const past     = events.filter(e => isEventPast(e))
  const filtered =
    filter === 'all'      ? events :
    filter === 'upcoming' ? upcoming :
    filter === 'ongoing'  ? ongoing :
    past

  const filterLabels: Record<Filter, string> = {
    all:      t(`すべて (${events.length})`,       `All (${events.length})`),
    upcoming: t(`開催予定 (${upcoming.length})`,   `Upcoming (${upcoming.length})`),
    ongoing:  t(`開催中 (${ongoing.length})`,      `Ongoing (${ongoing.length})`),
    past:     t(`終了済み (${past.length})`,        `Past (${past.length})`),
  }

  return (
    <>
      <EventsPageHeader />

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div
          ref={filtersRef}
          className={`flex items-center justify-center gap-2 mb-10 reveal-fade${filtersInView ? ' is-visible' : ''}`}
        >
          {(['all', 'upcoming', 'ongoing', 'past'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-sans transition-all duration-200
                ${filter === f
                  ? 'bg-gradient-to-r from-kanade-rose to-kanade-lavender text-white shadow-lg shadow-kanade-rose/20'
                  : 'glass text-kanade-sand/70 hover:text-kanade-sand/80'}`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

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
