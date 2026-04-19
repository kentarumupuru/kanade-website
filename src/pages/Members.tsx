import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { Globe } from 'lucide-react'

function XLogo({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1200 1227" fill="currentColor" aria-hidden="true">
      <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.163 519.284ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.828Z" />
    </svg>
  )
}
import { members, roleColors, type MemberRole } from '../data/members'
import { useLang } from '../context/LanguageContext'
import { useInView } from '../hooks/useInView'

function PageHeader() {
  const { t } = useLang()
  const { ref, inView } = useInView()
  return (
    <section className="pt-32 pb-12 px-6 text-center">
      <div ref={ref} className={`reveal-up${inView ? ' is-visible' : ''}`}>
        <p className="text-kanade-lavender/60 tracking-[0.4em] text-xs uppercase mb-4 font-sans">
          {t('アンサンブル', 'The Ensemble')}
        </p>
        <h1 className="section-title">{t('メンバー', 'Our Members')}</h1>
        <div className="section-divider" />
        <p className="text-kanade-sand/50 max-w-xl mx-auto text-sm leading-relaxed">
          {t(
            'KANADEは15名の仲間で構成されています。ステージパフォーマーやバード奏者から、ハウジングアーティスト、MC、マネージャー、ストリーマーまで多彩なメンバーが揃っています。',
            'KANADE is made up of 15 dedicated individuals — from stage performers and Bards to housing artists, MCs, managers, and streamers.'
          )}
        </p>
      </div>
    </section>
  )
}

function MemberCard({ member, roleLabels, index }: { member: typeof members[0]; roleLabels: Record<MemberRole, string>; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const { t } = useLang()
  const { ref, inView } = useInView({ threshold: 0.1 })
  const delayClass = `reveal-delay-${Math.min((index % 4) + 1, 6)}`

  const nameNode = member.link
    ? (
      <Link
        to={member.link}
        className="font-serif text-lg text-kanade-cream font-light mb-1 hover:text-kanade-lavender transition-colors duration-200 underline underline-offset-4 decoration-kanade-lavender/40"
        onClick={e => e.stopPropagation()}
      >
        {member.name}
      </Link>
    )
    : <h3 className="font-serif text-lg text-kanade-cream font-light mb-1">{member.name}</h3>

  return (
    <div
      ref={ref}
      id={`member-${member.id}`}
      className={`cursor-pointer reveal-scale ${delayClass}${inView ? ' is-visible' : ''}`}
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(v => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(v => !v)}
      aria-label={`${member.name} — ${t('クリックして紹介を読む', 'click to read bio')}`}
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '260px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-white/8"
          style={{
            background: 'rgba(255,255,255,0.05)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            visibility: flipped ? 'hidden' : 'visible',
          }}
        >
          {/* Avatar */}
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color}
                        flex items-center justify-center mb-4 text-3xl font-serif text-kanade-cream/60
                        border border-white/10 shadow-lg`}
          >
            {member.name[0]}
          </div>

          {nameNode}

          {/* Role badges */}
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            {member.roles.map(role => (
              <span key={role} className={`text-xs px-2.5 py-0.5 rounded-full border font-sans tracking-widest uppercase ${roleColors[role]}`}>
                {roleLabels[role]}
              </span>
            ))}
          </div>

          {member.twitterHandle ? (
            <a
              href={`https://x.com/${member.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-kanade-sand/50 hover:text-kanade-blush transition-colors duration-200 text-xs mt-2"
            >
              <XLogo size={11} />
              @{member.twitterHandle}
            </a>
          ) : (
            <p className="text-kanade-lavender/60 text-xs tracking-wider mt-2">{member.job}</p>
          )}

          <div className="flex items-center gap-1 mt-3 text-kanade-sand/30">
            <Globe size={11} />
            <span className="text-xs">{member.world}</span>
          </div>

          <p className="text-kanade-sand/30 text-xs mt-4">
            {t('クリックして紹介を読む', 'Click to read bio')}
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col justify-center p-6 border border-white/8"
          style={{
            background: 'rgba(255,255,255,0.05)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            visibility: flipped ? 'visible' : 'hidden',
          }}
        >
          <div className="flex flex-wrap gap-1 mb-3">
            {member.roles.map(role => (
              <span key={role} className={`text-xs px-2.5 py-0.5 rounded-full border ${roleColors[role]}`}>
                {roleLabels[role]}
              </span>
            ))}
          </div>
          <h3 className="font-serif text-lg text-kanade-cream font-light mb-3">{member.name}</h3>
          <p className="text-kanade-sand/60 text-sm leading-relaxed flex-1">{t(member.bioJa, member.bio)}</p>
          <p className="text-kanade-sand/30 text-xs mt-4">
            {t('クリックして戻る', 'Click to flip back')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Members() {
  useSEO({ title: 'Members — KANADE', description: 'Meet our members', url: '/members' })
  const [activeRole, setActiveRole] = useState<MemberRole | 'all'>('all')
  const { t } = useLang()
  const { ref: filtersRef, inView: filtersInView } = useInView()

  const roleFilters: { label: string; value: MemberRole | 'all' }[] = [
    { label: t('すべて',         'All'),            value: 'all' },
    { label: t('団長',           'Representative'), value: 'Representative' },
    { label: t('楽器演奏',       'Performers'),     value: 'Performer' },
    { label: t('ハウジング',     'Housing'),        value: 'Housing' },
    { label: 'MC',                                  value: 'MC' },
    { label: t('マネージャー',   'Managers'),       value: 'Manager' },
    { label: t('ストリーマー',   'Streamers'),      value: 'Streamer' },
  ]

  const roleLabels = useMemo<Record<MemberRole, string>>(() => ({
    Performer:      t('楽器演奏',     'Performer'),
    Housing:        t('ハウジング',   'Housing'),
    Manager:        t('マネージャー', 'Manager'),
    MC:             'MC',
    Streamer:       t('ストリーマー', 'Streamer'),
    Representative: t('団長',         'Representative'),
  }), [t])

  const allRoles: MemberRole[] = ['Representative', 'Performer', 'Housing', 'MC', 'Manager', 'Streamer']

  const roleCounts = useMemo(() =>
    allRoles.reduce<Record<MemberRole, number>>(
      (acc, role) => ({ ...acc, [role]: members.filter(m => m.roles.includes(role)).length }),
      {} as Record<MemberRole, number>
    ), [])

  const filtered = activeRole === 'all'
    ? members
    : members.filter(m => m.roles.includes(activeRole))

  return (
    <>
      <PageHeader />

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Role filters */}
        <div
          ref={filtersRef}
          className={`flex flex-wrap items-center justify-center gap-2 mb-12 reveal-fade${filtersInView ? ' is-visible' : ''}`}
        >
          {roleFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveRole(value)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-sans transition-all duration-200
                ${activeRole === value
                  ? 'bg-gradient-to-r from-kanade-rose to-kanade-lavender text-white shadow-lg shadow-kanade-rose/20'
                  : 'glass text-kanade-sand/50 hover:text-kanade-sand/80'}`}
            >
              {label}
              {value !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  ({roleCounts[value as MemberRole]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((member, i) => (
            <MemberCard key={member.id} member={member} roleLabels={roleLabels} index={i} />
          ))}
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 pt-8 border-t border-white/5">
          {allRoles.map(role => (
            <div key={role} className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border ${roleColors[role]}`}>
                {roleLabels[role]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
