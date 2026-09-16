# code0100fun — Notes from the workbench

A dark developer blog built with Astro, TypeScript, Markdown, and MDX. Static pages, locally bundled fonts, highlighted code, and small vanilla-JavaScript widgets. No database or Python required.

## Run locally

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. To validate production output:

```sh
npm run check
npm run build
npm test
npm run preview
```

## Write a post

```sh
npm run new:post -- "Building my Erlang VM"
# For an article with components:
npm run new:post -- "A live hardware simulation" --mdx
```

The command creates a draft in `src/content/posts`. It refuses to overwrite an existing post. Write in your preferred editor, update the frontmatter, and set `draft: false` when ready. Drafts are excluded from the homepage, article routes, RSS, and sitemap in both development and production. Set `draft: false` locally to preview an article, and revert it before deployment if it is unfinished.

```yaml
---
title: 'Building my Erlang VM'
description: 'A short description that also appears in search and link previews.'
date: 2026-09-15
tags: [Elixir, Rust]
draft: false
featured: true
art: beam
---
```

- The filename becomes `/writing/filename/`. Keep filenames stable to preserve links.
- The newest post with `featured: true` gets the homepage feature. Otherwise, the newest published post is featured.
- Supported illustrations: `cells`, `memory`, `beam`, `bits`, `terminal`.
- All tags automatically become homepage filters. Search covers titles, descriptions, and tags.
- Dates in the future remain unpublished until a build occurs after that date. Static hosting does **not** publish scheduled content automatically.
- Code fences accept Shiki language names, including `elixir`, `zig`, `rust`, `c`, and `system-verilog`. Highlighting is generated at build time; copy buttons enhance code blocks in the browser.
- Put images in `public/images` and reference them as `![Meaningful description](/images/project.png)`.

### Starter content

The four bundled articles are **clearly labeled examples**, not claims about your project history. Before launching, replace them with your own work or set `draft: true`. Remove `example: true` when replacing an example with your own article. Your bio reflects your supplied interests, and project links point to public repositories on your GitHub profile.

## Interactive widgets

Use `.md` for ordinary posts and `.mdx` when you need imports:

```mdx
import Life from '../../components/Life.astro';

## Try it yourself

<Life />
```

See `src/content/posts/tiny-universe.mdx` for a working example. `Life.astro` wraps a keyboard-accessible custom element around a tested simulation in `src/lib/life.mjs`. Multiple instances have independent state. It starts paused and supports reset, pointer input, and arrow-key navigation. Create additional Astro components with their own `<script>` blocks for demos. Astro only includes a component’s script on pages that use it. React, Svelte, or other framework islands can be added later if a widget needs them.

Only add Markdown/MDX from trusted authors: MDX can import and execute code at build time. This is a repository-based publishing workflow, not a public content upload service.

## Deploy to Fly.io

The multi-stage Docker build generates static files with Node 24 and serves them with unprivileged Nginx on port 8080. Fly handles HTTPS. No persistent volume or runtime secrets are needed.

The app is deployed as **`code0100fun-blog`** in the **Personal** organization (`personal`), with one shared-CPU, 256 MB machine in Dallas (`dfw`). Its Fly URL is [code0100fun-blog.fly.dev](https://code0100fun-blog.fly.dev).

The project pins Fly CLI in `.mise.toml`. To deploy an update:

```sh
mise install
mise exec -- flyctl auth login
npm run check
npm run build
npm test
mise exec -- flyctl deploy --remote-only --ha=false
mise exec -- flyctl status
mise exec -- flyctl checks list
```

Remote builds do not require a local Docker daemon. Login is only needed when the CLI is not authenticated.

### Custom domain setup

The DNS cutover from Vercel to Fly.io was applied through the Namecheap API on September 15, 2026. Fly-managed Let's Encrypt certificates are active for `code0100fun.com` and `www.code0100fun.com`. Namecheap remains the DNS provider. The web records are:

| Type | Host | Value |
| ---- | ---- | ----- |
| A | `@` | `66.241.124.36` |
| AAAA | `@` | `2a09:8280:1::18f:b3bf:0` |
| CNAME | `www` | `o901xoe.code0100fun-blog.fly.dev` |

Keep the following records for domain validation and certificate renewal:

| Type | Host | Value |
| ---- | ---- | ----- |
| CNAME | `_acme-challenge` | `code0100fun.com.o901xoe.flydns.net.` |
| CNAME | `_acme-challenge.www` | `www.code0100fun.com.o901xoe.flydns.net.` |
| TXT | `_fly-ownership` | `app-o901xoe` |
| TXT | `_fly-ownership.www` | `app-o901xoe` |

The existing apex TXT record and Google mail configuration (`EmailType=GMAIL`) were preserved. Namecheap's `setHosts` API replaces the complete host-record list, so always read and back up the zone first and preserve its email mode. Use `mise exec -- flyctl certs check code0100fun.com` (and the `www` hostname) to verify HTTPS status.

The canonical URL is **https://code0100fun.com**. Change `site` in `astro.config.mjs` if you intend to use a different domain, then rebuild and redeploy. The canonical URLs, RSS, sitemap, and article sharing links follow that setting.

Machines stop when idle and start on incoming requests. Set `min_machines_running = 1` if you prefer an always-running instance in the primary region. Future posts are published by committing your content and running `fly deploy` again; changes to local files do not modify the deployed site.

Optional local container check, with Docker running:

```sh
docker build -t code0100fun-blog .
docker run --rm -p 8080:8080 code0100fun-blog
```

Verify `/`, an article, `/healthz`, and a nonexistent path (which should return HTTP 404 with the custom error page).

## Project visibility

Edit `src/data/projects.ts` to manage the project list. Projects with `status: 'public'` appear as GitHub links; the first three also appear on the homepage. Projects with `status: 'coming-soon'` appear in a separate section as non-clickable cards labeled **Private · Coming soon**. Their repository URLs are not rendered as links. Descriptions, languages, and categories are optional for coming-soon projects.

When a repository becomes public, change its status to `public`, supply its description, language, and category, then rebuild and deploy. Visibility is curated here rather than detected automatically from GitHub.

## Where things live

| File or directory                      | Purpose                                      |
| -------------------------------------- | -------------------------------------------- |
| `src/content/posts/`                   | Markdown and MDX articles                    |
| `src/content.config.ts`                | Validated frontmatter schema                 |
| `src/data/projects.ts`                 | Curated GitHub projects                      |
| `src/pages/about.astro`                | Your bio                                     |
| `src/components/`                      | Cards, illustrations, icons, and widgets     |
| `src/styles/`                          | Theme, responsive layout, and article styles |
| `astro.config.mjs`                     | Canonical domain and integrations            |
| `fly.toml`, `Dockerfile`, `nginx.conf` | Hosting configuration                        |

The site includes RSS, a sitemap, canonical links, Open Graph/X text metadata, article structured data, a custom 404, keyboard navigation, and responsive layouts. Fonts are served locally; there are no analytics or third-party tracking scripts.

### Reference documentation

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Static websites on Fly.io](https://fly.io/docs/languages-and-frameworks/static/)

### Validation notes

`npm test` expects a completed build. It checks the Game of Life rules and edge wrapping, draft creation without overwriting, generated article metadata, and internal page/asset links. Docker runtime validation requires a running Docker daemon.
