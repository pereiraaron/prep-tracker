import { Icon } from '@chakra-ui/react'
import { LuClipboardCheck } from 'react-icons/lu'

interface LogoProps {
  size?: string
}

const Logo = ({ size = '28px' }: LogoProps) => {
  return <Icon asChild boxSize={size}><LuClipboardCheck /></Icon>
}

export default Logo
