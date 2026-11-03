import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarClock, Eye, FileText, Plus } from 'lucide-react'

import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { useCms } from '@/lib/cms-store'
import {
  NOW,
  formatDate,
  getAuthor,
  imageUrl,
  sectionName,
  timeAgo,
} from '@/lib/news'

export const Route = createFileRoute('/admin/')({
  component: Dashboard,
})

const compact = new Intl.NumberFormat('en', { notation: 'compact' })

function Dashboard() {
  const { articles, media } = useCms()
  const live = articles.filter((a) => a.status === 'published')
  const scheduled = articles
    .filter((a) => a.status === 'scheduled')
    .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))
  const review = articles.filter((a) => a.status === 'review')
  const drafts = articles.filter((a) => a.status === 'draft')
  const last24 = live.filter(
    (a) => NOW.getTime() - new Date(a.publishedAt).getTime() < 864e5,
  )
  const views = live.reduce((n, a) => n + a.views, 0)
  const top = [...live].sort((a, b) => b.views - a.views).slice(0, 5)
  const maxViews = top[0]?.views ?? 1
  const recent = [...articles]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6)

  const stats = [
    { label: 'Published (24h)', value: last24.length, sub: `${live.length} live in total` },
    { label: 'Scheduled', value: scheduled.length, sub: scheduled[0] ? `Next ${formatDate(scheduled[0].publishedAt, true)}` : 'Queue empty' },
    { label: 'Awaiting review', value: review.length, sub: `${drafts.length} drafts in progress` },
    { label: 'Total page views', value: compact.format(views), sub: `${media.length} assets in library` },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker text-muted-foreground">
            {new Intl.DateTimeFormat('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              timeZone: 'UTC',
            }).format(NOW)}
          </p>
          <h1 className="font-display mt-1 text-3xl font-extrabold">
            Good morning, Grace
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/media">Upload media</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/articles/$id" params={{ id: 'new' }}>
              <Plus /> New article
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-sm border bg-background p-5">
            <p className="text-xs font-semibold text-muted-foreground">
              {s.label}
            </p>
            <p className="font-display mt-2 text-4xl font-extrabold tabular-nums">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <Panel
          title="Publishing queue"
          icon={<CalendarClock className="size-4" />}
          action={
            <Link
              to="/admin/articles"
              search={{ status: 'scheduled' }}
              className="text-xs font-semibold hover:underline"
            >
              View all
            </Link>
          }
        >
          {scheduled.length === 0 && review.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nothing queued. Scheduled stories will appear here.
            </p>
          ) : (
            <ul className="divide-y">
              {[...review, ...scheduled].map((a) => (
                <li key={a.id}>
                  <Link
                    to="/admin/articles/$id"
                    params={{ id: a.id }}
                    className="flex items-center gap-4 py-3 hover:bg-muted/60"
                  >
                    <img
                      src={imageUrl(a.image, 120, 80)}
                      alt=""
                      className="h-12 w-18 shrink-0 rounded-sm object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sectionName(a.section)} ·{' '}
                        {getAuthor(a.authorId).name}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={a.status} />
                      <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                        {formatDate(a.publishedAt, true)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Top stories by views" icon={<Eye className="size-4" />}>
          <ol className="space-y-4">
            {top.map((a) => (
              <li key={a.id}>
                <div className="flex justify-between gap-4 text-sm">
                  <Link
                    to="/news/$slug"
                    params={{ slug: a.slug }}
                    className="truncate font-medium hover:underline"
                  >
                    {a.title}
                  </Link>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {compact.format(a.views)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${(a.views / maxViews) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel
        title="Recently edited"
        icon={<FileText className="size-4" />}
        action={
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          >
            All articles <ArrowRight className="size-3" />
          </Link>
        }
      >
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {recent.map((a) => (
            <li key={a.id} className="border-b last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
              <Link
                to="/admin/articles/$id"
                params={{ id: a.id }}
                className="flex items-center justify-between gap-3 py-3 text-sm hover:underline"
              >
                <span className="truncate">{a.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {timeAgo(a.updatedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

function Panel({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-sm border bg-background">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          {icon}
          {title}
        </h2>
        {action}
      </div>
      <div className="px-5 py-3">{children}</div>
    </section>
  )
}
