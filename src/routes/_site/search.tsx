import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { StoryRow } from '@/components/site/StoryCards'
import { search } from '@/lib/news'

export const Route = createFileRoute('/_site/search')({
  validateSearch: z.object({ q: z.string().default('').catch('') }),
  head: () => ({ meta: [{ title: 'Search | The Meridian' }] }),
  component: SearchPage,
})

const suggestions = ['Climate', 'Markets', 'Elections', 'Space', 'Football']

function SearchPage() {
  const { q } = Route.useSearch()
  const results = search(q)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold">
        {q ? <>Results for “{q}”</> : 'Search'}
      </h1>
      <form className="mt-6 flex border-b-2 border-foreground" role="search">
        <label htmlFor="q" className="sr-only">
          Search articles
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Search headlines, topics and tags"
          className="w-full bg-transparent py-3 text-xl outline-none"
        />
        <button className="font-ui px-4 text-sm font-bold uppercase">
          Search
        </button>
      </form>

      {q && (
        <p className="font-ui mt-4 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? 'story' : 'stories'} found
        </p>
      )}

      {q && results.length === 0 && (
        <p className="mt-10 text-lg">
          Nothing matched. Try a broader term, or one of the topics below.
        </p>
      )}

      {(!q || results.length === 0) && (
        <div className="font-ui mt-6 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Link
              key={s}
              to="/search"
              search={{ q: s }}
              className="border px-3 py-1 text-sm font-semibold hover:border-foreground"
            >
              {s}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 divide-y">
        {results.map((a) => (
          <StoryRow key={a.id} article={a} className="py-6" />
        ))}
      </div>
    </div>
  )
}
