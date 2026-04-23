export type { Event, EventScreenshot } from './types'

import { kanadeLive2026 } from './2026-04-18-kanade-live'
import { housingTour77 } from './2026-04-19-housing-tour-77'
import { springBloom2026 } from './2026-05-03-spring-bloom'
import { moonlitSerenade2026 } from './2026-06-21-moonlit-serenade'
import { cherryBlossom2026 } from './2026-03-29-cherry-blossom'
import { valentinesGala2026 } from './2026-02-14-valentines-gala'

export { kanadeLive2026, housingTour77, springBloom2026, moonlitSerenade2026, cherryBlossom2026, valentinesGala2026 }

export const events = [
  kanadeLive2026,
  housingTour77,
  springBloom2026,
  moonlitSerenade2026,
  cherryBlossom2026,
  valentinesGala2026,
]

export function getEventBySlug(slug: string) {
  return events.find(e => e.slug === slug)
}

export function getEventById(id: number) {
  return events.find(e => e.id === id)
}

function eventStartUtcMs(event: { date: string; time: string }): number {
  const timeMatch = event.time.match(/(\d{1,2}):(\d{2})/)
  const hours = timeMatch ? parseInt(timeMatch[1], 10) : 23
  const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 59
  const [year, month, day] = event.date.split('-').map(Number)
  return Date.UTC(year, month - 1, day, hours - 9, minutes)
}

function eventEndUtcMs(event: { date: string; endTime?: string }): number | null {
  if (!event.endTime) return null
  const timeMatch = event.endTime.match(/(\d{1,2}):(\d{2})/)
  if (!timeMatch) return null
  const hours = parseInt(timeMatch[1], 10)
  const minutes = parseInt(timeMatch[2], 10)
  const [year, month, day] = event.date.split('-').map(Number)
  return Date.UTC(year, month - 1, day, hours - 9, minutes)
}

/** Returns true if the event is currently in progress (between start and end time). */
export function isEventOngoing(event: { date: string; time: string; endTime?: string }): boolean {
  const now = Date.now()
  const start = eventStartUtcMs(event)
  const end = eventEndUtcMs(event)
  if (end === null) return false
  return now >= start && now < end
}

/** Returns true if the event's date+time (JST) is fully in the past (after end time if set, else after start time). */
export function isEventPast(event: { date: string; time: string; endTime?: string }): boolean {
  const now = Date.now()
  const end = eventEndUtcMs(event)
  if (end !== null) return now >= end
  return eventStartUtcMs(event) <= now
}

/** Returns upcoming (not past, not ongoing) events sorted by date ascending, optionally capped. */
export function getUpcomingEvents(limit?: number) {
  const upcoming = events
    .filter(e => !isEventPast(e) && !isEventOngoing(e))
    .sort((a, b) => eventStartUtcMs(a) - eventStartUtcMs(b))
  return typeof limit === 'number' ? upcoming.slice(0, limit) : upcoming
}
