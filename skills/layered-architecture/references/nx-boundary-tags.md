# Nx Boundary Tags

Use this reference only after placement, ownership, and project purpose are approved. Tags describe a boundary; they do not approve one.

Inspect the workspace's effective module, folder, and public-API boundary configuration, including applicable overrides and import resolution. Do not assume a configuration filename, custom resolver, or enforcement tool. Tags describe the intended policy; their presence alone does not prove enforcement.

## Canonical Tag Set

Every canonical app or library has:

- exactly one platform: `platform:api`, `platform:frontend`, or `platform:cross-platform`;
- exactly one purpose: `type:app`, `type:capability`, `type:domain`, `type:data-access`, `type:ui`, or `type:utility`;
- exactly one ownership tag: `scope:<domain>` or approved owner-neutral `scope:shared`.

Inspect the ownership tags already used by workspace projects and reuse an
existing scope when it fits. If the proposed `scope:<domain>` is not already
represented, stop and ask the user to confirm that a new ownership may be
created. After approval, update affected boundary configuration, resolved
metadata, and ownership edges together. Update local guidance or generator
defaults only when their contracts are affected; neither is required to exist.

Canonical projects and generators emit only the approved tag set and do not
add a separate architecture or migration marker. Do not use `type:shared` as a
synonym for reuse or introduce `type:model`; choose the approved purpose.
Existing noncanonical tags do not authorize new projects to copy them, and
their migration requires separate scope approval. Any approved path or runtime
exception must be explicit and narrowly scoped in the effective configuration,
not a generic tag category or workspace-wide suppression.

## Project Dependency Matrices

Platform, ownership, and type constraints apply cumulatively. Every applicable
matrix must allow an edge; absence of enforcement never grants permission.

| Source platform           | Allowed target platforms                       |
| ------------------------- | ---------------------------------------------- |
| `platform:api`            | `platform:api`, `platform:cross-platform`      |
| `platform:frontend`       | `platform:frontend`, `platform:cross-platform` |
| `platform:cross-platform` | `platform:cross-platform`                      |

| Source ownership | Allowed target ownerships             |
| ---------------- | ------------------------------------- |
| `scope:<domain>` | Same `scope:<domain>`, `scope:shared` |
| `scope:shared`   | `scope:shared`                        |

Multi-scope app composition requires an explicitly approved, narrowly scoped
configuration context; an app tag alone does not bypass ownership.

| Source type        | Allowed target types                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| `type:app`         | `type:capability`, `type:data-access`, `type:domain`, `type:ui`, `type:utility` |
| `type:capability`  | `type:capability`, `type:data-access`, `type:domain`, `type:ui`, `type:utility` |
| `type:data-access` | `type:data-access`, `type:domain`                                               |
| `type:domain`      | `type:domain`                                                                   |
| `type:ui`          | `type:ui`, `type:domain`                                                        |
| `type:utility`     | `type:utility`                                                                  |

Capability-to-capability edges require approved boundaries and the same scope.
The type matrix does not authorize an app dependency from a library or override
the platform rules; `ui` remains frontend-only. Internal responsibility names
are not additional project types.

## Boundary Consequences

- Platform, ownership, and type constraints are independent; passing one never bypasses another.
- A canonical domain scope may consume its own scope or `scope:shared`. A canonical `scope:shared` context may consume only `scope:shared`.
- Apps and capabilities consume other projects only through allowed types and curated public entrypoints.
- Lower-level independent resources do not gain upward dependencies on an app or capability.
- Cross-platform projects consume only cross-platform projects.
- Deep aliases, relative cross-project paths, and responsibility subpaths do not become public APIs.

## Validate The Boundary

1. Inspect resolved Nx project configuration, including inferred or inherited metadata. Confirm roots, public entrypoints, and exactly one platform, type, and scope tag; do not infer tags from folder names.
2. Inspect effective boundary rules for affected source files and consumers, including overrides and alias resolution. Check that all three project matrices, the applicable internal responsibility matrix, and root-entrypoint restrictions apply together.
3. Trace changed imports through their resolved targets. Check sibling app-local capabilities as well as extracted projects, production consumers, colocated tests, and cross-project tests. A relative path cannot bypass a public boundary.
4. Run the workspace's actual boundary/lint checks for affected projects and external consumers. If enforcement configuration changes, run all projects covered by that policy without reusing stale cached results. Discover the available targets instead of assuming their names or requiring a custom tool.
5. Record missing enforcement or checks as gaps, and separate unrelated pre-existing failures from regressions. Do not claim that a documentation review proves executable enforcement. Where the task changes only this skill's prose, validate its links, formatting, and decision scenarios instead of running application builds or tests.

Complete approved metadata and policy changes together. Preserve unrelated
legacy topology and contracts; do not silently relax policy to make a check pass.
