import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { pages as seedPages, type StaticPage } from '@/data/fixtures'
import { formatDate } from '@/lib/news'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/pages')({
  component: PagesScreen,
})

function PagesScreen() {
  const [pages, setPages] = useState<StaticPage[]>(seedPages)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')

  const patch = (id: string, change: Partial<StaticPage>) =>
    setPages((ps) => ps.map((p) => (p.id === id ? { ...p, ...change } : p)))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Pages</h1>
          <p className="text-sm text-muted-foreground">
            Standalone pages such as About, Contact and policies.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus /> New page
        </Button>
      </div>

      <div className="rounded-sm border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Title</TableHead>
              <TableHead className="hidden sm:table-cell">URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead>In footer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="pl-4 font-semibold">{p.title}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  /{p.slug}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => {
                      const status =
                        p.status === 'published' ? 'draft' : 'published'
                      patch(p.id, { status })
                      toast.success(
                        status === 'published'
                          ? `“${p.title}” published`
                          : `“${p.title}” moved to drafts`,
                      )
                    }}
                    className={cn(
                      'rounded-sm px-2 py-0.5 text-[0.7rem] font-semibold ring-1 ring-inset',
                      p.status === 'published'
                        ? 'bg-emerald-50 text-emerald-800 ring-emerald-600/20'
                        : 'bg-muted text-muted-foreground ring-border',
                    )}
                    aria-label={`${p.status === 'published' ? 'Unpublish' : 'Publish'} ${p.title}`}
                  >
                    {p.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {formatDate(p.updatedAt)}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={p.inFooter}
                    onCheckedChange={(v) => patch(p.id, { inFooter: v })}
                    aria-label={`Show ${p.title} in footer`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New page</DialogTitle>
            <DialogDescription>
              Pages start as drafts. Publish when they’re ready.
            </DialogDescription>
          </DialogHeader>
          <form
            id="new-page"
            onSubmit={(e) => {
              e.preventDefault()
              if (!title.trim()) return
              const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
              setPages((ps) => [
                ...ps,
                {
                  id: `p${Date.now()}`,
                  slug,
                  title: title.trim(),
                  status: 'draft',
                  updatedAt: new Date().toISOString(),
                  inFooter: false,
                },
              ])
              toast.success('Page created')
              setTitle('')
              setOpen(false)
            }}
            className="space-y-1.5"
          >
            <Label htmlFor="page-title">Title</Label>
            <Input
              id="page-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advertise with us"
              autoFocus
            />
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="new-page" disabled={!title.trim()}>
              Create page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
