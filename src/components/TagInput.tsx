import { useState, useRef } from 'react'
import { LuX } from 'react-icons/lu'

interface TagInputProps {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  max?: number
}

const TagInput = ({ label, value, onChange, placeholder = 'Type and press Enter', max = 20 }: TagInputProps) => {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (!trimmed || value.includes(trimmed) || value.length >= max) return
    onChange([...value, trimmed])
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
      setInput('')
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <div
        className="flex flex-wrap gap-1.5 p-2 border border-(--border) rounded-md min-h-10 items-center cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 text-xs font-medium cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(tag)
            }}
          >
            {tag}
            <span className="inline-flex">
              <LuX size={10} />
            </span>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-20 text-sm border-none outline-none bg-transparent text-inherit"
        />
      </div>
    </div>
  )
}

export default TagInput
