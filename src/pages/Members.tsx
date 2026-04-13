import { useState } from 'react'
import { Globe } from 'lucide-react'
import { members, roleColors, type MemberRole } from '../data/members'
import { useLang } from '../context/LanguageContext'

function PageHeader() {
  const { t } = useLang()
  return (
    <section className="pt-32 pb-12 px-6 text-center">
      <p className="text-kanade-lavender/60 tracking-[0.4em] text-xs uppercase mb-4 font-sans">
        {t('アンサンブル', 'The Ensemble')}
      </p>
      <h1 className="section-title">{t('メンバー', 'Our Members')}</h1>
      <div className="section-divider" />
      <p className="text-kanade-sand/50 max-w-xl mx-auto text-sm leading-relaxed">
        {t(
          'KANADEは15名の仲間で構成されています。ステージパフォーマーやバード奏者から、ハウジングアーティスト、MC、マネージャーまで多彩なメンバーが揃っています。',
          'KANADE is made up of 15 dedicated individuals — from stage performers and Bards to housing artists, MCs, and behind-the-scenes managers.'
        )}
      </p>
    </section>
  )
}

function MemberCard({ member, roleLabels }: { member: typeof members[0]; roleLabels: Record<MemberRole, string> }) {
  const [flipped, setFlipped] = useState(false)
  const { t } = useLang()

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(v => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setFlipped(v => !v)}
      aria-label={`${member.name} — ${t('クリックして紹介を読む', 'click to read bio')}`}
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '240px',
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

          <h3 className="font-serif text-lg text-kanade-cream font-light mb-1">{member.name}</h3>

          <span className={`text-xs px-3 py-1 rounded-full border font-sans tracking-widest uppercase ${roleColors[member.role]}`}>
            {roleLabels[member.role]}
          </span>

          <p className="text-kanade-lavender/60 text-xs tracking-wider mt-2">{member.job}</p>

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
          <span className={`self-start text-xs px-3 py-1 rounded-full border mb-3 ${roleColors[member.role]}`}>
            {roleLabels[member.role]}
          </span>
          <h3 className="font-serif text-lg text-kanade-cream font-light mb-3">{member.name}</h3>
          <p className="text-kanade-sand/60 text-sm leading-relaxed flex-1">{member.bio}</p>
          <p className="text-kanade-sand/30 text-xs mt-4">
            {t('クリックして戻る', 'Click to flip back')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Members() {
  const [activeRole, setActiveRole] = useState<MemberRole | 'all'>('all')
  const { t } = useLang()

  const roleFilters: { label: string; value: MemberRole | 'all' }[] = [
    { label: t('すべて',         'All'),        value: 'all' },
    { label: t('パフォーマー',   'Performers'), value: 'Performer' },
    { label: t('ハウジング',     'Housing'),    value: 'Housing' },
    { label: 'MC',                              value: 'MC' },
    { label: t('マネージャー',   'Managers'),   value: 'Manager' },
  ]

  const roleLabels: Record<MemberRole, string> = {
    Performer: t('パフォーマー', 'Performer'),
    Housing:   t('ハウジング',   'Housing'),
    Manager:   t('マネージャー', 'Manager'),
    MC:        'MC',
  }

  const filtered: typeof members = activeRole === 'all'
    ? members
    : members.filter(m => m.role === activeRole)

  return (
    <>
      <PageHeader />

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Role filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
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
                  ({members.filter(m => m.role === value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(member => (
            <MemberCard key={member.id} member={member} roleLabels={roleLabels} />
          ))}
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 pt-8 border-t border-white/5">
          {(['Performer', 'Housing', 'MC', 'Manager'] as MemberRole[]).map(role => (
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
