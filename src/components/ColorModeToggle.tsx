import { LuSun, LuMoon } from 'react-icons/lu'
import { useColorMode } from '@hooks/useColorMode'

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <button
      aria-label="Toggle color mode"
      className="fixed bottom-4 md:bottom-6 left-4 lg:left-61 z-10 p-2.5 md:p-3 rounded-full border border-(--border) bg-(--card) hover:bg-(--secondary) transition-colors shadow-md"
      onClick={toggleColorMode}
    >
      {colorMode === 'light' ? <LuMoon /> : <LuSun />}
    </button>
  )
}

export default ColorModeToggle
