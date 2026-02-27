import { LuSun, LuMoon } from 'react-icons/lu'
import { useColorMode } from '@hooks/useColorMode'

const AppearanceSection = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <div>
      <h2 className="text-sm font-bold mb-3">Appearance</h2>
      <div className="glass-card rounded-xl p-4 md:p-5">
        {/* Color Mode */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Color Mode</p>
            <p className="text-xs text-(--muted-foreground)">
              {colorMode === 'light' ? 'Light' : 'Dark'} mode is active
            </p>
          </div>
          <div className="flex bg-(--secondary) rounded-full p-1 gap-1">
            <button
              aria-label="Light mode"
              className={`p-1.5 rounded-full transition-colors ${
                colorMode === 'light'
                  ? 'bg-yellow-500 text-white'
                  : 'hover:bg-(--muted) text-(--muted-foreground)'
              }`}
              onClick={colorMode === 'dark' ? toggleColorMode : undefined}
            >
              <LuSun size={16} />
            </button>
            <button
              aria-label="Dark mode"
              className={`p-1.5 rounded-full transition-colors ${
                colorMode === 'dark'
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-(--muted) text-(--muted-foreground)'
              }`}
              onClick={colorMode === 'light' ? toggleColorMode : undefined}
            >
              <LuMoon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppearanceSection
