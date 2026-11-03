import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Menu, Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { pages, sections } from '@/data/fixtures'
import { NOW, breaking } from '@/lib/news'

const edition = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(NOW)

export function BreakingTicker() {
  const items = breaking()
  if (!items.length) return null
  const loop = [...items, ...items]
  return (
    <div className="bg-breaking text-breaking-foreground">
      <div className="mx-auto flex max-w-content items-stretch px-4 sm:px-6">
        <span className="kicker flex shrink-0 items-center gap-2 border-r border-white/30 py-2 pr-4">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/80 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-white" />
          </span>
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-ticker flex w-max gap-12 py-2 pl-4">
            {loop.map((a, i) => (
              <Link
                key={`${a.id}-${i}`}
                to="/news/$slug"
                params={{ slug: a.slug }}
                className="font-ui text-sm font-semibold whitespace-nowrap hover:underline"
                aria-hidden={i >= items.length}
                tabIndex={i >= items.length ? -1 : undefined}
              >
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchBox({ onDone }: { onDone?: () => void }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        void navigate({ to: '/search', search: { q } })
        onDone?.()
      }}
      className="flex items-center gap-2 border-b border-foreground"
    >
      <Search className="size-4 text-muted-foreground" aria-hidden />
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search The Meridian"
        aria-label="Search articles"
        className="font-ui w-full bg-transparent py-2 text-sm outline-none"
      />
    </form>
  )
}

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-background">
      <BreakingTicker />
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="font-ui flex items-center justify-between border-b py-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">{edition}</span>
          <span className="sm:hidden">
            {edition.split(' ').slice(1).join(' ')}
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">International edition</span>
            <Link
              to="/admin"
              className="font-semibold text-foreground hover:underline"
            >
              Newsroom
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-between py-5 md:py-7">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open sections menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">
                  The Meridian
                </SheetTitle>
                <SheetDescription>Browse every section</SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <SearchBox onDone={() => setMenuOpen(false)} />
              </div>
              <nav className="flex flex-col px-4 pt-2">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="font-ui border-b py-3 text-sm font-semibold"
                >
                  Home
                </Link>
                {sections.map((s) => (
                  <Link
                    key={s.slug}
                    to="/section/$section"
                    params={{ section: s.slug }}
                    onClick={() => setMenuOpen(false)}
                    className="font-ui border-b py-3 text-sm font-semibold"
                    activeProps={{ className: 'text-breaking' }}
                  >
                    {s.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden w-40 md:block" />

          <Link to="/" className="text-center" aria-label="The Meridian home">
            <span className="font-display block text-4xl leading-none font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              The Meridian
            </span>
            <span className="kicker mt-2 hidden text-muted-foreground md:block">
              Independent journalism since 1987
            </span>
          </Link>

          <div className="flex w-40 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X /> : <Search />}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="animate-rise mx-auto max-w-xl pb-4">
            <SearchBox onDone={() => setSearchOpen(false)} />
          </div>
        )}

        <nav
          aria-label="Sections"
          className="rule-double hidden border-b md:block"
        >
          <ul className="font-ui flex items-center justify-center gap-1 py-1 text-sm font-semibold">
            <li>
              <Link
                to="/"
                className="block px-3 py-2 hover:text-breaking"
                activeOptions={{ exact: true }}
                activeProps={{ className: 'text-breaking' }}
              >
                Home
              </Link>
            </li>
            {sections.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/section/$section"
                  params={{ section: s.slug }}
                  className="block px-3 py-2 transition-colors hover:text-breaking motion-reduce:transition-none"
                  activeProps={{ className: 'text-breaking' }}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="rule-double md:hidden" />
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-extrabold">The Meridian</p>
            <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">
              Independent, reader-funded reporting from correspondents in more
              than forty countries.
            </p>
          </div>
          <div>
            <p className="kicker mb-3 text-primary-foreground/60">News</p>
            <ul className="font-ui space-y-2 text-sm">
              {sections.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/section/$section"
                    params={{ section: s.slug }}
                    className="hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker mb-3 text-primary-foreground/60">More</p>
            <ul className="font-ui space-y-2 text-sm">
              {sections.slice(5).map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/section/$section"
                    params={{ section: s.slug }}
                    className="hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker mb-3 text-primary-foreground/60">
              The Meridian
            </p>
            <ul className="font-ui space-y-2 text-sm">
              {pages
                .filter((p) => p.inFooter && p.status === 'published')
                .map((p) => (
                  <li key={p.id}>{p.title}</li>
                ))}
            </ul>
          </div>
        </div>
        <div className="font-ui mt-12 flex flex-col justify-between gap-2 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/60 sm:flex-row">
          <span>© {NOW.getUTCFullYear()} The Meridian. All rights reserved.</span>
          <span>All stories on this preview are illustrative sample content.</span>
        </div>
      </div>
    </footer>
  )
}
