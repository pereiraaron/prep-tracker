import { LuClipboardCheck } from 'react-icons/lu'

interface LogoProps {
  size?: string
}

const Logo = ({ size = '28px' }: LogoProps) => {
  return <LuClipboardCheck style={{ width: size, height: size }} />
}

export default Logo
