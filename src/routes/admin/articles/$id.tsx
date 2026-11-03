import { useMemo, useState } from 'react'
import {
  Link,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import {
  ArrowLeft,
  CalendarClock,
  Eye,
  Heading2,
  ImagePlus,
  Pilcrow,
  Quote,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'

import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  authors,
  sections,
  type Article,
  type ArticleBlock,
} from '@/data/fixtures'
import { cms, useCms } from '@/lib/cms-store'
import { NOW, formatDate, getArticle, imageUrl } from '@/lib/news'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/articles/$id')({
  component: Editor,
})

// The editor works on plain text: blank lines split paragraphs,
// "## " starts a subheading and "> " a pull quote.
function blocksToText(blocks: ArticleBlock[]) {
  return blocks
    .map((b) =>
      b.type === 'h2'
        ? `## ${b.text}`
        : b.type === 'quote'
          ? `> ${b.text}${b.cite ? ` — ${b.cite}` : ''}`
          : b.text,
    )
    .join('\n\n')
}

function textToBlocks(text: string): ArticleBlock[] {
  return text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): ArticleBlock => {
      if (chunk.startsWith('## ')) return { type: 'h2', text: chunk.slice(3) }
      if (chunk.startsWith('> ')) {
        const [text, cite] = chunk.slice(2).split(' — ')
        return { type: 'quote', text, cite }
      }
      return { type: 'p', text: chunk }
    })
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)

// datetime-local works in local time; the sample data is UTC.
const toLocalInput = (iso: string) => iso.slice(0, 16)
const fromLocalInput = (v: string) => `${v}:00Z`

const blank = (): Article => ({
  id: '',
  slug: '',
  title: '',
  dek: '',
  section: 'world',
  authorId: 'a5',
  image: '',
  imageCaption: '',
  status: 'draft',
  publishedAt: NOW.toISOString(),
  updatedAt: NOW.toISOString(),
  tags: [],
  views: 0,
  body: [],
})

function Editor() {
  const { id } = Route.useParams()
  const { articles } = useCms()
  const existing = articles.find((a) => a.id === id)
  if (id !== 'new' && !existing)
    return (
      <div className="py-24 text-center">
        <p className="font-display text-2xl font-bold">Article not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          It may have been deleted.{' '}
          <Link to="/admin/articles" className="underline">
            Back to all articles
          </Link>
        </p>
      </div>
    )
  // Remount the form when switching articles so local state resets.
  return <EditorForm key={id} initial={existing ?? blank()} />
}

function EditorForm({ initial }: { initial: Article }) {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(initial)
  const [body, setBody] = useState(blocksToText(initial.body))
  const [tags, setTags] = useState(initial.tags.join(', '))
  const [slugTouched, setSlugTouched] = useState(!!initial.slug)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isNew = !initial.id

  const update = <K extends keyof Article>(key: K, value: Article[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const isFuture = new Date(draft.publishedAt) > NOW
  const words = useMemo(
    () => body.split(/\s+/).filter(Boolean).length,
    [body],
  )

  function save(intent: 'draft' | 'review' | 'publish') {
    const next: Record<string, string> = {}
    if (!draft.title.trim()) next.title = 'A headline is required.'
    if (intent === 'publish') {
      if (!draft.dek.trim()) next.dek = 'Add a standfirst before publishing.'
      if (!draft.image) next.image = 'Choose a featured image.'
      if (words < 20) next.body = 'The story needs at least a few paragraphs.'
    }
    setErrors(next)
    if (Object.keys(next).length) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    const status =
      intent === 'publish'
        ? isFuture
          ? 'scheduled'
          : 'published'
        : intent === 'review'
          ? 'review'
          : 'draft'
    const saved: Article = {
      ...draft,
      id: draft.id || `n${Date.now()}`,
      slug: draft.slug || slugify(draft.title),
      status,
      body: textToBlocks(body),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString(),
    }
    cms.saveArticle(saved)
    setDraft(saved)
    toast.success(
      status === 'published'
        ? 'Published to the homepage'
        : status === 'scheduled'
          ? `Scheduled for ${formatDate(saved.publishedAt, true)}`
          : status === 'review'
            ? 'Sent to the desk for review'
            : 'Draft saved',
    )
    if (isNew)
      void navigate({
        to: '/admin/articles/$id',
        params: { id: saved.id },
        replace: true,
      })
  }

  function insert(prefix: string) {
    setBody((b) => `${b.trimEnd()}${b.trim() ? '\n\n' : ''}${prefix}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link to="/admin/articles" aria-label="Back to articles">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-extrabold">
              {isNew ? 'New article' : 'Edit article'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <StatusBadge status={draft.status} />
              {!isNew && <span>Last saved {formatDate(draft.updatedAt, true)}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {draft.status === 'published' && getArticle(draft.slug) && (
            <Button variant="ghost" asChild>
              <Link to="/news/$slug" params={{ slug: draft.slug }}>
                <Eye /> View live
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={() => save('draft')}>
            Save draft
          </Button>
          <Button variant="outline" onClick={() => save('review')}>
            Send to review
          </Button>
          <Button
            onClick={() => save('publish')}
            className={cn(!isFuture && 'bg-breaking hover:bg-breaking/90')}
          >
            {isFuture ? <CalendarClock /> : <Send />}
            {isFuture ? 'Schedule' : 'Publish now'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Tabs defaultValue="write" className="min-w-0">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <div className="space-y-5 rounded-sm border bg-background p-5 sm:p-8">
              <Field label="Headline" htmlFor="title" error={errors.title}>
                <Textarea
                  id="title"
                  rows={2}
                  value={draft.title}
                  onChange={(e) => {
                    update('title', e.target.value)
                    if (!slugTouched) update('slug', slugify(e.target.value))
                  }}
                  placeholder="Write a clear, specific headline"
                  aria-invalid={!!errors.title}
                  className="font-display resize-none border-none px-0 text-3xl font-extrabold shadow-none focus-visible:ring-0 md:text-4xl"
                />
              </Field>
              <Field
                label="Standfirst"
                htmlFor="dek"
                error={errors.dek}
                hint={`${draft.dek.length}/220`}
              >
                <Textarea
                  id="dek"
                  rows={2}
                  maxLength={220}
                  value={draft.dek}
                  onChange={(e) => update('dek', e.target.value)}
                  placeholder="One or two sentences that sell the story"
                  aria-invalid={!!errors.dek}
                  className="font-sans resize-none text-lg"
                />
              </Field>
              <Field
                label="Story"
                htmlFor="body"
                error={errors.body}
                hint={`${words} words · ~${Math.max(1, Math.round(words / 220))} min read`}
              >
                <div className="rounded-md border border-input focus-within:ring-[3px] focus-within:ring-ring/50">
                  <div className="flex gap-1 border-b px-2 py-1.5">
                    <ToolbarButton label="Paragraph" onClick={() => insert('')}>
                      <Pilcrow />
                    </ToolbarButton>
                    <ToolbarButton label="Subheading" onClick={() => insert('## ')}>
                      <Heading2 />
                    </ToolbarButton>
                    <ToolbarButton label="Pull quote" onClick={() => insert('> ')}>
                      <Quote />
                    </ToolbarButton>
                    <span className="ml-auto self-center text-[0.7rem] text-muted-foreground">
                      Blank line = new paragraph · ## subheading · &gt; quote
                    </span>
                  </div>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={18}
                    aria-invalid={!!errors.body}
                    placeholder="Start writing…"
                    className="font-sans block w-full resize-y bg-transparent px-4 py-3 text-base leading-relaxed outline-none"
                  />
                </div>
              </Field>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <article className="rounded-sm border bg-background p-6 sm:p-10">
              <p className="kicker text-breaking">
                {draft.breaking ? 'Breaking · ' : ''}
                {sections.find((s) => s.slug === draft.section)?.name}
              </p>
              <h2 className="font-display mt-3 text-4xl leading-tight font-extrabold">
                {draft.title || 'Untitled story'}
              </h2>
              <p className="mt-3 text-xl text-muted-foreground">{draft.dek}</p>
              {draft.image && (
                <img
                  src={imageUrl(draft.image, 1000)}
                  alt={draft.imageCaption}
                  className="mt-6 aspect-video w-full object-cover"
                />
              )}
              <div className="prose-news mx-auto mt-8 max-w-reading">
                {textToBlocks(body).map((b, i) =>
                  b.type === 'h2' ? (
                    <h2 key={i}>{b.text}</h2>
                  ) : b.type === 'quote' ? (
                    <blockquote key={i}>“{b.text}”</blockquote>
                  ) : (
                    <p key={i}>{b.text}</p>
                  ),
                )}
              </div>
            </article>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 xl:pt-11">
          <SidePanel title="Publishing">
            <Field label="Publish date & time (UTC)" htmlFor="when">
              <Input
                id="when"
                type="datetime-local"
                value={toLocalInput(draft.publishedAt)}
                onChange={(e) =>
                  e.target.value &&
                  update('publishedAt', fromLocalInput(e.target.value))
                }
              />
            </Field>
            <p className="text-xs text-muted-foreground">
              {isFuture
                ? 'A future time schedules the story to go live automatically.'
                : 'Publishing now puts the story live immediately.'}
            </p>
            <Field label="Author" htmlFor="author">
              <Select
                value={draft.authorId}
                onValueChange={(v) => update('authorId', v)}
              >
                <SelectTrigger id="author" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </SidePanel>

          <SidePanel title="Placement">
            <Field label="Section" htmlFor="section">
              <Select
                value={draft.section}
                onValueChange={(v) => update('section', v)}
              >
                <SelectTrigger id="section" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Toggle
              id="breaking"
              label="Breaking news"
              hint="Adds the story to the red ticker"
              checked={!!draft.breaking}
              onChange={(v) => update('breaking', v)}
            />
            <Toggle
              id="featured"
              label="Feature on homepage"
              hint="Eligible for the lead slots"
              checked={!!draft.featured}
              onChange={(v) => update('featured', v)}
            />
            <Toggle
              id="live"
              label="Live coverage"
              checked={!!draft.live}
              onChange={(v) => update('live', v)}
            />
          </SidePanel>

          <SidePanel title="Featured image">
            {draft.image ? (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="group relative block w-full overflow-hidden rounded-sm"
              >
                <img
                  src={imageUrl(draft.image, 600, 338)}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none">
                  Change image
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className={cn(
                  'flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed text-sm text-muted-foreground hover:border-foreground hover:text-foreground',
                  errors.image && 'border-destructive text-destructive',
                )}
              >
                <ImagePlus className="size-6" />
                Choose from media library
              </button>
            )}
            {errors.image && (
              <p className="text-xs text-destructive">{errors.image}</p>
            )}
            <Field label="Caption" htmlFor="caption">
              <Input
                id="caption"
                value={draft.imageCaption}
                onChange={(e) => update('imageCaption', e.target.value)}
                placeholder="Describe the photo and credit it"
              />
            </Field>
          </SidePanel>

          <SidePanel title="Tags & URL">
            <Field label="Tags" htmlFor="tags" hint="Comma separated">
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Elections, Economy"
              />
            </Field>
            <Field label="URL slug" htmlFor="slug">
              <Input
                id="slug"
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  update('slug', slugify(e.target.value))
                }}
              />
            </Field>
            <div className="rounded-sm bg-muted p-3 text-xs">
              <p className="text-muted-foreground">Search preview</p>
              <p className="mt-1 truncate text-[0.95rem] text-sky-800">
                {draft.title || 'Headline'} | The Meridian
              </p>
              <p className="truncate text-emerald-800">
                custom-news-portal.netlify.app/news/{draft.slug || '…'}
              </p>
              <p className="mt-0.5 line-clamp-2 text-muted-foreground">
                {draft.dek || 'Your standfirst appears here.'}
              </p>
            </div>
          </SidePanel>
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(file, alt) => {
          setDraft((d) => ({
            ...d,
            image: file,
            imageCaption: d.imageCaption || alt,
          }))
          setErrors((e) => ({ ...e, image: '' }))
          setPickerOpen(false)
        }}
      />
    </div>
  )
}

function MediaPicker({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onPick: (file: string, alt: string) => void
}) {
  const { media } = useCms()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
          <DialogDescription>
            Choose a featured image. Upload new photos from the{' '}
            <Link to="/admin/media" className="underline">
              media library
            </Link>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
          {media.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onPick(m.file, m.alt)}
              className="group overflow-hidden rounded-sm border text-left focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <img
                src={imageUrl(m.file, 400, 250)}
                alt={m.alt}
                className="aspect-[8/5] w-full object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none"
              />
              <p className="truncate px-2 py-1.5 text-xs">{m.alt}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={htmlFor} className="text-xs font-semibold">
          {label}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function Toggle({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id} className="flex flex-col items-start gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {hint && (
          <span className="text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function SidePanel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 rounded-sm border bg-background p-4">
      <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
