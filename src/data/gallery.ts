export interface GalleryImage {
  id: number
  src: string
  thumbnail: string
  alt: string
  caption?: string
  captionJa?: string
  category: 'performance' | 'venue' | 'group' | 'behind-the-scenes'
}

const BASE = import.meta.env.BASE_URL

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: `${BASE}gallery/image-1.jpg`,
    thumbnail: `${BASE}gallery/thumb-1.jpg`,
    alt: 'KANADE performance photo 1',
    caption: 'Spring Bloom Concert — Shirogane',
    captionJa: 'スプリングブルームコンサート — 白銀',
    category: 'performance',
  },
  {
    id: 2,
    src: `${BASE}gallery/image-2.jpg`,
    thumbnail: `${BASE}gallery/thumb-2.jpg`,
    alt: 'KANADE performance photo 2',
    caption: 'Moonlit Serenade rehearsal',
    captionJa: '月光セレナーデ リハーサル',
    category: 'venue',
  },
  {
    id: 3,
    src: `${BASE}gallery/image-3.jpg`,
    thumbnail: `${BASE}gallery/thumb-3.jpg`,
    alt: 'KANADE performance photo 3',
    caption: 'Housing setup by Kokoro & Mio',
    captionJa: 'こころ＆みおによるハウジングセットアップ',
    category: 'group',
  },
  {
    id: 4,
    src: `${BASE}gallery/image-4.jpg`,
    thumbnail: `${BASE}gallery/thumb-4.jpg`,
    alt: 'KANADE performance photo 4',
    caption: 'Cherry Blossom Opening night',
    captionJa: 'さくら開幕ナイト',
    category: 'behind-the-scenes',
  },
  {
    id: 5,
    src: `${BASE}gallery/image-5.jpg`,
    thumbnail: `${BASE}gallery/thumb-5.jpg`,
    alt: 'KANADE performance photo 5',
    caption: 'Behind the curtain',
    captionJa: '舞台裏にて',
    category: 'performance',
  },
  {
    id: 6,
    src: `${BASE}gallery/image-6.jpg`,
    thumbnail: `${BASE}gallery/thumb-6.jpg`,
    alt: 'KANADE performance photo 6',
    caption: 'Backstage preparations',
    captionJa: '開演前の準備',
    category: 'venue',
  },
  {
    id: 7,
    src: `${BASE}gallery/image-7.jpg`,
    thumbnail: `${BASE}gallery/thumb-7.jpg`,
    alt: 'KANADE performance photo 7',
    caption: 'Group gathering at the Goblet',
    captionJa: 'ゴブレットでのグループ集合',
    category: 'group',
  },
  {
    id: 8,
    src: `${BASE}gallery/image-8.jpg`,
    thumbnail: `${BASE}gallery/thumb-8.jpg`,
    alt: 'KANADE performance photo 8',
    caption: 'Mana & Himawari duet',
    captionJa: 'マナ＆ひまわりのデュエット',
    category: 'behind-the-scenes',
  },
  {
    id: 9,
    src: `${BASE}gallery/image-9.jpg`,
    thumbnail: `${BASE}gallery/thumb-9.jpg`,
    alt: 'KANADE performance photo 9',
    caption: 'Lavender Beds venue',
    captionJa: 'ラベンダーベッズ会場',
    category: 'performance',
  },
  {
    id: 10,
    src: `${BASE}gallery/image-10.jpg`,
    thumbnail: `${BASE}gallery/thumb-10.jpg`,
    alt: 'KANADE performance photo 10',
    caption: 'Pre-show lineup',
    captionJa: '開演前の整列',
    category: 'venue',
  },
  {
    id: 11,
    src: `${BASE}gallery/image-11.jpg`,
    thumbnail: `${BASE}gallery/thumb-11.jpg`,
    alt: 'KANADE performance photo 11',
    caption: 'Audience view from the stage',
    captionJa: 'ステージからの客席',
    category: 'group',
  },
  {
    id: 12,
    src: `${BASE}gallery/image-12.jpg`,
    thumbnail: `${BASE}gallery/thumb-12.jpg`,
    alt: 'KANADE performance photo 12',
    caption: 'Post-show celebration',
    captionJa: '公演後のお祝い',
    category: 'behind-the-scenes',
  },
]
