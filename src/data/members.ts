export type MemberRole = 'Performer' | 'Housing' | 'Manager' | 'MC'

export interface Member {
  id: number
  name: string
  role: MemberRole
  job: string
  world: string
  bio: string
  color: string
  eventIds?: number[]
}

export const members: Member[] = [
  {
    id: 1,
    name: 'Kanade Mana',
    role: 'Performer',
    job: 'Dancer',
    world: 'Tonberry',
    bio: 'The heart of KANADE, Mana brings elegance and grace to every stage. Her performances weave stories through movement and music.',
    color: 'from-kanade-blush/20 to-kanade-lavender/20',
  },
  {
    id: 2,
    name: 'Himawari Sora',
    role: 'Performer',
    job: 'Bard',
    world: 'Tonberry',
    bio: 'A gifted musician whose melodies carry the warmth of sunflower fields. She leads the group\'s musical arrangements.',
    color: 'from-kanade-gold/20 to-kanade-blush/20',
  },
  {
    id: 3,
    name: 'Yuki Shirogane',
    role: 'Performer',
    job: 'Dancer',
    world: 'Tonberry',
    bio: 'Graceful as winter snowfall, Yuki\'s choreography is precise and breathtakingly beautiful.',
    color: 'from-kanade-mist/20 to-kanade-lavender/20',
  },
  {
    id: 4,
    name: 'Hana Tsukino',
    role: 'Performer',
    job: 'Red Mage',
    world: 'Tonberry',
    bio: 'Hana brings theatrical flair to the stage, blending arcane magic with dramatic performance.',
    color: 'from-kanade-rose/20 to-kanade-blush/20',
  },
  {
    id: 5,
    name: 'Rei Mizuki',
    role: 'Performer',
    job: 'Dancer',
    world: 'Tonberry',
    bio: 'With an infectious energy, Rei lifts every crowd. Her upbeat style keeps performances lively and joyful.',
    color: 'from-kanade-lavender/20 to-kanade-mist/20',
  },
  {
    id: 6,
    name: 'Aoi Harukaze',
    role: 'MC',
    job: 'White Mage',
    world: 'Tonberry',
    bio: 'Aoi is the warm voice that guides audiences through each show. Her calm presence puts everyone at ease.',
    color: 'from-kanade-mist/20 to-kanade-cream/10',
  },
  {
    id: 7,
    name: 'Nami Suzushiro',
    role: 'MC',
    job: 'Summoner',
    world: 'Tonberry',
    bio: 'Charismatic and quick-witted, Nami keeps the energy high between acts and connects with the audience effortlessly.',
    color: 'from-kanade-blush/20 to-kanade-gold/20',
  },
  {
    id: 8,
    name: 'Saya Akatsuki',
    role: 'Performer',
    job: 'Ninja',
    world: 'Tonberry',
    bio: 'Saya\'s performances are sharp and surprising. She specializes in high-energy, acrobatic stage routines.',
    color: 'from-kanade-deep/40 to-kanade-rose/20',
  },
  {
    id: 9,
    name: 'Kokoro Fujishiro',
    role: 'Housing',
    job: 'Interior Designer',
    world: 'Tonberry',
    bio: 'Kokoro transforms empty spaces into breathtaking performance venues. Every stage is a canvas for her artistry.',
    color: 'from-kanade-sand/20 to-kanade-lavender/20',
  },
  {
    id: 10,
    name: 'Mio Shirakawa',
    role: 'Housing',
    job: 'Interior Designer',
    world: 'Tonberry',
    bio: 'Detail-oriented and imaginative, Mio crafts immersive environments that transport audiences into another world.',
    color: 'from-kanade-cream/10 to-kanade-mist/20',
  },
  {
    id: 11,
    name: 'Tsukasa Kureha',
    role: 'Housing',
    job: 'Architect',
    world: 'Tonberry',
    bio: 'Tsukasa designs the grand structural layouts of KANADE\'s venues, ensuring every seat has a perfect view.',
    color: 'from-kanade-lavender/20 to-kanade-blush/20',
  },
  {
    id: 12,
    name: 'Ichika Momose',
    role: 'Performer',
    job: 'Pictomancer',
    world: 'Tonberry',
    bio: 'Ichika paints the stage with vivid magic and color, creating visual spectacles that dazzle the eye.',
    color: 'from-kanade-rose/20 to-kanade-lavender/20',
  },
  {
    id: 13,
    name: 'Riku Aoyama',
    role: 'Performer',
    job: 'Bard',
    world: 'Tonberry',
    bio: 'Riku\'s compositions are deeply emotional, drawing from Eorzean folk traditions and weaving them into something new.',
    color: 'from-kanade-gold/20 to-kanade-mist/20',
  },
  {
    id: 14,
    name: 'Haru Shinonome',
    role: 'Manager',
    job: 'Group Manager',
    world: 'Tonberry',
    bio: 'The backbone of KANADE, Haru coordinates every event, rehearsal, and collaboration. Nothing happens without her careful planning.',
    color: 'from-kanade-deep/50 to-kanade-gold/20',
  },
  {
    id: 15,
    name: 'Miyu Kageyama',
    role: 'Manager',
    job: 'Coordinator',
    world: 'Tonberry',
    bio: 'Miyu handles communications and partnerships, building bridges between KANADE and the wider FF14 community.',
    color: 'from-kanade-blush/20 to-kanade-sand/20',
  },
]

export const roleColors: Record<MemberRole, string> = {
  Performer: 'text-kanade-blush border-kanade-blush/40 bg-kanade-blush/10',
  Housing:   'text-kanade-lavender border-kanade-lavender/40 bg-kanade-lavender/10',
  Manager:   'text-kanade-gold border-kanade-gold/40 bg-kanade-gold/10',
  MC:        'text-kanade-mist border-kanade-mist/40 bg-kanade-mist/10',
}
