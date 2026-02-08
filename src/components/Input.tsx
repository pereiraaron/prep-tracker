import { useState } from 'react'
import type { InputProps } from '@chakra-ui/react'
import {
  Box,
  Field,
  IconButton,
  Input as ChakraInput,
  defineStyle,
  useControllableState,
} from '@chakra-ui/react'
import { LuEye, LuEyeOff } from 'react-icons/lu'

interface Props extends InputProps {
  label: React.ReactNode
}

const floatingStyles = defineStyle({
  pos: 'absolute',
  bg: 'bg',
  px: '0.5',
  top: '2.5',
  insetStart: '3',
  fontWeight: 'normal',
  pointerEvents: 'none',
  transition: 'position',
  color: 'fg.muted',
  '&[data-float]': {
    top: '-3',
    insetStart: '2',
    color: 'fg',
  },
})

const Input = (props: Props) => {
  const { label, type, value, defaultValue = '', ...rest } = props

  const [inputState, setInputState] = useControllableState({
    defaultValue,
    value,
  })

  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const shouldFloat = String(inputState).length > 0 || focused
  const isPassword = type === 'password'

  return (
    <Field.Root>
      <Box pos="relative" w="full">
        <ChakraInput
          {...rest}
          type={isPassword && showPassword ? 'text' : type}
          pe={isPassword ? '10' : undefined}
          onFocus={(e) => {
            props.onFocus?.(e)
            setFocused(true)
          }}
          onBlur={(e) => {
            props.onBlur?.(e)
            setFocused(false)
          }}
          onChange={(e) => {
            props.onChange?.(e)
            setInputState(e.target.value)
          }}
          value={inputState}
          data-float={shouldFloat || undefined}
        />
        <Field.Label css={floatingStyles} data-float={shouldFloat || undefined}>
          {label}
        </Field.Label>
        {isPassword && (
          <IconButton
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            variant="ghost"
            size="sm"
            pos="absolute"
            top="50%"
            insetEnd="1"
            transform="translateY(-50%)"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? <LuEyeOff /> : <LuEye />}
          </IconButton>
        )}
      </Box>
    </Field.Root>
  )
}

export default Input
