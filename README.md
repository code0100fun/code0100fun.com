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

1. Install and sign in to the [Fly CLI](https://fly.io/docs/flyctl/install/).
2. From this directory, run `fly launch --no-deploy`. Keep the supplied Dockerfile and select a unique Fly app name; `code0100fun-blog` in `fly.toml` is a suggested name, not a provisioned app.
3. Review `fly.toml`, then run `fly deploy`.
4. Run `fly status` and `fly checks list` to verify the running app and `/healthz` check.
5. Add the domain with `fly certs add code0100fun.com`. Use `fly certs show code0100fun.com` to obtain the required DNS records. Apply the records at your DNS provider, then verify the certificate status.

The canonical URL is **https://code0100fun.com**. Change `site` in `astro.config.mjs` if you intend to use a different domain, then rebuild and redeploy. The canonical URLs, RSS, sitemap, and article sharing links follow that setting.

Machines stop when idle and start on incoming requests. Set `min_machines_running = 1` if you prefer an always-running instance in the primary region. Future posts are published by committing your content and running `fly deploy` again; changes to local files do not modify the deployed site.

Optional local container check, with Docker running:

```sh
docker build -t code0100fun-blog .
docker run --rm -p 8080:8080 code0100fun-blog
```

Verify `/`, an article, `/healthz`, and a nonexistent path (which should return HTTP 404 with the custom error page).

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
