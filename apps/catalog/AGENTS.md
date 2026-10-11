# Catalog Application

This project is the public catalog application for Code Dimension's recommended agent tools. It will be published at `agent-skills.codedimension.com.br`.

The application must help people:

- Browse and discover recommended skills, CLIs, and MCP tools by objective.
- Understand what each tool is for.
- Visit external sources for documentation and setup.
- Learn how to use the tools.

## Language

All user-facing content must be written in English so the catalog is accessible to people worldwide. This includes navigation, headings, descriptions, labels, buttons, empty states, error messages, metadata, and accessibility text.

## Visual Direction

All visual implementation must follow and be inspired by the repository's [`DESIGN.md`](../../DESIGN.md). Use the established design tokens and interface principles consistently.

## Technology Stack

- Angular
- Nx
- Tailwind CSS 4
- daisyUI 5

## Catalog data

Keep `src/app/catalog.data.json` as the single source for items and FAQs. Each item has one card and may have multiple categories and types. Combine search, category, type, and creator filters by intersection. All skills maintained in this repository use `Code Dimension` as creator and `Organization` as creatorType. Preserve the public anchors and `/skills.md`; the build generates SEO/AEO artifacts from the same data.

Every item whose types include `Skill` must link to `skills.sh` for installation, including local skills and tools that also offer CLI or MCP access. Use the specific skill page, or the repository collection page for tools offering multiple skills.
