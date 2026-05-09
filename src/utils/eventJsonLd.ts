import type { Event } from '../data/events'
import { SITE_URL } from '../data/config'

export function buildEventJsonLd(event: Event): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: `${event.date}T${event.time.replace(' JST', '+09:00')}`,
    location: { '@type': 'Place', name: `${event.venue}, ${event.world}` },
    description: event.description,
    organizer: { '@type': 'Organization', name: 'KANADE', url: SITE_URL },
    ...(event.bannerImage && { image: `${SITE_URL}/${event.bannerImage}` }),
  }
}
