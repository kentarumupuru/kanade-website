import { Clock, MapPin, Calendar } from 'lucide-react'
import type { Event } from '../../data/events'

export default function EventMeta({ event }: { event: Event }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
      <span className="flex items-center gap-1.5 text-xs text-kanade-sand/70">
        <Clock size={12} className="text-kanade-lavender/80" />
        {event.time}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-kanade-sand/70">
        <MapPin size={12} className="text-kanade-lavender/80" />
        {event.venue}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-kanade-sand/70">
        <Calendar size={12} className="text-kanade-lavender/80" />
        {event.world}
      </span>
    </div>
  )
}
