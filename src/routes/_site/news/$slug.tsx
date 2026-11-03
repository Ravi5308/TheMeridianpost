import { useEffect, useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Check, Link2, Mail, Share2 } from 'lucide-react'

import {
  SectionHeading,
  StoryCard,
  StoryImage,
} from '@/components/site/StoryCards'
import { Button } from '@/components/ui/button'
import {
  formatDate,
  getArticle,
  getAuthor,
  mostRead,
  readingMinutes,
  related,
  sectionName,
  timeAgo,
} from '@/lib/news'

export const Route = createFileRoute('/_site/news/$slug')({
  loader: ({ params }) => {
    const article = getArticle(params.slug)
    if (!article) throw notFound()
    return { article }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.article.title} | The Meridian` },
          { name: 'description', content: loaderData.article.dek },
          { property: 'og:title', content: loaderData.article.title },
          { property: 'og:description', content: loaderData.article.dek },
          { property: 'og:type', content: 'article' },
        ]
      : [],
  }),
  component: ArticlePage,
})

function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-40 h-1" aria-hidden>
      <div
        className="h-full origin-left bg-breaking"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

function ShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        aria-label="Share this article"
        onClick={() => {
          if (navigator.share)
            void navigator
              .share({ title: document.title, url: window.location.href })
              .catch(() => {})
        }}
      >
        <Share2 />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        aria-label="Share by email"
        asChild
      >
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        >
          <Mail />
        </a>
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        aria-label="Copy link"
        onClick={() => {
          void navigator.clipboard?.writeText(window.location.href)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
      >
        {copied ? <Check /> : <Link2 />}
      </Button>
    </div>
  )
}

function ArticlePage() {
  const { article } = Route.useLoaderData()
  const author = getAuthor(article.authorId)
  const more = related(article)
  const updated = article.updatedAt !== article.publishedAt

  return (
    <article className="mx-auto max-w-content px-4 pt-8 sm:px-6">
      <ReadingProgress />
      <header className="mx-auto max-w-4xl text-center">
        <Link
          to="/section/$section"
          params={{ section: article.section }}
          className={`kicker hover:underline ${article.breaking ? 'text-breaking' : 'text-muted-foreground'}`}
        >
          {article.live
            ? '● Live'
            : article.breaking
              ? 'Breaking'
              : sectionName(article.section)}
          {article.live || article.breaking
            ? ` · ${sectionName(article.section)}`
            : ''}
        </Link>
        <h1 className="font-display animate-rise mt-4 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-xl text-muted-foreground">
          {article.dek}
        </p>
      </header>

      <figure className="mx-auto mt-8 max-w-5xl">
        <StoryImage
          article={article}
          width={1400}
          ratio="aspect-[16/9]"
          eager
        />
        <figcaption className="font-ui mt-2 text-xs text-muted-foreground">
          {article.imageCaption}
        </figcaption>
      </figure>

      <div className="mx-auto mt-10 grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="mx-auto w-full max-w-reading">
          <div className="flex flex-wrap items-center justify-between gap-4 border-y py-4">
            <div className="flex items-center gap-3">
              <span className="font-ui flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {author.initials}
              </span>
              <div className="font-ui text-sm">
                <p className="font-semibold">{author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {author.role} ·{' '}
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt, true)}
                  </time>
                  {updated && <> · Updated {timeAgo(article.updatedAt)}</>} ·{' '}
                  {readingMinutes(article)} min read
                </p>
              </div>
            </div>
            <ShareBar
              title={article.title}
              url={`https://custom-news-portal.netlify.app/news/${article.slug}`}
            />
          </div>

          <div className="prose-news mt-8">
            {article.body.map((block, i) => {
              if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>
              if (block.type === 'quote')
                return (
                  <blockquote key={i}>
                    “{block.text}”
                    {block.cite && (
                      <footer className="font-ui mt-2 text-sm font-normal not-italic text-muted-foreground">
                        — {block.cite}
                      </footer>
                    )}
                  </blockquote>
                )
              return <p key={i}>{block.text}</p>
            })}
          </div>

          <div className="font-ui mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <Link
                key={t}
                to="/search"
                search={{ q: t }}
                className="border px-3 py-1 text-xs font-semibold hover:border-foreground"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <SectionHeading>Most read</SectionHeading>
            <ol className="space-y-4">
              {mostRead(5)
                .filter((a) => a.id !== article.id)
                .slice(0, 4)
                .map((a, i) => (
                  <li key={a.id} className="flex gap-3">
                    <span className="font-display text-2xl leading-none font-extrabold text-breaking">
                      {i + 1}
                    </span>
                    <Link
                      to="/news/$slug"
                      params={{ slug: a.slug }}
                      className="font-display text-base leading-snug font-semibold hover:underline"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
            </ol>
          </div>
        </aside>
      </div>

      {more.length > 0 && (
        <section className="mt-16">
          <SectionHeading>Related coverage</SectionHeading>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((a) => (
              <StoryCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
