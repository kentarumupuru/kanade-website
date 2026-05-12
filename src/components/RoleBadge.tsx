import { roleColors, type MemberRole } from '../data/members'

export function RoleBadge({ role, label }: { role: MemberRole; label: string }) {
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-sans tracking-widest uppercase ${roleColors[role]}`}>
      {label}
    </span>
  )
}
