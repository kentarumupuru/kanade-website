interface FilterButtonProps {
  value: string
  label: string
  isActive: boolean
  onClick: (value: string) => void
  count?: number
}

export function FilterButton({ value, label, isActive, onClick, count }: FilterButtonProps) {
  return (
    <button
      key={value}
      onClick={() => onClick(value)}
      className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-sans transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-kanade-rose to-kanade-lavender text-white shadow-lg shadow-kanade-rose/20'
          : 'glass text-kanade-sand/70 hover:text-kanade-sand/80'
      }`}
    >
      {label}
      {count !== undefined && <span className="ml-1.5 opacity-60">({count})</span>}
    </button>
  )
}
