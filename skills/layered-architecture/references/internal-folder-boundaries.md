# Internal Folder Boundaries

Use this reference only after the owning app or project boundary is approved. Responsibility names are optional structure inside a capability, not a request to create sibling Nx projects.

Use the responsibility definitions and backend or frontend dependency matrix in [the skill entrypoint](../SKILL.md#canonical-internal-responsibilities). These matrices govern imports between responsibilities; imports within one responsibility remain internal and must preserve cohesive slices. An omitted cross-responsibility edge is disallowed, not an invitation to add an exception.

## Re-slice Populated Content

Inspect the content and import graph, classify named cohesive resource/workflow slices, move implementation with tests and templates, update imports and the public API, and validate. Remove empty responsibilities and ceremonial slices. Apply the [approval gate](../SKILL.md#hard-approval-gate) if analysis leaves at least two materially valid cohesive divisions; otherwise proceed with the supported division.

Files inside one capability do not import sibling capability internals. Cross-capability consumers use the sibling's curated public entrypoint. Colocated tests may receive a narrow same-capability internal allowance; cross-project tests still use the public API.

Classify internal boundaries by platform, owner, capability, responsibility, and slice; include the owning app for app-local capabilities. Treat tests, fixtures, configuration, entrypoints, and bootstrap files explicitly in enforcement. Any necessary exception stays within that identity and never grants access to another app or capability's internals. Unmatched legacy files and external packages are not proven compliant by folder rules; inspect applicable project and public-API constraints separately.

## Organize Source By Entity And Cohesive Slice

- Keep at most one class per source file, including private classes.
- Give each exported or cross-file reusable interface, type, constant, enum, schema, class, and function its own dedicated file.
- Keep private file-local types, constants, object literals, and helper functions with the primary entity they exclusively support.
- Group collaborating implementation, tests, and templates by domain, capability, or named workflow/resource slice before technical type. Do not scatter a workflow across parallel technical-type folders.
- Use an entity-kind or architectural-role suffix before `.ts`, except for tool-mandated entrypoint or configuration filenames.
- Do not add `index.ts` automatically when splitting an entity. Barrels are intentional, curated public surfaces only.
- Intentional public barrels and tool-mandated entrypoint or configuration files are exceptions to the entity-count rule.

These rules apply to source code in the workspace's adopted roots, regardless of whether they are named `projects/`, `apps/`, or `libs/`.

## Ports And Composition

Do not add a port, adapter pair, provider factory, or app-level interface mapping for one implementation. Ports are optional and stay with the cohesive slice that owns their contract only when at least two active implementations or a concrete external boundary requires substitution; do not prescribe `domain/ports`.

### Backend

Extracted backend capabilities do not require or contain a `runtime` responsibility. A framework module that registers the capability's concrete providers may live with its cohesive feature composition slice; transport modules remain app-local.

The app owns controllers, guards, pipes, interceptors, middleware, route-level validation binding, transport modules, bootstrap, and environment wiring. Runtime validates execution configuration and passes explicit options into the capability; reusable business behavior and independent gateways do not belong in runtime. Do not introduce a separate backend app library for transport composition.

For Nest capabilities with collaborating providers, export a capability-owned module through the curated root API. It registers providers once and exports only what approved app consumers require. Apps import and configure that module instead of constructing its services or repeating registrations. Use a static module for a fixed provider set and `forRoot()` or `forRootAsync()` for runtime-dependent configuration; a parameterized `provide*()` helper may stay private but is not the public integration surface. Consult technology documentation for API implementation details.

### Frontend

Frontend `domain` may own pure view models, `feature` coordinates workflow and presentation, `data-access` owns remote or reusable state, and `ui` owns presentation and UI-local state. Do not introduce backend ports, use-case classes, or framework-specific folders by symmetry.

Frontend app runtime owns routes, providers, shells, environment wiring, and bootstrap. Server-rendered apps may also own rendering strategy, route metadata, and SEO composition there. These runtime differences do not require extracting a single-consumer workflow or imposing the same folder tree on every app.

### Cross-Platform

Cross-platform capabilities and resources materialize only cohesive pure responsibilities. They remain runtime-agnostic and do not acquire frontend or backend folders merely to mirror either profile.

Use current technology documentation or available specialized guidance for state, templates, persistence, and other API-level implementation. Those technologies do not change the dependency direction above, and no companion skill or context file is required.

## Decision Forward Tests

### Backend capability without persistence

- Input: an approved backend capability has pure rules and feature coordination but no adapter or transport work in the extracted project.
- Expected: use only the needed domain and feature areas; keep runtime in the app.
- Reject: empty data-access/runtime folders or frontend UI responsibilities.

### Frontend capability with remote state

- Input: an approved frontend capability needs view contracts, workflow coordination, remote state, and presentation.
- Expected: use the needed frontend domain, feature, data-access, and UI areas with the frontend dependency direction.
- Reject: backend port, use-case-class, or framework-specific structures by symmetry.
