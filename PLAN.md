# The Meridian — product roadmap

The Meridian is an independent news portal with its own custom newsroom CMS (no WordPress, Joomla or Drupal). It has two parts: a public news site and a secure admin dashboard where editors write, schedule and publish articles and standalone pages and manage media.

Each milestone below is a small, self-contained piece of work. Do them in order.

## Milestone 1 — Product surface ✅

The branded public site and newsroom screens, running on sample data in `src/data/fixtures.ts`.

- Public: homepage (lead story, latest strip, top stories, section blocks, most read, opinion, newsletter box), article page, section pages, search, red breaking-news ticker, desktop and mobile navigation.
- Newsroom: dashboard, article list with status tabs and filters, full article editor (write/preview, scheduling, placement toggles, featured image picker, tags, slug, search preview), media library (drag-and-drop upload, alt text, credit, CDN URL), pages list.
- Editorial photography generated for the sample stories, served through Netlify Image CDN.

## Milestone 2 — Content data model (Netlify Database)

- Drizzle schema in `db/schema.ts`: `sections`, `authors`, `articles` (status, publish_at, breaking/featured/live flags, body as JSON blocks, tags), `pages`, `media_assets`.
- Seed script that loads the current fixtures.
- Replace the helpers in `src/lib/news.ts` with server functions or loaders that query the database. Public pages only show `published` rows whose `publish_at` has passed.
- Replace `src/lib/cms-store.ts` actions with server functions (create, update, delete article; create, update page).

## Milestone 3 — Authentication and roles (Netlify Identity)

- Protect `/admin/*` and every write server function; anonymous visitors are sent to a sign-in screen.
- Roles: `admin`, `editor` (publish), `writer` (draft and send to review only).
- Real user names in the sidebar and as article authors; an invite flow for new staff.

## Milestone 4 — Media storage (Netlify Blobs + Image CDN)

- Upload endpoint that stores originals in Netlify Blobs and records metadata in `media_assets`.
- Serve uploads through `/.netlify/images` with responsive widths and WebP/AVIF.
- Usage tracking (which articles use an image) so in-use images can't be deleted.

## Milestone 5 — Scheduling and publishing workflow

- Scheduled function that runs every few minutes and flips `scheduled` articles to `published` when `publish_at` passes.
- Review queue for editors, revision history and an "updated" timestamp on corrections.
- Breaking-news ticker driven by the `breaking` flag with automatic expiry.

## Milestone 6 — Standalone pages

- Page editor reusing the article body editor.
- Public `/[page]` route for About, Contact, Editorial standards, Corrections, Privacy, with footer links driven by the `inFooter` flag.

## Milestone 7 — Reader features

- Newsletter sign-up stored in the database (or Netlify Forms).
- Database-backed search and tag pages; view counts feeding "Most read".
- SEO: sitemap, RSS feed per section, Open Graph images, structured data for articles.

## Milestone 8 — Polish and operations

- Analytics on the dashboard from real view data.
- Accessibility and performance pass; caching headers for article pages.
- Audit log of publishing actions.
