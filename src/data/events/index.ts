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

/** Returns true if the event date is in the past (date < today). */
export function isEventPast(event: { date: string }): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(event.date) < today
}
