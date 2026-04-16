import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar, Clock, MapPin, ExternalLink, Tag,
  ArrowLeft, Twitter, Youtube, ChevronLeft, ChevronRight, X, Users,
} from 'lucide-react'
import { getEventBySlug } from '../../data/events'
import { members, roleColors } from '../../data/members'
import { useLang } from '../../context/LanguageContext'
import { useInView } from '../../hooks/useInView'

function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex)
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
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
        alt={`Image ${index + 1}`}
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
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const { ref: heroRef, inView: heroInView } = useInView()
  const { ref: bodyRef, inView: bodyInView } = useInView()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const event = slug ? getEventBySlug(slug) : undefined

  if (!event) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="text-kanade-sand/50 mb-6">{t('イベントが見つかりません。', 'Event not found.')}</p>
        <Link to="/events" className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-5">
          <ArrowLeft size={14} />
          {t('イベント一覧へ', 'Back to Events')}
        </Link>
      </div>
    )
  }

  const isPast = event.status === 'past'
  const date = new Date(event.date)

  const eventMembers = (event.memberIds ?? [])
    .map(id => members.find(m => m.id === id))
    .filter(Boolean) as typeof members

  const posterImages = [event.bannerImage, event.posterImage].filter(Boolean) as string[]
  const screenshotSrcs = (event.screenshots ?? []).map(s => s.src)

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
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        {event.bannerImage ? (
          <>
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-kanade-charcoal" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-kanade-deep to-kanade-charcoal" />
        )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 glass rounded-full px-4 py-2 flex items-center gap-2 text-xs text-kanade-sand/70 hover:text-kanade-sand transition-colors"
        >
          <ArrowLeft size={14} />
          {t('戻る', 'Back')}
        </button>

        {/* Status badge */}
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
              {/* Date block */}
              <div className="flex-shrink-0 text-center">
                <div className="glass rounded-xl px-5 py-4 min-w-[80px]">
                  <p className={`font-serif text-4xl font-light leading-none ${isPast ? 'text-kanade-sand/40' : 'text-kanade-blush'}`}>
                    {date.getDate()}
                  </p>
                  <p className="text-kanade-sand/50 text-xs uppercase tracking-wider mt-1">
                    {date.toLocaleString(lang === 'ja' ? 'ja' : 'en', { month: 'short' })}
                  </p>
                  <p className="text-kanade-sand/30 text-xs mt-0.5">{date.getFullYear()}</p>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="font-serif text-2xl md:text-3xl font-light mb-3 leading-snug">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
                  <span className="flex items-center gap-1.5 text-sm text-kanade-sand/50">
                    <Clock size={13} className="text-kanade-lavender/60" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-kanade-sand/50">
                    <MapPin size={13} className="text-kanade-lavender/60" />
                    {event.venue}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-kanade-sand/50">
                    <Calendar size={13} className="text-kanade-lavender/60" />
                    {event.world}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap mb-5">
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

                {/* Action links */}
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
                                 text-kanade-sand/60 hover:text-kanade-sand transition-colors"
                    >
                      <Twitter size={13} />
                      {t('Xで見る', 'View on X')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={bodyRef} className={`reveal-up reveal-delay-1${bodyInView ? ' is-visible' : ''} flex flex-col gap-8`}>
          {/* Full description */}
          {event.fullDescription && (
            <div className="card">
              <h2 className="font-serif text-lg font-light mb-4 text-kanade-sand/80">
                {t('イベント詳細', 'About this Event')}
              </h2>
              <div className="text-kanade-sand/60 text-sm leading-relaxed whitespace-pre-line">
                {event.fullDescription}
              </div>
            </div>
          )}

          {/* Posters */}
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
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-xl" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {eventMembers.length > 0 && (
            <div className="card">
              <h2 className="font-serif text-lg font-light mb-4 text-kanade-sand/80 flex items-center gap-2">
                <Users size={16} className="text-kanade-lavender/60" />
                {t('出演メンバー', 'Featured Members')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {eventMembers.map(member => (
                  <Link
                    key={member.id}
                    to="/members"
                    className={`glass rounded-xl p-3 bg-gradient-to-br ${member.color} hover:opacity-80 transition-opacity`}
                  >
                    <p className="font-serif text-sm font-light text-kanade-cream">{member.name}</p>
                    <span className={`text-xs border rounded-full px-2 py-0.5 mt-1 inline-block ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots */}
          {(event.screenshots ?? []).length > 0 && (
            <div className="card">
              <h2 className="font-serif text-lg font-light mb-4 text-kanade-sand/80">
                {t('スクリーンショット', 'Screenshots')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {event.screenshots!.map((shot, i) => (
                  <button
                    key={shot.src}
                    onClick={() => setLightboxIndex(posterImages.length + i)}
                    className="relative overflow-hidden rounded-xl group cursor-zoom-in aspect-video"
                  >
                    <img
                      src={shot.src}
                      alt={shot.caption ?? `Screenshot ${i + 1}`}
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
