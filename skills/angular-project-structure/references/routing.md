# Routing Reference

Where routes live and how modules nest. Routes are the boundary that makes a feature a module.

## Route file placement

- `app.routes.ts` — the root router. Only wires top-level features via lazy loading.
- `features/<feature-name>/routes.ts` — the module's routes: its slices, sub-routes, guards, and resolvers. This is the only file allowed at a feature's root.
- Every URL-accessible component inside a module gets a route here — never a new root-level folder in `features/`.

## Root router

```ts
// app.routes.ts
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/routes').then(m => m.CHECKOUT_ROUTES),
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/routes').then(m => m.REPORTS_ROUTES),
  },
];
```

## Feature routes

```ts
// features/checkout/routes.ts
import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'cart' },
      {
        path: 'cart',
        loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
      },
      {
        path: 'payment',
        loadComponent: () => import('./payment/payment-form.component').then(m => m.PaymentFormComponent),
        canActivate: [() => import('./payment/payment.guard').then(m => m.paymentGuard)],
      },
    ],
  },
];
```

Notes:

- Sub-routes are nested inside the module — a new page in checkout is a new child route, not a new folder in `features/`.
- A shell/layout component used by the module's routes lives in a slice of that feature, e.g. `features/checkout/shell/checkout-shell.component.ts`.
- Guards, resolvers, and services used by a route live in the same slice as the route's component.

## Extracting a module

Use this when a resource escapes its module's scope:

| Situation | Action |
|---|---|
| New page reachable under an existing module's URL space | Add a nested route to that module's `routes.ts`, component in a slice of that module |
| Resource belongs to a different domain (e.g. `sales-report` inside `checkout`) | Create a **new module** in `features/` with its own `routes.ts`, and wire it from `app.routes.ts` (or nest it under a parent feature's `loadChildren` if it is a sub-flow) |
| Piece is generic and needed by two features | Move it to `shared/` (UI, pipes, generic services) — never import one feature from another |
| Piece is used at bootstrap or by `app.{ts\|html}` | Move it to `core/` |

A new module is a new folder `features/<new-name>/` with `routes.ts` plus its slices. Do not create root-level folders outside `core/`, `features/`, and `shared/`.