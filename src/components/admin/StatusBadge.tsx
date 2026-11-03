import type { ArticleStatus } from '@/data/fixtures'
import { cn } from '@/lib/utils'
import { statusLabel } from '@/lib/news'

const styles: Record<ArticleStatus, string> = {
  published: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  scheduled: 'bg-sky-50 text-sky-800 ring-sky-600/20',
  review: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  draft: 'bg-muted text-muted-foreground ring-border',
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-[0.7rem] font-semibold ring-1 ring-inset',
        styles[status],
      )}
    >
      {statusLabel[status]}
    </span>
  )
}
