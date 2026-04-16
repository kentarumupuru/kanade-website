export type EventStatus = 'upcoming' | 'past'

export interface EventScreenshot {
  src: string
  caption?: string
}

export interface Event {
  id: number
  slug: string
  title: string
  date: string
  time: string
  venue: string
  world: string
  description: string
  fullDescription?: string
  ticketLink?: string
  twitterLink?: string
  streamLink?: string
  status: EventStatus
  tags: string[]
  bannerImage?: string
  posterImage?: string
  memberIds?: number[]
  screenshots?: EventScreenshot[]
}
