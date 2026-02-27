import { LuMail, LuUser } from 'react-icons/lu'
import { useAuthStore } from '@store/useAuthStore'

const ProfileSection = () => {
  const { user } = useAuthStore()

  if (!user) return null

  const displayName = user.username || user.email
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div>
      <h2 className="text-sm font-bold mb-3">Profile</h2>
      <div className="glass-card rounded-xl p-4 md:p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold shrink-0">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg">
              {user.username || 'User'}
            </p>

            <div className="flex items-center gap-1.5 mt-1 text-(--muted-foreground) justify-center sm:justify-start">
              <LuMail size={14} />
              <span className="text-sm">{user.email}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-(--muted-foreground) justify-center sm:justify-start">
              <LuUser size={14} />
              <span className="text-sm capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
