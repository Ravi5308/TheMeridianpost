import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome'

export const Route = createFileRoute('/_site')({
  component: SiteLayout,
})

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
