import { Tag } from 'lucide-react'

export default function EventTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-kanade-lavender/20 text-kanade-lavender/80"
        >
          <Tag size={10} />
          {tag}
        </span>
      ))}
    </div>
  )
}
