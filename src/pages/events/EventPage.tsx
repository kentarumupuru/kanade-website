import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ExternalLink, ArrowLeft, Users,
  XIcon, Youtube,
} from 'lucide-react'
import { getEventBySlug, isEventPast } from '../../data/events'
import { useSEO } from '../../hooks/useSEO'
import { useJsonLd } from '../../hooks/useJsonLd'
import { SITE_URL, BASE_URL as BASE } from '../../data/config'
import { members, roleColors } from '../../data/members'
import { useLang } from '../../context/LanguageContext'
import { useInView } from '../../hooks/useInView'
import Lightbox from '../../components/Lightbox'
import { EventDateBlock, EventMeta, EventTags } from '../../components/events'
import { buildEventJsonLd } from '../../utils/eventJsonLd'

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const { ref: heroRef, inView: heroInView } = useInView()
  const { ref: bodyRef, inView: bodyInView } = useInView()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const event = slug ? getEventBySlug(slug) : undefined

  useSEO({
    title: event ? `${event.title} — KANADE` : 'Event Details — KANADE',
    description: event ? event.description : 'Event Details',
    image: event?.bannerImage ? `${SITE_URL}/${event.bannerImage}` : undefined,
    url: `/events/${slug}`,
  })

  useJsonLd(event ? buildEventJsonLd(event) : null, 'event-jsonld')

  if (!event) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="text-kanade-sand/70 mb-6">{t('イベントが見つかりません。', 'Event not found.')}</p>
        <Link to="/events" className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-5">
          <ArrowLeft size={14} />
          {t('イベント一覧へ', 'Back to Events')}
        </Link>
      </div>
    )
  }

  const isPast = isEventPast(event)
  const date = new Date(event.date)

  const eventMembers = (event.memberIds ?? [])
    .map(id => members.find(m => m.id === id))
    .filter(Boolean) as typeof members

  const posterImages = [event.bannerImage, event.posterImage].filter(Boolean).map(p => `${BASE}${p}`)
  const screenshotSrcs = (event.screenshots ?? []).map(s => `${BASE}${s.src}`)

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          images={[...posterImages, ...screenshotSrcs]}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Hero banner */}
      <div className="relative w-full h-80 md:h-[34rem] overflow-hidden">
        {event.bannerImage ? (
          <>
            <img
              src={`${BASE}${event.bannerImage}`}
              alt={event.title}
              width={1600}
              height={900}
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover"
              style={{ objectPosition: event.bannerPosition ?? '50% 40%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-kanade-charcoal" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-kanade-deep to-kanade-charcoal" />
        )}

        <button
          onClick={() => navigate('/events')}
          className="absolute top-20 left-6 z-10 glass rounded-full px-4 py-2 flex items-center gap-2 text-xs text-kanade-sand/70 hover:text-kanade-sand transition-colors"
        >
          <ArrowLeft size={14} />
          {t('戻る', 'Back')}
        </button>

        <div className="absolute top-6 right-6">
          {!isPast ? (
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-kanade-blush animate-pulse" />
              <span className="text-kanade-blush text-xs tracking-widest uppercase">
                {t('開催予定', 'Upcoming')}
              </span>
            </div>
          ) : (
            <div className="glass rounded-full px-3 py-1.5">
              <span className="text-kanade-sand/40 text-xs tracking-widest uppercase">
                {t('終了', 'Past')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24 -mt-8">
        {/* Title block */}
        <div ref={heroRef} className={`reveal-up${heroInView ? ' is-visible' : ''} mb-10`}>
          <div className="card">
            <div className="flex gap-5 flex-wrap sm:flex-nowrap">
              <EventDateBlock date={date} isPast={isPast} isOngoing={false} lang={lang} />

              <div className="flex-1 min-w-0">
                <h1 className="font-serif text-2xl md:text-3xl font-light mb-3 leading-snug">
                  {event.title}
                </h1>

                <EventMeta event={event} />

                <div className="mb-5">
                  <EventTags tags={event.tags} />
                </div>

                <div className="flex flex-wrap gap-3">
                  {event.streamLink && (
                    <a
                      href={event.streamLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-5"
                    >
                      <Youtube size={13} />
                      {t('配信を見る', 'Watch Stream')}
                    </a>
                  )}
                  {event.ticketLink && event.ticketLink !== '#' && (
                    <a
                      href={event.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-5"
                    >
                      <ExternalLink size={13} />
                      {t('チケット', 'Tickets')}
                    </a>
                  )}
                  {event.twitterLink && (
                    <a
                      href={event.twitterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass inline-flex items-center gap-2 text-xs py-2 px-5 rounded-full
                                 text-kanade-sand/75 hover:text-kanade-sand transition-colors"
                    >
                      <XIcon size={13} />
                      {t('Xで見る', 'View on X')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={bodyRef} className={`reveal-up reveal-delay-1${bodyInView ? ' is-visible' : ''} flex flex-col gap-8`}>
          {event.fullDescription && (
            <div className="card">
              <h2 className="font-serif text-lg font-light mb-4 text-kanade-sand/80">
                {t('イベント詳細', 'About this Event')}
              </h2>
              <div className="text-kanade-sand/75 text-sm leading-relaxed whitespace-pre-line">
                {event.fullDescription}
              </div>
            </div>
          )}

          {posterImages.length > 0 && (
            <div className="card">
              <h2 className="font-serif text-lg font-light mb-4 text-kanade-sand/80">
                {t('ポスター・バナー', 'Posters & Banners')}
              </h2>
              <div className={`grid gap-4 ${posterImages.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {posterImages.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setLightboxIndex(i)}
                    className="relative overflow-hidden rounded-xl group cursor-zoom-in"
                  >
                    <img
                      src={src}
                      alt={`Poster ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-xl" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {eventMembers.length > 0 && (
            <div className="card">
              <h2 className="font-serif text-lg font-light mb-4 text-kanade-sand/80 flex items-center gap-2">
                <Users size={16} className="text-kanade-lavender/80" />
                {t('出演メンバー', 'Featured Members')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {eventMembers.map(member => (
                  <Link
                    key={member.id}
                    to={`/members#member-${member.id}`}
                    className={`glass rounded-xl p-3 bg-gradient-to-br ${member.color} hover:opacity-80 transition-opacity`}
                  >
                    <p className="font-serif text-sm font-light text-kanade-cream">{member.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.roles.map(role => (
                        <span key={role} className={`text-xs border rounded-full px-2 py-0.5 inline-block ${roleColors[role]}`}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(event.screenshots ?? []).length > 0 && (
            <div className="card">
              <h2 className="font-serif text-lg font-light mb-4 text-kanade-sand/80">
                {t('スクリーンショット', 'Screenshots')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {event.screenshots?.map((shot, i) => (
                  <button
                    key={shot.src}
                    onClick={() => setLightboxIndex(posterImages.length + i)}
                    className="relative overflow-hidden rounded-xl group cursor-zoom-in aspect-video"
                  >
                    <img
                      src={shot.src}
                      alt={shot.caption ?? `Screenshot ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {shot.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-xs text-kanade-sand/80 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        {shot.caption}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
