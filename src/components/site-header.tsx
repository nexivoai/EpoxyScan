import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="flex h-18 items-center justify-between px-6 lg:px-8">
        <Logo />
        <ThemeToggle />
      </div>
    </header>
  )
}
