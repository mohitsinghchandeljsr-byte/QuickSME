import { cn } from './utils'

describe('cn utility function', () => {
  it('merges Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'bg-red-500')
    expect(result).toBe('px-2 py-1 bg-red-500')
  })

  it('handles conflicting classes by keeping the last one', () => {
    const result = cn('px-2 py-1 bg-red-500', 'bg-blue-500')
    expect(result).toBe('px-2 py-1 bg-blue-500')
  })

  it('handles undefined and null values', () => {
    const result = cn('px-2', undefined, null, 'py-1')
    expect(result).toBe('px-2 py-1')
  })

  it('handles empty strings', () => {
    const result = cn('px-2', '', 'py-1')
    expect(result).toBe('px-2 py-1')
  })

  it('handles falsy values', () => {
    const result = cn('px-2', false && 'hidden', 'py-1')
    expect(result).toBe('px-2 py-1')
  })

  it('handles complex class combinations', () => {
    const result = cn(
      'flex items-center justify-center',
      'px-4 py-2 rounded-md',
      'bg-blue-500 hover:bg-blue-600',
      'text-white font-medium'
    )
    expect(result).toBe('flex items-center justify-center px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium')
  })

  it('handles clsx-style conditional classes', () => {
    const isActive = true
    const isDisabled = false
    const result = cn(
      'btn',
      isActive && 'btn-active',
      isDisabled && 'btn-disabled'
    )
    expect(result).toBe('btn btn-active')
  })

  it('returns empty string for no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles single class argument', () => {
    const result = cn('single-class')
    expect(result).toBe('single-class')
  })

  it('handles array of classes', () => {
    const result = cn(['px-2', 'py-1'], 'bg-red-500')
    expect(result).toBe('px-2 py-1 bg-red-500')
  })
})
