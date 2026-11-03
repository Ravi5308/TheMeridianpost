import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import {
  Byline,
  Kicker,
  StoryCard,
  StoryImage,
} from '@/components/site/StoryCards'
import { bySection, getSection } from '@/lib/news'

export const Route = createFileRoute('/_site/section/$section')({
  loader: ({ params }) => {
    const section = getSection(params.section)
    if (!section) throw notFound()
    return { section, items: bySection(section.slug) }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.section.name} | The Meridian` },
          { name: 'description', content: loaderData.section.description },
        ]
      : [],
  }),
  component: SectionPage,
})

function SectionPage() {
  const { section, items } = Route.useLoaderData()
  const [lead, ...rest] = items

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <header className="border-b-2 border-foreground pb-6">
        <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
          {section.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {section.description}
        </p>
      </header>

      {!lead ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl font-bold">
            No {section.name.toLowerCase()} stories yet
          </p>
          <p className="mt-2 text-muted-foreground">
            Our correspondents are on it. In the meantime, catch up on{' '}
            <Link to="/" className="underline">
              today’s top stories
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <Link
            to="/news/$slug"
            params={{ slug: lead.slug }}
            className="group grid gap-6 border-b py-8 md:grid-cols-[3fr_2fr] md:gap-10"
          >
            <StoryImage article={lead} width={1000} eager />
            <div className="flex flex-col justify-center">
              <Kicker article={lead} />
              <h2 className="font-display mt-2 text-3xl leading-tight font-extrabold sm:text-4xl">
                <span className="headline-link">{lead.title}</span>
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">{lead.dek}</p>
              <Byline article={lead} className="mt-4" />
            </div>
          </Link>
          <div className="grid gap-x-8 gap-y-10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <StoryCard key={a.id} article={a} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
