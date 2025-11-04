import { render, screen } from '@testing-library/react'
import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
