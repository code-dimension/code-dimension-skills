# Structure Reference

Concrete applications of the mold, with correct and incorrect layouts.

## Full example tree

```
src/app/
├── app.ts                          # bootstrap component
├── app.html
├── app.routes.ts                   # wires features via loadChildren
├── app.config.ts                   # bootstrap config — stays in src/app/, never in core/
├── core/
│   ├── http/                       # resource: http (bootstrap-level)
│   │   └── interceptors/
│   │       ├── auth.interceptor.ts
│   │       └── error.interceptor.ts
│   └── layout/                     # resource: layout (rendered by app.html)
│       └── base/
│           ├── base-layout.component.ts
│           ├── base-layout.component.html
│           └── base-layout.component.scss
├── features/
│   ├── checkout/                   # module: checkout
│   │   ├── routes.ts               # lazy-loaded module routes
│   │   ├── cart/                   # slice: cart
│   │   │   ├── cart.component.ts
│   │   │   ├── cart.component.html
│   │   │   ├── cart.component.scss
│   │   │   └── cart.service.ts
│   │   └── payment/                # slice: payment
│   │       ├── payment-form.component.ts
│   │       ├── payment-form.component.html
│   │       └── payment.service.ts
│   └── reports/
│       ├── routes.ts
│       └── sales/
│           └── sales-report.component.ts
└── shared/
    ├── ui/                         # resource: ui widgets
    │   ├── button/
    │   │   └── button.component.ts
    │   └── pipes/
    │       └── currency.pipe.ts
    └── data/
        └── pagination.service.ts
```

> Rule: every file lives under a slice. A summary page for checkout, for example, belongs in a slice — `features/checkout/summary/checkout-summary.component.ts`. The only file allowed outside a slice is `features/<feature-name>/routes.ts`.

## Naming details

- `<name>.<type>.<ext>` — the type suffix is the discriminator: `cart.component.ts`, `cart.service.ts`, `highlight.directive.ts`, `auth.interceptor.ts`, `currency.pipe.ts`, `admin.guard.ts`, `user.resolver.ts`, `table-layout.component.ts`.
- `<type>` is free-form — it names the *kind* of resource. Use whatever kind you are creating; do not force everything into component/service.
- Template and style files repeat the full name: `cart.component.ts` → `cart.component.html` → `cart.component.scss`.
- Folders are kebab-case, file names are kebab-case.
- One resource per folder: `core/http/` holds http resources, not auth ones (those go in `core/auth/`).

## Correct vs incorrect

### Correct

```
features/reports/sales/sales-report.component.ts     ✅ slice groups related files
shared/ui/button/button.component.ts                 ✅ reused by features
core/http/interceptors/auth.interceptor.ts           ✅ bootstrap-level, registered in app.config
```

### Incorrect

```
features/sales-report.component.ts                   ❌ file floating at features/ root
features/checkout/reports-report/...                 ❌ resource outside checkout's scope
  → extract: features/reports/ with its own routes.ts
pages/                                               ❌ new root-level layer
features/checkout/components/cart.component.ts       ❌ slice = sub-domain (cart/), not a type bucket (components/)
shared/ui/../../features/checkout/cart.service.ts    ❌ shared importing features
core/layout/... importing shared/ui/button           ❌ core importing shared
features/a/... importing features/b/cart.service.ts  ❌ feature → feature
  → move to shared/ (generic) or extract a module (scoped behavior)
```

## Migration heuristic

When adding a file to an existing codebase that doesn't follow the mold yet, place the new file by the mold inside the nearest matching layer; do not reorganize unrelated files unless asked.