---
name: angular-arch
description: Core rules for structuring an Angular workspace into core, features, and shared directories. Use this skill to determine exactly where a new Angular resource belongs within the `src/app` folder. It defines the Scope Rule (e.g. usage across 1 vs 2+ features), mandatory file naming conventions (e.g. strict use of classic suffixes like .component.ts, .service.ts, .pipe.ts, .guard.ts, .interceptor.ts, .resolver.ts, .route.ts), and the coding standard checklist (e.g., using inject() and signal-based forms). Triggers whenever creating a new file within `src/app`, deciding on folder structures for new domains, or evaluating if shared functionality needs to be relocated to the `shared/` or `core/` modules.
license: MIT
metadata:
  author: Code Dimension
  version: "1.0"
---

# Angular Architecture Guide for AIs

This document outlines the specific Angular architecture, file structure, and naming conventions used in this project. As an AI assistant, you MUST follow these guidelines when creating or modifying files to ensure consistency across the application.

## 1. High-Level Folder Structure

The application strictly separates global/singleton logic from feature-specific UI and routing.

```
src/app/
├── core/         # Global singletons, state, models, and layout
└── features/     # Routable feature domains with their UI components
└── shared/       # Shared components, services, pipes, models used by 2+ features
```

---

## 2. Core Module (`src/app/core/`)

The `core/` folder contains business logic, services, global state, guards, interceptors, and application-wide component layout (e.g., Navbar, Sidebar).

**Rule:** Everything in `core/` should be provided at the root level (`providedIn: 'root'`) or used globally.

### Structure inside `core/`

The code is grouped by **domain** rather than by technical type at the top level.

```
core/
├── [domain]/               # e.g., auth, dashboard, transaction, category
│   ├── services/           # Singleton services (e.g., transaction.service.ts)
│   ├── models/             # Interfaces and types for the domain
│   └── (other types if needed, like guards.ts, stores)
├── layout/                 # Global layout components
│   ├── base-layout/        # e.g., base-layout.ts, .html, .css
│   └── components/         # Base layout pieces like sidebar/, toolbar/
│       ├── [name].component.ts
│       ├── [name].component.html
│       └── [name].component.css
└── supabase/               # External service configuration/models
    ├── models/
    └── services/
```

---

## 3. Features Module (`src/app/features/`)

The `features/` folder contains the actual user-facing pages and specific UI components. These should never be imported by `core/` or other unrelated features.

**Rule:** If a component is only used within one domain (e.g., a "Transaction Form"), it belongs in `features/[domain]/components/`.

### Structure inside `features/`

Each feature is self-contained and exposes its own routing.

```
features/
└── [domain]/                     # e.g., transactions, categories, dashboard
    ├── components/               # Feature-specific components
    │   └── [component-name]/     # e.g., transaction-form/
    │       ├── [name].component.ts         # Logic (no .component suffix)
    │       ├── [name].component.html       # Template
    │       └── [name].component.css        # Styles
    ├── pages/                    # Routable page components
    │   └── [page-name]/          # e.g., transactions-page/
    │       ├── [name].component.ts
    │       ├── [name].component.html
    │       └── [name].component.css
    └── [domain].routes.ts        # Routes for this specific feature
```

---

## 4. Shared Module (`src/app/shared/`)

**Rule:** A Shared module should be created when the same functionality is being used on 2 or more features.

**Rule:** A Shared module MUST NOT be used by `core/`. If `core/` needs to use it, move the shared module to the `core/` module.

### Structure inside `shared/`

The shared module structure is the same as core and feature:

```
shared/
└── [domain]/                     # e.g., transactions, categories, dashboard
    ├── components/
    │   └── [component-name]/
    │       ├── [name].component.ts         # Logic
    │       ├── [name].component.html       # Template
    │       └── [name].component.css        # Styles
    └── services/
        └── [name].service.ts
    └── models/
        └── [name].model.ts
```

---

## 5. File Naming Conventions

This project MUST use standard classic Angular suffixes (`.component.ts`, `.service.ts`) for all files to ensure clarity and alignment with ecosystem tools.

1. **Components:** Named `[component-name].component.ts`.
   - Example: `sidebar.component.ts`.
2. **Services:** Named `[domain].service.ts`.
   - Example: `transaction.service.ts`.
3. **HTML/CSS:** Should match the basename of the `.ts` file exactly.
   - Example: `transaction-form.component.ts`, `transaction-form.component.html`, `transaction-form.component.css`.
4. **Routes:** Use `[domain].routes.ts`.
   - Example: `transactions.routes.ts`.

---

## 6. Coding Standards Checklist for AIs

When generating new code in this project:

- **Standalone Components:** DO NOT use `standalone: true`.
- **Imports:** Use absolute-like or relative paths correctly, keeping boundaries strict (Features can import from Core, but Core NEVER imports from Features).
- **State Management:** Prioritize using Angular **Signals** (`signal()`, `computed()`, `effect()`) for state over Observables/BehaviorSubjects.
- **Dependency Injection:** Use the `inject()` function pattern over constructor injection.
- **Forms:** Use signal-based forms (e.g., `form()`, `FormField`) when building inputs.
