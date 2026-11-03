import { Link } from '@tanstack/react-router'

import type { Article } from '@/data/fixtures'
import { cn } from '@/lib/utils'
import { getAuthor, imageUrl, sectionName, timeAgo } from '@/lib/news'

export function Kicker({ article }: { article: Article }) {
  if (article.live)
    return (
      <span className="kicker inline-flex items-center gap-1.5 text-breaking">
        <span className="size-1.5 rounded-full bg-breaking" /> Live
      </span>
    )
  return (
    <span
      className={cn(
        'kicker',
        article.breaking ? 'text-breaking' : 'text-muted-foreground',
      )}
    >
      {article.breaking ? 'Breaking · ' : ''}
      {sectionName(article.section)}
    </span>
  )
}

export function Byline({
  article,
  className,
}: {
  article: Article
  className?: string
}) {
  return (
    <p className={cn('font-ui text-xs text-muted-foreground', className)}>
      <span className="font-semibold text-foreground">
        {getAuthor(article.authorId).name}
      </span>
      <span aria-hidden> · </span>
      <time dateTime={article.publishedAt}>{timeAgo(article.publishedAt)}</time>
    </p>
  )
}

export function StoryImage({
  article,
  width,
  ratio = 'aspect-[16/10]',
  className,
  eager,
}: {
  article: Article
  width: number
  ratio?: string
  className?: string
  eager?: boolean
}) {
  return (
    <div className={cn('overflow-hidden bg-muted', ratio, className)}>
      <img
        src={imageUrl(article.image, width)}
        srcSet={`${imageUrl(article.image, Math.round(width / 2))} ${Math.round(width / 2)}w, ${imageUrl(article.image, width)} ${width}w`}
        sizes={`(max-width: 768px) 100vw, ${width}px`}
        alt={article.imageCaption}
        loading={eager ? 'eager' : 'lazy'}
        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
      />
    </div>
  )
}

type CardProps = {
  article: Article
  className?: string
  style?: React.CSSProperties
}

export function StoryCard({ article, className, style }: CardProps) {
  return (
    <Link
      to="/news/$slug"
      params={{ slug: article.slug }}
      className={cn('group block', className)}
      style={style}
    >
      <StoryImage article={article} width={640} />
      <div className="mt-3 space-y-1.5">
        <Kicker article={article} />
        <h3 className="font-display text-xl leading-snug font-bold">
          <span className="headline-link">{article.title}</span>
        </h3>
        <p className="line-clamp-2 text-[0.95rem] text-muted-foreground">
          {article.dek}
        </p>
        <Byline article={article} />
      </div>
    </Link>
  )
}

export function StoryRow({ article, className }: CardProps) {
  return (
    <Link
      to="/news/$slug"
      params={{ slug: article.slug }}
      className={cn('group grid grid-cols-[1fr_7rem] gap-4', className)}
    >
      <div className="space-y-1">
        <Kicker article={article} />
        <h3 className="font-display text-lg leading-snug font-bold">
          <span className="headline-link">{article.title}</span>
        </h3>
        <Byline article={article} />
      </div>
      <StoryImage article={article} width={240} ratio="aspect-square" />
    </Link>
  )
}

export function HeadlineOnly({ article, className }: CardProps) {
  return (
    <Link
      to="/news/$slug"
      params={{ slug: article.slug }}
      className={cn('group block space-y-1', className)}
    >
      <Kicker article={article} />
      <h3 className="font-display text-lg leading-snug font-semibold">
        <span className="headline-link">{article.title}</span>
      </h3>
    </Link>
  )
}

export function SectionHeading({
  children,
  action,
}: {
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex items-end justify-between border-t-2 border-foreground pt-2">
      <h2 className="font-ui text-sm font-extrabold tracking-[0.14em] uppercase">
        {children}
      </h2>
      {action}
    </div>
  )
}
