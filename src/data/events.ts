// Re-export from the events folder — kept for backwards compatibility
export type { Event, EventScreenshot } from './events/types'
export { events, getEventBySlug, getEventById, isEventPast, isEventOngoing } from './events/index'
