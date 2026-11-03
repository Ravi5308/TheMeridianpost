import { useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { sections, type Article } from '@/data/fixtures'
import { cms, useCms } from '@/lib/cms-store'
import { formatDate, getAuthor, imageUrl, sectionName } from '@/lib/news'
import { cn } from '@/lib/utils'

const statuses = ['all', 'published', 'scheduled', 'review', 'draft'] as const

export const Route = createFileRoute('/admin/articles/')({
  validateSearch: z.object({
    status: z.enum(statuses).default('all').catch('all'),
  }),
  component: ArticlesList,
})

const tabLabel: Record<(typeof statuses)[number], string> = {
  all: 'All',
  published: 'Published',
  scheduled: 'Scheduled',
  review: 'In review',
  draft: 'Drafts',
}

function ArticlesList() {
  const { status } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { articles } = useCms()
  const [q, setQ] = useState('')
  const [section, setSection] = useState('all')
  const [pendingDelete, setPendingDelete] = useState<Article | null>(null)

  const rows = useMemo(
    () =>
      articles
        .filter((a) => status === 'all' || a.status === status)
        .filter((a) => section === 'all' || a.section === section)
        .filter((a) => a.title.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [articles, status, section, q],
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: articles.length }
    for (const a of articles) c[a.status] = (c[a.status] ?? 0) + 1
    return c
  }, [articles])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Articles</h1>
          <p className="text-sm text-muted-foreground">
            Write, schedule and manage every story on the site.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/articles/$id" params={{ id: 'new' }}>
            <Plus /> New article
          </Link>
        </Button>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b">
        {statuses.map((s) => (
          <Link
            key={s}
            to="/admin/articles"
            search={{ status: s }}
            className={cn(
              '-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold whitespace-nowrap',
              s === status
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {tabLabel[s]}
            <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums">
              {counts[s] ?? 0}
            </span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by headline"
            aria-label="Search by headline"
            className="h-9 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger className="w-full bg-background sm:w-48" aria-label="Filter by section">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sections</SelectItem>
            {sections.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-sm border bg-background">
        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-xl font-bold">No articles here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different filter, or start a new story.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Headline</TableHead>
                <TableHead className="hidden md:table-cell">Section</TableHead>
                <TableHead className="hidden lg:table-cell">Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Publish date</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="pl-4">
                    <Link
                      to="/admin/articles/$id"
                      params={{ id: a.id }}
                      className="flex max-w-md items-center gap-3"
                    >
                      <img
                        src={imageUrl(a.image, 96, 64)}
                        alt=""
                        className="h-10 w-14 shrink-0 rounded-sm object-cover"
                      />
                      <span className="line-clamp-2 font-semibold whitespace-normal hover:underline">
                        {a.breaking && (
                          <span className="mr-1.5 text-breaking">●</span>
                        )}
                        {a.title}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {sectionName(a.section)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {getAuthor(a.authorId).name}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground tabular-nums sm:table-cell">
                    {formatDate(a.publishedAt, true)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${a.title}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() =>
                            void navigate({
                              to: '/admin/articles/$id',
                              params: { id: a.id },
                            })
                          }
                        >
                          <Pencil /> Edit
                        </DropdownMenuItem>
                        {a.status === 'published' && (
                          <DropdownMenuItem asChild>
                            <Link to="/news/$slug" params={{ slug: a.slug }}>
                              <Eye /> View on site
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setPendingDelete(a)}
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this article?</DialogTitle>
            <DialogDescription>
              “{pendingDelete?.title}” will be removed from the newsroom and the
              public site.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDelete) cms.deleteArticle(pendingDelete.id)
                toast.success('Article deleted')
                setPendingDelete(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
