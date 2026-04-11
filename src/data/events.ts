export interface Event {
  id: number
  title: string
  date: string
  time: string
  venue: string
  world: string
  description: string
  ticketLink?: string
  status: 'upcoming' | 'past'
  tags: string[]
}

export const events: Event[] = [
  {
    id: 1,
    title: 'Spring Bloom Concert',
    date: '2026-05-03',
    time: '8:00 PM JST',
    venue: 'Shirogane Ward 12, Plot 18',
    world: 'Tonberry',
    description: 'Join KANADE for an evening of music and dance as we celebrate the arrival of spring in Eorzea. Featuring original choreography and live Bard performances.',
    ticketLink: '#',
    status: 'upcoming',
    tags: ['Concert', 'Dance', 'Live Music'],
  },
  {
    id: 2,
    title: 'Moonlit Serenade',
    date: '2026-06-21',
    time: '9:00 PM JST',
    venue: 'Mist Ward 5, Plot 3',
    world: 'Tonberry',
    description: 'A special midsummer night\'s performance under the stars. Intimate and ethereal, this show celebrates the summer solstice with enchanting melodies.',
    ticketLink: '#',
    status: 'upcoming',
    tags: ['Seasonal', 'Intimate', 'Summer'],
  },
  {
    id: 3,
    title: 'Cherry Blossom Opening',
    date: '2026-03-29',
    time: '7:00 PM JST',
    venue: 'Lavender Beds Ward 1, Plot 6',
    world: 'Tonberry',
    description: 'Our debut performance of the season welcomed over 80 attendees for a magical evening of dance and song among the falling petals.',
    status: 'past',
    tags: ['Season Opener', 'Dance', 'Special'],
  },
  {
    id: 4,
    title: 'Valentine\'s Eve Gala',
    date: '2026-02-14',
    time: '8:30 PM JST',
    venue: 'Goblet Ward 8, Plot 22',
    world: 'Tonberry',
    description: 'A romantic evening of performances dedicated to love and connection, featuring duets and heartfelt musical pieces.',
    status: 'past',
    tags: ['Seasonal', 'Gala', 'Special'],
  },
]
