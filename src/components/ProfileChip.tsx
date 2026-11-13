import { equippedCosmetics } from '../utils/leaderboard'
import { cn } from '../utils/cn'
import { Avatar } from './Avatar'

export type ProfileChipProps = {
  username: string
  cosmetics?: unknown
  size?: 'sm' | 'md'
}

export function ProfileChip({ username, cosmetics, size = 'sm' }: ProfileChipProps) {
  // Ids stay on the element so art, fonts, and badges can attach later. The drawing stays the default.
  const equipped = equippedCosmetics(cosmetics)

  return (
    <span
      className={cn('profile-chip', size === 'md' && 'profile-chip-md')}
      data-avatar={equipped.avatar ?? undefined}
      data-decoration={equipped.decoration ?? undefined}
      data-name-color={equipped.nameColor ?? undefined}
      data-name-font={equipped.nameFont ?? undefined}
      data-nameplate={equipped.nameplate ?? 'default'}
      data-badges={equipped.badges.length > 0 ? equipped.badges.join(' ') : undefined}
    >
      <span className="profile-chip-avatar">
        <Avatar name={username} size={size === 'md' ? 'md' : 'sm'} />
      </span>
      <span className="profile-chip-name">{username}</span>
    </span>
  )
}
