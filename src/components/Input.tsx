import { useState, useRef, useEffect } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
}

const Input = (props: Props) => {
  const { label, type, value: controlledValue, defaultValue = '', ...rest } = props

  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(String(defaultValue))
  const inputValue = isControlled ? String(controlledValue) : internalValue

  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const shouldFloat = inputValue.length > 0 || focused
  const isPassword = type === 'password'

  const inputRef = useRef<HTMLInputElement>(null)

  // Sync internal state when controlled value changes
  useEffect(() => {
    if (isControlled) {
      setInternalValue(String(controlledValue))
    }
  }, [controlledValue, isControlled])

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        {...rest}
        type={isPassword && showPassword ? 'text' : type}
        className={`peer input-base w-full ${isPassword ? 'pr-10' : ''}`}
        data-float={shouldFloat || undefined}
        value={inputValue}
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
          if (!isControlled) {
            setInternalValue(e.target.value)
          }
        }}
      />
      <label
        className="absolute left-3 top-2.5 px-0.5 text-sm text-(--muted-foreground) bg-(--background) pointer-events-none transition-all
          peer-focus:-top-3 peer-focus:left-2 peer-focus:text-(--foreground) peer-focus:text-xs
          peer-data-float:-top-3 peer-data-float:left-2 peer-data-float:text-(--foreground) peer-data-float:text-xs"
      >
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-(--secondary) transition-colors"
          onClick={() => setShowPassword((v) => !v)}
          tabIndex={-1}
        >
          {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
        </button>
      )}
    </div>
  )
}

export default Input
