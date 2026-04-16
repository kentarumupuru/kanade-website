export type { Event, EventScreenshot, EventStatus } from './types'
export { kanadeLive2026 } from './kanade-live-2026'
export { springBloom2026 } from './spring-bloom-2026'
export { moonlitSerenade2026 } from './moonlit-serenade-2026'
export { cherryBlossom2026 } from './cherry-blossom-2026'
export { valentinesGala2026 } from './valentines-gala-2026'

import { kanadeLive2026 } from './kanade-live-2026'
import { springBloom2026 } from './spring-bloom-2026'
import { moonlitSerenade2026 } from './moonlit-serenade-2026'
import { cherryBlossom2026 } from './cherry-blossom-2026'
import { valentinesGala2026 } from './valentines-gala-2026'

export const events = [
  kanadeLive2026,
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
