[![skills.sh](https://skills.sh/b/code-dimension/code-dimension-skills)](https://skills.sh/code-dimension/code-dimension-skills)


# Code Dimension Agent Tools

Code Dimension's catalog of recommended skills, CLIs, and MCP tools for AI coding agents. This repository contains the catalog website and the reusable skills maintained by Code Dimension.

[Browse the catalog](https://skills.codedimension.com.br/) to search by name, purpose, category, or creator and combine category, type, and creator filters. Third-party tools link to their own installation and usage resources.

## Skills maintained here

| Skill | Purpose |
| --- | --- |
| [Cloudflare Stream](https://skills.sh/code-dimension/code-dimension-skills/cloudflare-stream) | Design and troubleshoot video uploads, playback, access control, and live streaming. |
| [Hotmart API](https://skills.sh/code-dimension/code-dimension-skills/hotmart-api) | Work with Hotmart authentication, products, sales, subscriptions, and other API domains. |
| [Layered Architecture](https://skills.sh/code-dimension/code-dimension-skills/layered-architecture) | Decide code placement, ownership, and capability boundaries in Nx workspaces. |
| [Pragmatic Git Context](https://skills.sh/code-dimension/code-dimension-skills/pragmatic-git-context) | Inspect focused diffs and Git history while preserving existing work. |
| [Save Research](https://skills.sh/code-dimension/code-dimension-skills/save-research) | Preserve findings, sources, and decisions in reusable research documents. |
| [Subagent Delegation](https://skills.sh/code-dimension/code-dimension-skills/subagent-delegation) | Coordinate explicitly requested delegation with focused context and shared verification. |

Skill instructions and supporting references live in [`skills/`](skills/).

## Install skills

Use the [Skills CLI](https://skills.sh/) from the project where you want to use the skills:

```bash
npx skills add https://github.com/code-dimension/code-dimension-skills
```

Follow the CLI prompts to select skills and configure your agent. Review each skill's instructions before use. Installing these skills does not require running the catalog website.

## Develop the catalog

The website uses Angular 22, Nx 23, Tailwind CSS 4, and daisyUI 5, with Vitest for application tests and Oxlint for linting.

Use Node.js 22.22.3+ within the 22.x release line, or another version supported by the installed Angular CLI, and npm. From the repository root:

```bash
npm ci
npx nx run catalog:generate-seo
npx nx run catalog:serve
```

Open the local URL printed by the development server. Generate the SEO files before the first serve and rerun `catalog:generate-seo` after changing catalog data or the HTML template to refresh metadata and public text files.

### Project commands

| Command | Purpose |
| --- | --- |
| `npx nx run catalog:lint` | Lint the catalog source. |
| `npx nx run catalog:test-data` | Test catalog data validation. |
| `npx nx run catalog:test` | Run application tests and the dependent data validation tests. |
| `npx nx run catalog:generate-seo` | Validate catalog data and generate SEO/AEO files. |
| `npx nx run catalog:build` | Generate SEO/AEO files and build the production website. |
| `npx nx run catalog:serve-static` | Preview the production build locally. |

The production build prerenders static HTML and writes the website to `dist/apps/catalog/browser/`.

## Update the catalog

Edit [`apps/catalog/src/app/catalog.data.json`](apps/catalog/src/app/catalog.data.json), the single source for site settings, tool entries, and FAQs. The Angular interface and generated SEO/AEO content use the same data.

- Keep public content in English.
- Give each tool a unique, lowercase kebab-case `id`; preserve existing IDs because they form public anchors.
- Include `name`, `description`, `creator`, `creatorType`, `types`, `categories`, and `url` for each entry.
- Use `Skill`, `CLI`, and/or `MCP` as types. A tool can have multiple types and categories but appears on one card.
- Link every entry containing the `Skill` type to `skills.sh`. Other tools can link to their official setup or documentation pages.
- Use `Code Dimension` as `creator` and `Organization` as `creatorType` for skills maintained here.

The build runs [`generate-seo.mjs`](apps/catalog/tools/generate-seo.mjs) to validate the data and generate:

- `apps/catalog/src/index.generated.html`, including metadata and JSON-LD.
- `apps/catalog/public/llms.txt` and `skills.md` for machine-readable catalog content.
- `apps/catalog/public/robots.txt` and `sitemap.xml` for crawlers.

These outputs are ignored by Git. Update the source data, [`src/index.html`](apps/catalog/src/index.html), or the generator instead of editing generated files.

## Repository structure

```text
skills/                    Maintained skills and supporting references
apps/catalog/src/app/      Angular interface and canonical catalog data
apps/catalog/tools/        SEO generation and data validation tests
apps/catalog/public/       Static assets and generated public files
DESIGN.md                  Visual design system
```

## Contributing

Keep changes focused and follow [`AGENTS.md`](AGENTS.md) and the [catalog instructions](apps/catalog/AGENTS.md). Use [`DESIGN.md`](DESIGN.md) for interface changes.

To add a maintained skill, create `skills/<skill-name>/SKILL.md` with its name, description, and instructions, plus any necessary references. Add a corresponding catalog entry when it should appear on the website. Keep third-party recommendations attributed to their original creators.

For catalog changes, run lint, tests, and the production build using the commands above before submitting a pull request.
