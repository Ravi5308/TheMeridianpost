import { useState } from 'react'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import {
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  Menu,
  Newspaper,
  Plus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Newsroom | The Meridian' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AdminLayout,
})

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/articles', label: 'Articles', icon: Newspaper, exact: false },
  { to: '/admin/pages', label: 'Pages', icon: FileText, exact: false },
  { to: '/admin/media', label: 'Media library', icon: Images, exact: false },
] as const

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="font-ui flex flex-col gap-1 text-sm">
      {nav.map(({ to, label, icon: Icon, exact }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact }}
          className="flex items-center gap-3 rounded-sm px-3 py-2 text-sidebar-foreground/70 transition-colors hover:bg-white/5 hover:text-sidebar-foreground motion-reduce:transition-none"
          activeProps={{
            className: 'bg-white/10 !text-sidebar-foreground font-semibold',
          }}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 p-5">
      <Link to="/admin" onClick={onNavigate} className="block">
        <span className="font-display block text-2xl font-extrabold">
          The Meridian
        </span>
        <span className="kicker text-breaking">Newsroom CMS</span>
      </Link>
      <Button
        asChild
        className="justify-start rounded-sm bg-breaking text-breaking-foreground hover:bg-breaking/90"
      >
        <Link
          to="/admin/articles/$id"
          params={{ id: 'new' }}
          onClick={onNavigate}
        >
          <Plus /> New article
        </Link>
      </Button>
      <NavLinks onNavigate={onNavigate} />
      <div className="font-ui mt-auto space-y-4 text-xs">
        <Link
          to="/"
          className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          <ExternalLink className="size-3.5" /> View live site
        </Link>
        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/15 font-bold">
            GW
          </span>
          <div>
            <p className="font-semibold">Grace Whitfield</p>
            <p className="text-sidebar-foreground/60">Editor-in-chief</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="font-ui min-h-screen bg-muted/50 lg:grid lg:grid-cols-[15rem_1fr]"
    >
      <aside className="sticky top-0 hidden h-screen bg-sidebar text-sidebar-foreground lg:block">
        <SidebarBody />
      </aside>

      <div className="min-w-0">
        <div className="flex items-center justify-between border-b bg-sidebar px-4 py-3 text-sidebar-foreground lg:hidden">
          <span className="font-display text-xl font-extrabold">
            The Meridian <span className="kicker text-breaking">CMS</span>
          </span>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open newsroom menu"
                className="hover:bg-white/10 hover:text-sidebar-foreground"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-none bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Newsroom menu</SheetTitle>
                <SheetDescription>Navigate the CMS</SheetDescription>
              </SheetHeader>
              <SidebarBody onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
