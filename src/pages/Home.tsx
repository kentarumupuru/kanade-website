import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { revealDelayClass } from '../utils/animations'
import { Calendar, Users, ImageIcon, ChevronDown } from 'lucide-react'
import { getUpcomingEvents } from '../data/events'
import { members } from '../data/members'
import { useLang } from '../context/LanguageContext'
import { useInView } from '../hooks/useInView'

const INVIEW_OPTS_01 = { threshold: 0.1 }

function HeroSection() {
  const { t } = useLang()
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      {/* Decorative rings — masked so they fade before reaching the button row */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 30%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 30%, transparent 72%)',
        }}
      >
        <div className="w-[600px] h-[600px] rounded-full border border-kanade-lavender/10 animate-spin-slow" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-kanade-blush/8" style={{ animationDirection: 'reverse' }} />
      </div>

      {/* Main hero content */}
      <div className="relative animate-fade-in">
        <p className="text-kanade-lavender/85 tracking-[0.5em] text-xs uppercase mb-6 font-sans">
          {t('ファイナルファンタジーXIV・パフォーミンググループ', 'Final Fantasy XIV · Performing Group')}
        </p>

        <h1 className="mb-4 flex justify-center">
          <img
            src={`${import.meta.env.BASE_URL}logos/titlelogo.png`}
            alt="KANADE"
            width={448}
            height={100}
            decoding="async"
            fetchPriority="high"
            className="w-auto max-w-xs sm:max-w-sm md:max-w-md"
          />
        </h1>

        <div className="w-32 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, #c3aed6, transparent)' }} />

        <p className="text-kanade-sand/75 font-sans font-light tracking-widest text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          {t(
            '音楽と動きが交わる場所。エオルゼアの舞台に美しさと温もりをもたらす、パフォーマー・アーティスト・職人たちのアンサンブル。',
            'Where music meets movement. An ensemble of performers, artists, and craftspeople bringing beauty and warmth to Eorzea\'s stages.'
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/events" className="btn-primary">
            {t('イベント情報', 'Upcoming Events')}
          </Link>
          <Link to="/members" className="btn-ghost">
            {t('メンバーを見る', 'Meet the Group')}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-soft">
        <span className="text-kanade-sand/30 text-xs tracking-widest uppercase">
          {t('スクロール', 'Scroll')}
        </span>
        <ChevronDown size={16} className="text-kanade-sand/30" />
      </div>
    </section>
  )
}

function VibesBanner() {
  const { t } = useLang()
  const { ref, inView } = useInView()
  return (
    <section className="py-16 px-6">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto text-center reveal-fade${inView ? ' is-visible' : ''}`}
      >
        <p className="font-serif text-3xl md:text-4xl font-light tracking-widest text-gradient">
          {t('一緒にバイブスを楽しもう', 'Enjoy the vibes with us')}
        </p>
      </div>
    </section>
  )
}

function UpcomingEvents() {
  const { t, lang } = useLang()
  const upcoming = getUpcomingEvents(2)
  const { ref: titleRef, inView: titleInView } = useInView()
  const { ref: cardsRef, inView: cardsInView } = useInView(INVIEW_OPTS_01)

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div ref={titleRef} className={`reveal-up${titleInView ? ' is-visible' : ''}`}>
          <h2 className="section-title text-center">{t('開催予定イベント', 'Upcoming Events')}</h2>
          <div className="section-divider" />
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 mb-10">
          {upcoming.map((event, i) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              className={`card group reveal-up ${revealDelayClass(i)}${cardsInView ? ' is-visible' : ''} block cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-center glass rounded-xl px-4 py-3 min-w-[64px]">
                  <p className="text-kanade-blush font-serif text-2xl font-light leading-none">
                    {new Date(event.date).getDate()}
                  </p>
                  <p className="text-kanade-sand/70 text-xs uppercase tracking-wider mt-0.5">
                    {new Date(event.date).toLocaleString(lang === 'ja' ? 'ja' : 'en', { month: 'short' })}
                  </p>
                </div>
                <div className="min-w-0">
                  <h3 className="text-kanade-cream font-serif text-lg font-light group-hover:text-kanade-blush transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-kanade-sand/70 text-xs mt-1">{event.time} · {event.world}</p>
                  <p className="text-kanade-sand/75 text-sm mt-2 line-clamp-2">{event.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {event.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-kanade-lavender/30 text-kanade-lavender/85">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={`text-center reveal-fade${cardsInView ? ' is-visible' : ''} reveal-delay-3`}>
          <Link to="/events" className="btn-ghost inline-flex items-center gap-2">
            <Calendar size={16} />
            {t('すべてのイベントを見る', 'View All Events')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function FeaturedMembers() {
  const { t } = useLang()
  const { ref, inView } = useInView()
  const representative = members.find(m => m.roles.includes('Representative'))

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className={`reveal-up${inView ? ' is-visible' : ''}`}>
          <h2 className="section-title text-center">{t('KANADEについて', 'Meet KANADE')}</h2>
          <div className="section-divider" />
        </div>

        {representative && (
          <div
            ref={ref}
            className={`flex justify-center mb-10 reveal-scale reveal-delay-2${inView ? ' is-visible' : ''}`}
          >
            <div className="card text-center group w-64">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${representative.color}
                              flex items-center justify-center mb-4 text-2xl font-serif
                              text-kanade-cream/60 group-hover:scale-110 transition-transform duration-300`}>
                {representative.name.charAt(0)}
              </div>
              <h3 className="font-serif text-lg text-kanade-cream font-light">
                {representative.name}
              </h3>
              <p className="text-kanade-lavender/85 text-xs tracking-widest uppercase mt-1">
                {t('団長', 'Representative')}
              </p>
            </div>
          </div>
        )}

        <div className={`text-center reveal-fade reveal-delay-3${inView ? ' is-visible' : ''}`}>
          <Link to="/members" className="btn-ghost inline-flex items-center gap-2">
            <Users size={16} />
            {t('メンバーを見る', 'Meet the Members')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function GalleryTeaser() {
  const { t } = useLang()
  const { ref: titleRef, inView: titleInView } = useInView()
  const { ref: gridRef, inView: gridInView } = useInView(INVIEW_OPTS_01)
  const tiles = [
    'from-kanade-blush/30 to-kanade-lavender/30',
    'from-kanade-lavender/30 to-kanade-mist/30',
    'from-kanade-gold/20 to-kanade-blush/20',
    'from-kanade-mist/30 to-kanade-lavender/20',
  ]

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div ref={titleRef} className={`reveal-up${titleInView ? ' is-visible' : ''}`}>
          <h2 className="section-title text-center">{t('ギャラリー', 'Gallery')}</h2>
          <div className="section-divider" />
        </div>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {tiles.map((gradient, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-gradient-to-br ${gradient}
                          flex items-center justify-center glass hover:scale-[1.02]
                          transition-transform duration-300 cursor-pointer
                          reveal-scale reveal-delay-${i + 1}${gridInView ? ' is-visible' : ''}`}
            >
              <ImageIcon size={28} className="text-kanade-cream/20" />
            </div>
          ))}
        </div>

        <div className={`text-center reveal-fade reveal-delay-2${gridInView ? ' is-visible' : ''}`}>
          <Link to="/gallery" className="btn-ghost inline-flex items-center gap-2">
            <ImageIcon size={16} />
            {t('ギャラリーを見る', 'View Gallery')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useSEO({ title: 'KANADE | Performing Group', description: 'Meet KANADE Performing Group!', url: '/' })
  return (
    <>
      <HeroSection />
      <VibesBanner />
      <UpcomingEvents />
      <FeaturedMembers />
      <GalleryTeaser />
    </>
  )
}
