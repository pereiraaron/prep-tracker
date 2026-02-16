import { Progress, type ProgressRootProps } from '@chakra-ui/react'

interface ProgressBarProps extends Omit<ProgressRootProps, 'colorPalette'> {
  value: number
  color: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const ProgressBar = ({ value, color, size = 'sm', ...props }: ProgressBarProps) => (
  <Progress.Root
    value={value}
    size={size}
    colorPalette={color}
    borderRadius="full"
    {...props}
  >
    <Progress.Track borderRadius="full" bg={`${color}.500/10`}>
      <Progress.Range borderRadius="full" />
    </Progress.Track>
  </Progress.Root>
)

export default ProgressBar
