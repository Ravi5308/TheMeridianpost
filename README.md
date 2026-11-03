# The Meridian

An independent digital newspaper with its own custom-built newsroom CMS. Readers get a fast, editorial news site; editors get a dashboard to write, schedule and publish stories and standalone pages and to manage the photo library. No third-party CMS is involved.

## What's here

**Public site**

- `/` — homepage with lead story, latest headlines, top stories, section blocks, most read, opinion and newsletter sign-up
- `/news/:slug` — article page with reading progress, byline, pull quotes, tags, sharing and related coverage
- `/section/:section` — section fronts (World, Politics, Business, Technology, Science, Climate, Health, Sport, Culture, Opinion)
- `/search?q=` — headline and tag search
- Red breaking-news ticker and responsive desktop/mobile navigation

**Newsroom CMS** (`/admin`)

- Dashboard: publishing stats, scheduled and in-review queue, top stories by views, recent edits
- Articles: status tabs, search, section filter, edit/view/delete
- Editor: headline, standfirst, story body with subheadings and pull quotes, live preview, publish now or schedule, author, section, breaking/featured/live toggles, featured image picker, caption, tags, URL slug and search preview, validation
- Media library: drag-and-drop upload, alt text and credit editing, CDN URL copy
- Pages: standalone pages with publish and footer toggles

The site currently runs on sample stories in `src/data/fixtures.ts`. Newsroom edits last for the browser session. Real storage, sign-in and scheduled publishing are next on the roadmap.

## Tech

- TanStack Start (React 19, TanStack Router), Vite, TypeScript
- Tailwind CSS 4 with shadcn/ui components
- Netlify Image CDN for all images (`/.netlify/images`)
- Planned: Netlify Database (Postgres + Drizzle), Netlify Identity, Netlify Blobs, scheduled functions

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

Use `netlify dev` so the Image CDN works locally.

## Roadmap

See [PLAN.md](PLAN.md). In short:

1. ✅ Product surface (public site and newsroom screens)
2. Content data model on Netlify Database
3. Sign-in and roles with Netlify Identity
4. Media uploads to Netlify Blobs
5. Scheduled publishing and review workflow
6. Standalone page editor and public page routes
7. Reader features: newsletter, search, RSS, SEO
8. Analytics, accessibility and operations polish
