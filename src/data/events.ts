// Re-export from the events folder — kept for backwards compatibility
export type { Event, EventScreenshot, EventStatus } from './events/types'
export { events, getEventBySlug, getEventById, isEventPast } from './events/index'
