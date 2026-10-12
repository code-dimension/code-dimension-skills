# App-Local Or Capability

Use this reference only to decide whether a cohesive workflow stays in an app, becomes one extracted capability, or justifies an independent resource project.

## Discover The Workspace Topology

Inspect existing Nx project roots, source roots, entrypoints, and nearby project conventions. Reuse adopted roots such as `apps/` and `libs/`; do not relocate existing projects to match the examples here. Local app trees may differ while preserving the same boundaries.

When no convention exists, use these defaults:

| Project                                     | Default location                             |
| ------------------------------------------- | -------------------------------------------- |
| Backend app                                 | `projects/api/apps/<app>`                    |
| Frontend app                                | `projects/frontend/apps/<app>`               |
| Platform capability or independent resource | `projects/<platform>/libs/<scope>/<purpose>` |
| Cross-platform capability or pure resource  | `projects/shared/<scope>/<purpose>`          |

Here `<platform>` is `api` or `frontend`. Paths organize projects; resolved tags and runtime dependencies establish their boundaries. In an existing `apps/` and `libs/` workspace, use its established scope/platform grouping beneath those roots instead.

## Classify The Boundary

1. Name the cohesive workflow, its business owner, platform, and current consumers.
2. Keep app entrypoints and top-level runtime composition in the app. Backend controllers, guards, pipes, middleware, bootstrap, and route composition remain backend app runtime even when they expose an extracted capability.
3. Default a new single-consumer workflow to an app-local capability. Keep its needed rules, coordination, adapters, state, and presentation together rather than creating one Nx project per technical layer.
4. Recommend extraction when evidence shows an independent workflow lifecycle, ownership, enforcement boundary, or another runtime or capability consumer. Evidence supports the recommendation but the approval gate still applies.
5. After approval, extract one vertical project in the adopted library root (default: `projects/<platform>/libs/<scope>/<capability>`), tag it `type:capability`, and expose only approved stable behavior through its root entrypoint.
6. Propose an independent resource project in that root (default: `projects/<platform>/libs/<scope>/<purpose>`) only when the resource has a cohesive purpose and reuse independent of one capability. Technical names such as `domain` or `data-access` are not approval.

New internal projects are non-buildable and non-publishable unless a separate packaging decision says otherwise. Their entrypoints export only approved use cases, contracts, or composition hooks; adapters, persistence implementations, private state, incidental UI, and responsibility folders remain private.

Keep one capability focused on one cohesive workflow and public purpose. Split unrelated workflows rather than growing a domain-wide or layer-wide bucket. Migrate only the approved capability and record adjacent candidates for separate decisions. Do not create new `model` projects; model-shaped resources belong in the owning `domain` responsibility or an approved independent `type:domain` project.

## Public API Boundary

Exports need a current approved consumer or explicit public contract. A concrete service or repository may be exported when that contract requires it; internal helpers, unused adapters, and private state remain private. Never export a symbol merely to silence a boundary violation.

External consumers, including other app-local capabilities and cross-project tests, use only the curated root entrypoint. Deep aliases, source paths, responsibility subpaths, and relative paths into another capability's internals are forbidden. Colocated unit tests may inspect internals only within the same capability identity; do not add test-only secondary entrypoints.

For unrelated legacy deep imports, record the exact source, target, pattern, and migration owner. Do not broaden the current task into cleanup. Any approved temporary exception must be narrowly scoped and removed with its owning migration.

## Decision Forward Tests

### Single-consumer workflow

- Input: a cohesive checkout workflow has one app consumer and no approved independent boundary.
- Expected: keep one app-local capability and omit unused responsibility areas.
- Reject: generating separate domain, data-access, feature, or UI projects because those names exist.

### Approved reusable capability

- Input: an approved decision says two runtimes need the same complete workflow.
- Expected: extract one `type:capability` project with a curated root API.
- Reject: splitting the workflow into projects for every internal responsibility.

### Approved independent resource

- Input: a pure pricing policy has approved ownership and reuse outside any one capability.
- Expected: create one cohesive purpose-based `type:domain` resource under the owning platform and scope.
- Reject: inferring the boundary only because the code is pure or has a domain-like name.

### Undecided boundary

- Input: imports and consumer count support either app-local placement or extraction, but no request or approved artifact chooses.
- Expected: present evidence, alternatives, recommendation, and impacts, then stop before writes for user approval.
- Reject: treating graph evidence as authorization.

### Approved decision document

- Input: an approved design explicitly selects one extracted capability and its owner.
- Expected: proceed with that boundary without asking the same question again.
- Reject: a redundant approval prompt or a broader extraction than the artifact authorizes.

### Existing apps and libs roots

- Input: a workspace uses `apps/api` and `libs/orders/*`, already has `scope:orders`, and has no external architecture contexts or specification workflow. The task adds a single-consumer order export workflow.
- Expected: keep the workflow within `apps/api` using its local source layout. If a later task approves extraction, use `libs/orders/<capability>` with `platform:api`, `scope:orders`, and `type:capability`.
- Reject: demanding another document or skill, creating `projects/`, or moving existing roots merely to follow a default example.
