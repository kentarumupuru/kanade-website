export type { Event, EventScreenshot, EventStatus } from './types'
export { kanadeLive2026 } from './2026-04-18-kanade-live'
export { housingTour77 } from './2026-04-19-housing-tour-77'
export { springBloom2026 } from './2026-05-03-spring-bloom'
export { moonlitSerenade2026 } from './2026-06-21-moonlit-serenade'
export { cherryBlossom2026 } from './2026-03-29-cherry-blossom'
export { valentinesGala2026 } from './2026-02-14-valentines-gala'

import { kanadeLive2026 } from './2026-04-18-kanade-live'
import { housingTour77 } from './2026-04-19-housing-tour-77'
import { springBloom2026 } from './2026-05-03-spring-bloom'
import { moonlitSerenade2026 } from './2026-06-21-moonlit-serenade'
import { cherryBlossom2026 } from './2026-03-29-cherry-blossom'
import { valentinesGala2026 } from './2026-02-14-valentines-gala'

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

/** Returns true if the event's date+time (JST) is in the past. Falls back to end-of-day if time is unparseable. */
export function isEventPast(event: { date: string; time: string }): boolean {
  const timeMatch = event.time.match(/(\d{1,2}):(\d{2})/)
  const hours = timeMatch ? parseInt(timeMatch[1], 10) : 23
  const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 59
  const [year, month, day] = event.date.split('-').map(Number)
  // Use Date.UTC to avoid local timezone mixing; treat time as JST (UTC+9)
  const eventUtcMs = Date.UTC(year, month - 1, day, hours - 9, minutes)
  return eventUtcMs <= Date.now()
}
