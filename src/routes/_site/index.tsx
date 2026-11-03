import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

import {
  Byline,
  HeadlineOnly,
  Kicker,
  SectionHeading,
  StoryCard,
  StoryImage,
  StoryRow,
} from '@/components/site/StoryCards'
import { Button } from '@/components/ui/button'
import { bySection, getAuthor, mostRead, published } from '@/lib/news'

export const Route = createFileRoute('/_site/')({
  component: Home,
})

function Home() {
  const all = published()
  const lead = all.find((a) => a.featured) ?? all[0]
  const rest = all.filter((a) => a.id !== lead.id && a.section !== 'opinion')
  const secondary = rest.filter((a) => a.featured).slice(0, 2)
  const latest = rest.filter((a) => !secondary.includes(a)).slice(0, 5)
  const grid = rest.filter((a) => !secondary.includes(a)).slice(0, 4)
  const opinion = bySection('opinion')

  return (
    <div className="mx-auto max-w-content px-4 sm:px-6">
      <h1 className="sr-only">The Meridian — today’s top stories</h1>

      {/* Lead package */}
      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
        <Link
          to="/news/$slug"
          params={{ slug: lead.slug }}
          className="group animate-rise block"
        >
          <StoryImage
            article={lead}
            width={1200}
            ratio="aspect-[16/9]"
            eager
          />
          <div className="mt-5 max-w-3xl">
            <Kicker article={lead} />
            <h2 className="font-display mt-2 text-3xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[3.25rem]">
              <span className="headline-link">{lead.title}</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {lead.dek}
            </p>
            <Byline article={lead} className="mt-4" />
          </div>
        </Link>

        <div className="flex flex-col gap-6 lg:border-l lg:pl-10">
          {secondary.map((a, i) => (
            <StoryCard
              key={a.id}
              article={a}
              className="animate-rise"
              style={{ animationDelay: `${120 + i * 100}ms` }}
            />
          ))}
        </div>
      </section>

      {/* Latest strip */}
      <section className="border-y py-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {latest.map((a) => (
            <HeadlineOnly
              key={a.id}
              article={a}
              className="lg:border-r lg:pr-6 lg:last:border-r-0"
            />
          ))}
        </div>
      </section>

      <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-14">
          <section>
            <SectionHeading>Top stories</SectionHeading>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {grid.map((a) => (
                <StoryCard key={a.id} article={a} />
              ))}
            </div>
          </section>

          <SectionBlock slug="climate" title="Climate" />
          <SectionBlock slug="business" title="Business" />
        </div>

        <aside className="space-y-12">
          <section>
            <SectionHeading>Most read</SectionHeading>
            <ol className="space-y-5">
              {mostRead().map((a, i) => (
                <li key={a.id} className="flex gap-4">
                  <span className="font-display w-8 shrink-0 text-4xl leading-none font-extrabold text-breaking">
                    {i + 1}
                  </span>
                  <HeadlineOnly article={a} />
                </li>
              ))}
            </ol>
          </section>

          {opinion[0] && (
            <section className="bg-primary p-6 text-primary-foreground">
              <p className="kicker text-primary-foreground/60">Opinion</p>
              <Link
                to="/news/$slug"
                params={{ slug: opinion[0].slug }}
                className="group mt-3 block"
              >
                <p className="font-display text-2xl leading-snug font-bold italic">
                  <span className="headline-link">“{opinion[0].title}”</span>
                </p>
                <p className="font-ui mt-4 text-sm font-semibold">
                  {getAuthor(opinion[0].authorId).name}
                </p>
                <p className="font-ui text-xs text-primary-foreground/60">
                  {getAuthor(opinion[0].authorId).role}
                </p>
              </Link>
            </section>
          )}

          <Newsletter />
        </aside>
      </div>

      <section className="pb-4">
        <SectionHeading>More from the world</SectionHeading>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(-3).map((a) => (
            <StoryRow key={a.id} article={a} />
          ))}
        </div>
      </section>
    </div>
  )
}

function SectionBlock({ slug, title }: { slug: string; title: string }) {
  const items = bySection(slug)
  if (!items.length) return null
  const [first, ...others] = items
  return (
    <section>
      <SectionHeading
        action={
          <Link
            to="/section/$section"
            params={{ section: slug }}
            className="font-ui inline-flex items-center gap-1 text-xs font-semibold hover:text-breaking"
          >
            All {title.toLowerCase()} <ArrowRight className="size-3" />
          </Link>
        }
      >
        {title}
      </SectionHeading>
      <div className="grid gap-8 sm:grid-cols-[3fr_2fr]">
        <StoryCard article={first} />
        <div className="space-y-6">
          {others.slice(0, 3).map((a) => (
            <StoryRow key={a.id} article={a} />
          ))}
          {others.length === 0 && (
            <p className="font-ui text-sm text-muted-foreground">
              More {title.toLowerCase()} coverage is on the way.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  return (
    <section className="border-2 border-foreground p-6">
      <p className="font-display text-2xl font-bold">The Morning Briefing</p>
      <p className="mt-2 text-sm text-muted-foreground">
        The day’s essential stories, in your inbox before 7am.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error('Please enter a valid email address.')
            return
          }
          toast.success('Thanks — newsletter sign-ups open soon.')
          setEmail('')
        }}
      >
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="font-ui w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
        />
        <Button className="w-full rounded-none">Sign up</Button>
      </form>
    </section>
  )
}
