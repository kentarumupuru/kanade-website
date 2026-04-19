import { isEventOngoing, isEventPast, type Event } from '../../data/events'
import { useLang } from '../../context/LanguageContext'

export default function StatusBadge({ event }: { event: Event }) {
  const { t } = useLang()
  const ongoing = isEventOngoing(event)
  const isPast  = !ongoing && isEventPast(event)

  if (event.bannerImage) return null

  if (ongoing) {
    return (
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400 text-xs tracking-widest uppercase">
          {t('開催中', 'Ongoing')}
        </span>
      </div>
    )
  }

  if (!isPast) {
    return (
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-kanade-blush animate-pulse" />
        <span className="text-kanade-blush text-xs tracking-widest uppercase">
          {t('開催予定', 'Upcoming')}
        </span>
      </div>
    )
  }

  return (
    <div className="absolute top-4 right-4">
      <span className="text-kanade-sand/40 text-xs tracking-widest uppercase">
        {t('終了', 'Past')}
      </span>
    </div>
  )
}
