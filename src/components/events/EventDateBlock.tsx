interface EventDateBlockProps {
  date: Date
  isPast: boolean
  isOngoing: boolean
  lang: string
}

export default function EventDateBlock({ date, isPast, isOngoing, lang }: EventDateBlockProps) {
  const dayColor = isPast ? 'text-kanade-sand/40' : isOngoing ? 'text-emerald-400' : 'text-kanade-blush'
  return (
    <div className="flex-shrink-0 text-center">
      <div className="glass rounded-xl px-4 py-3 min-w-[72px]">
        <p className={`font-serif text-3xl font-light leading-none ${dayColor}`}>
          {date.getDate()}
        </p>
        <p className="text-kanade-sand/70 text-xs uppercase tracking-wider mt-1">
          {date.toLocaleString(lang === 'ja' ? 'ja' : 'en', { month: 'short' })}
        </p>
        <p className="text-kanade-sand/30 text-xs mt-0.5">
          {date.getFullYear()}
        </p>
      </div>
    </div>
  )
}
