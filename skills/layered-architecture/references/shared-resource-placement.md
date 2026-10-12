# Shared Resource Placement

Use this reference after identifying the capability or independently reusable resource. Sharing count, ownership scope, and runtime platform are separate questions.

Discover and preserve the workspace's adopted roots using [the topology rules](app-local-or-capability.md#discover-the-workspace-topology). Every path below is a default for a workspace without an existing convention; adapt it to established roots such as `apps/` and `libs/` without migrating them implicitly.

## Decide Ownership Before Location

- Reuse by multiple capabilities in one business domain keeps `scope:<domain>`. Approve any independent project boundary separately.
- A resource used across domain scopes may use `scope:shared` only when consumers belong to multiple business scopes, its behavior is genuinely owner-neutral, and that boundary is approved. Do not use `scope:shared` to bypass a domain-owned public API.
- An owner-neutral resource used on one platform belongs under `projects/<platform>/libs/shared/<resource>` with the purpose-specific canonical type.
- Code used by frontend and backend belongs under `projects/shared/<scope>/<resource>` only after its owner and boundary are approved and it uses runtime-agnostic TypeScript or JavaScript.
- Cross-platform code must not depend on Angular, NestJS, browser-only APIs, server-only APIs, or other platform runtimes. If it needs one, keep it on that platform.
- New cross-platform contracts go to a cohesive approved project owned by their domain or, only when owner-neutral, `scope:shared`, and consumers use its curated public API.

Choose `type:domain`, `type:data-access`, `type:ui`, or `type:utility` from the
resource's approved purpose; reuse alone does not determine the type.

## Decision Forward Tests

### Same-domain reuse

- Input: two customer capabilities reuse one customer-owned policy.
- Expected: retain `scope:customer`; apply the approval gate before making it an independent `type:domain` project.
- Reject: changing to `scope:shared` because there are two consumers.

### Cross-domain platform resource

- Input: multiple API scopes need an approved owner-neutral correlation utility.
- Expected: place it under `projects/api/libs/shared/<resource>` with `platform:api`, `scope:shared`, and `type:utility`.
- Reject: `projects/shared/...` when it depends on server runtime APIs, or a
  generic project type used as a synonym for reuse.

### Cross-platform resource

- Input: frontend and backend need an approved pure currency contract owned by billing.
- Expected: place it under `projects/shared/billing/<resource>` with `platform:cross-platform` and `scope:billing`.
- Reject: `scope:shared` when billing owns the behavior, or any platform-only dependency.

### Cross-platform owner-neutral resource

- Input: frontend and backend need an approved runtime-agnostic utility with no business-domain owner.
- Expected: place it under `projects/shared/shared/<resource>` with `platform:cross-platform`, `scope:shared`, and its purpose-specific type.
- Reject: a platform-specific project, a domain scope without an owner, or a
  project type that does not describe the resource's purpose.
