export interface Track {
  id: number
  title: string
  artist: string
  duration: string
  src?: string
}

// Placeholder tracks — replace src with actual audio file paths
export const tracks: Track[] = [
  { id: 1, title: 'Petal Dance',         artist: 'KANADE', duration: '3:42' },
  { id: 2, title: 'Moonlit Stage',        artist: 'KANADE', duration: '4:15' },
  { id: 3, title: 'Gentle Overture',      artist: 'KANADE', duration: '2:58' },
  { id: 4, title: 'Blossom Road',         artist: 'KANADE', duration: '3:30' },
  { id: 5, title: 'Evening Serenade',     artist: 'KANADE', duration: '4:02' },
]
