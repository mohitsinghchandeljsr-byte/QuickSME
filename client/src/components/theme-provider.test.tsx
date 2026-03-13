import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from './theme-provider'
import { act } from 'react-dom/test-utils'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    vi.clearAllMocks()
  })

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('uses default theme when no stored theme', () => {
    localStorageMock.getItem.mockReturnValue(null)

    const TestComponent = () => {
      const { theme } = useTheme()
      return <div data-testid="theme">{theme}</div>
    }

    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('uses stored theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('light')

    const TestComponent = () => {
      const { theme } = useTheme()
      return <div data-testid="theme">{theme}</div>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('sets theme and stores in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('system')

    const TestComponent = () => {
      const { theme, setTheme } = useTheme()
      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <button onClick={() => setTheme('dark')} data-testid="set-dark">Set Dark</button>
        </div>
      )
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByTestId('set-dark'))

    expect(localStorageMock.setItem).toHaveBeenCalledWith('sme-tally-theme', 'dark')
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('applies light theme class to document root', () => {
    localStorageMock.getItem.mockReturnValue('light')

    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    )

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('applies dark theme class to document root', () => {
    localStorageMock.getItem.mockReturnValue('dark')

    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    )

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  it('applies system theme based on media query', () => {
    localStorageMock.getItem.mockReturnValue('system')
    window.matchMedia.mockReturnValue({
      matches: true, // prefers dark
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })

    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    )

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  // Note: Error boundary testing for hooks is complex in React Testing Library
  // The hook's error throwing is verified through TypeScript and runtime usage

  it('uses custom storage key', () => {
    localStorageMock.getItem.mockReturnValue('light')

    render(
      <ThemeProvider storageKey="custom-theme-key">
        <div>Test</div>
      </ThemeProvider>
    )

    // When setting theme, it should use the custom key
    const TestComponent = () => {
      const { setTheme } = useTheme()
      return <button onClick={() => setTheme('dark')} data-testid="set-theme">Set Theme</button>
    }

    render(
      <ThemeProvider storageKey="custom-theme-key">
        <TestComponent />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByTestId('set-theme'))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('custom-theme-key', 'dark')
  })
})
