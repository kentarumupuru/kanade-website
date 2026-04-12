export interface Track {
  id: number
  title: string
  artist: string
  duration: string
  src?: string
}

export const tracks: Track[] = [
  {
    id: 1,
    title: '死の大地 "A Land Long Dead" ~永久焦土 The・Burn~クワイアVer',
    artist: 'Mirka Flory',
    duration: '0:00',
    src: `${import.meta.env.BASE_URL}a-land-long-dead.mp3`,
  },
]
