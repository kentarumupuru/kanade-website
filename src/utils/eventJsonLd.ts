import type { Event } from '../data/events'
import { SITE_URL } from '../data/config'
import { parseJstHoursMinutes } from './parseJstTime'

export function buildEventJsonLd(event: Event): object {
  const { hours, minutes } = parseJstHoursMinutes(event.time)
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: `${event.date}T${hh}:${mm}+09:00`,
    location: { '@type': 'Place', name: `${event.venue}, ${event.world}` },
    description: event.description,
    organizer: { '@type': 'Organization', name: 'KANADE', url: SITE_URL },
    ...(event.bannerImage && { image: `${SITE_URL}/${event.bannerImage}` }),
  }
}
