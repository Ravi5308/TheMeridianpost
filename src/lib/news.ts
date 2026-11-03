import {
  articles,
  authors,
  sections,
  type Article,
  type ArticleStatus,
} from '@/data/fixtures'

// Read helpers over the sample data. These are the seam where Netlify
// Database queries will plug in (see PLAN.md, milestone 2).

export function imageUrl(file: string, width: number, height?: number) {
  // Uploads in the newsroom preview are local object URLs until Blobs lands.
  if (file.startsWith('blob:')) return file
  const params = new URLSearchParams({
    url: `/img/${file}`,
    w: String(width),
    fm: 'webp',
    q: '75',
  })
  if (height) {
    params.set('h', String(height))
    params.set('fit', 'cover')
  }
  return `/.netlify/images?${params.toString()}`
}

export const published = () =>
  articles
    .filter((a) => a.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const getArticle = (slug: string) =>
  articles.find((a) => a.slug === slug && a.status === 'published')

export const getSection = (slug: string) =>
  sections.find((s) => s.slug === slug)

export const getAuthor = (id: string) => authors.find((a) => a.id === id)!

export const sectionName = (slug: string) => getSection(slug)?.name ?? slug

export const bySection = (slug: string) =>
  published().filter((a) => a.section === slug)

export const breaking = () => published().filter((a) => a.breaking)

export const mostRead = (n = 5) =>
  [...published()].sort((a, b) => b.views - a.views).slice(0, n)

export const related = (article: Article, n = 3) =>
  published()
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.section === article.section ||
          a.tags.some((t) => article.tags.includes(t))),
    )
    .slice(0, n)

export const search = (q: string) => {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  return published().filter((a) =>
    [a.title, a.dek, ...a.tags].some((s) => s.toLowerCase().includes(needle)),
  )
}

export const readingMinutes = (article: Article) =>
  Math.max(
    2,
    Math.round(
      article.body.reduce((n, b) => n + b.text.split(/\s+/).length, 0) / 220,
    ) + 3,
  )

// The sample data is pinned to this moment so relative times stay stable.
export const NOW = new Date('2026-11-02T10:00:00Z')

export function timeAgo(iso: string) {
  const mins = Math.round((NOW.getTime() - new Date(iso).getTime()) / 60000)
  if (mins < 0) return formatDate(iso)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return formatDate(iso)
}

export function formatDate(iso: string, withTime = false) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'UTC',
  }).format(new Date(iso))
}

export const statusLabel: Record<ArticleStatus, string> = {
  published: 'Published',
  scheduled: 'Scheduled',
  draft: 'Draft',
  review: 'In review',
}
