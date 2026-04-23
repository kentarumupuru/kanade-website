// Re-export from the events folder — kept for backwards compatibility
export type { Event, EventScreenshot } from './events/types'
export { events, getEventBySlug, getEventById, isEventPast, isEventOngoing, getUpcomingEvents } from './events/index'
