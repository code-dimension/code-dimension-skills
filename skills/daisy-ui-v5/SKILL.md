---
name: daisy-ui-v5
description: daisyUI v5 UI components, layout, and theming guidelines. Triggers whenever creating html/css/template files
license: MIT
metadata:
  author: Code Dimension
  version: "1.0"
---

## 🎨 Colors and Theming

- **DO NOT use the Tailwind `dark:` directive** for colors. daisyUI manages dark mode automatically through its semantic variables.
- ALWAYS use daisyUI color names to maintain theme compatibility: `primary`, `secondary`, `accent`, `neutral`, `base-100` (background), `base-200`, `base-300`, `info`, `success`, `warning`, `error`.
- For text on these colors, use the `-content` variation (e.g., `text-primary-content` on a `bg-primary` background).
- Use `base-*` colors for most of the layout and reserve `primary` and `secondary` for prominent elements and interactions.

## 🏗️ UI Composition and Classes Rules

1. **Style Hierarchy**: ALWAYS prefer native daisyUI classes (`component` -> `part` -> `modifier`). Use Tailwind utility classes only for specific layout customizations (`flex`, `grid`, margins, paddings) or when daisyUI doesn't offer the desired behavior.
2. **Specificity**: If a Tailwind utility class doesn't apply over a daisyUI component, use the `!` importance modifier as a last resort (e.g., `btn bg-red-500!`).
3. **Responsiveness**: Layouts using `flex` or `grid` must be responsive using Tailwind prefixes (`sm:`, `md:`, `lg:`).
4. **Best Practices**:
   - Avoid adding `bg-base-100 text-base-content` directly to the `<body>` unless strictly necessary.
   - Do not add custom fonts unless explicitly requested.
   - If placeholder images are needed, use: `https://picsum.photos/{width}/{height}`.

## 🎯 Output Instructions

Whenever the user requests a component or layout:

1. Return ONLY valid and semantic HTML/CSS code.
2. Ensure the HTML structure respects the mandatory parts of each component.
3. Prioritize accessibility (e.g., `tabindex`, `aria-label`, `role="button"` when applying `btn` classes on non-native button elements).

---

## 📚 Reference Library: daisyUI 5 Components and Variations

Use the snippets below as the strict baseline for building interfaces.

### Accordion & Collapse

```html
<div class="collapse collapse-arrow bg-base-200">
  <input type="radio" name="my-accordion" checked="checked" />
  <div class="collapse-title text-xl font-medium">Item 1</div>
  <div class="collapse-content"><p>Content 1</p></div>
</div>

<div class="collapse collapse-plus bg-base-200">
  <input type="checkbox" />
  <div class="collapse-title">Show Details</div>
  <div class="collapse-content"><p>Hidden content</p></div>
</div>
```

### Alert

```html
<div role="alert" class="alert alert-info">New message!</div>
<div role="alert" class="alert alert-success">Operation completed.</div>
<div role="alert" class="alert alert-error">Connection failed.</div>

<div role="alert" class="alert alert-outline alert-warning">
  Outline Warning
</div>
<div role="alert" class="alert alert-soft alert-info">Soft Info</div>
<div role="alert" class="alert alert-dash">Dash Warning</div>

<div role="alert" class="alert sm:alert-horizontal alert-vertical">...</div>
```

### Avatar

```html
<div class="avatar">
  <div class="w-24 mask mask-squircle">
    <img
      src="[https://picsum.photos/200/200](https://picsum.photos/200/200)"
      alt="Avatar"
    />
  </div>
</div>

<div class="avatar avatar-online">
  <div class="w-16 rounded-full"><img src="..." /></div>
</div>
<div class="avatar avatar-placeholder">
  <div class="bg-neutral text-neutral-content w-16 rounded-full">
    <span class="text-xl">AI</span>
  </div>
</div>

<div class="avatar-group -space-x-6">
  <div class="avatar">
    <div class="w-12"><img src="..." /></div>
  </div>
  <div class="avatar avatar-placeholder">
    <div class="w-12 bg-neutral"><span>+99</span></div>
  </div>
</div>
```

### Badge

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-accent">Accent</span>

<span class="badge badge-outline badge-lg">Large Outline</span>
<span class="badge badge-soft badge-sm">Small Soft</span>
<span class="badge badge-dash badge-xs">Extra Small Dash</span>
```

### Button

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>

<button class="btn btn-outline btn-info">Outline Info</button>
<button class="btn btn-dash btn-success">Dash Success</button>
<button class="btn btn-soft btn-warning">Soft Warning</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>

<button class="btn btn-lg btn-wide">Wide and Large</button>
<button class="btn btn-block">Full width</button>
<button class="btn btn-circle btn-sm">X</button>
<button class="btn btn-square">[]</button>
```

### Card

```html
<div class="card w-96 bg-base-100 shadow-xl">
  <figure><img src="..." alt="..." /></figure>
  <div class="card-body">
    <h2 class="card-title">Title</h2>
    <p>Card description.</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>

<div class="card card-side bg-base-200">...</div>
<div class="card image-full">...</div>
<div class="card card-border card-dash">...</div>
```

### Chat Bubble

```html
<div class="chat chat-start">
  <div class="chat-image avatar">
    <div class="w-10 rounded-full"><img src="..." /></div>
  </div>
  <div class="chat-bubble chat-bubble-primary">Hello, how can I help?</div>
</div>

<div class="chat chat-end">
  <div class="chat-bubble chat-bubble-info">I need some code.</div>
  <div class="chat-footer opacity-50">Seen at 12:46</div>
</div>
```

### Divider

```html
<div class="divider">Default</div>
<div class="divider divider-primary">With Color</div>
<div class="divider divider-horizontal divider-start">Horizontal (Start)</div>
```

### Drawer (Sidebar Layout)

```html
<div class="drawer lg:drawer-open">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />

  <div class="drawer-content flex flex-col items-center justify-center">
    <label for="my-drawer" class="btn btn-primary drawer-button lg:hidden"
      >Open Menu</label
    >
  </div>

  <div class="drawer-side">
    <label
      for="my-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
    ></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <li><a>Home</a></li>
      <li><a>Settings</a></li>
    </ul>
  </div>
</div>
```

### Dropdown

```html
<details class="dropdown dropdown-bottom dropdown-end">
  <summary class="btn m-1">Menu</summary>
  <ul
    class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
  >
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</details>

<button popovertarget="my-popover" style="anchor-name:--anchor">Open</button>
<ul
  class="dropdown-content menu shadow"
  popover
  id="my-popover"
  style="position-anchor:--anchor"
>
  <li><a>Action 1</a></li>
</ul>
```

### Fieldset & Forms (Inputs, Textarea, Select)

```html
<fieldset class="fieldset border border-base-300 p-4 rounded-box">
  <legend class="fieldset-legend">Personal Data</legend>

  <label class="floating-label">
    <input
      type="text"
      placeholder="John Doe"
      class="input input-primary w-full"
    />
    <span>Full Name</span>
  </label>

  <label class="input input-bordered w-full">
    <span class="label">Email</span>
    <input type="email" placeholder="dev@example.com" />
  </label>

  <select class="select select-bordered select-sm w-full">
    <option disabled selected>Choose an option</option>
    <option>Frontend</option>
  </select>

  <textarea class="textarea textarea-soft" placeholder="Your bio"></textarea>

  <p class="label text-error">This field is required.</p>
</fieldset>
```

### Form Toggles (Checkbox, Radio, Toggle)

```html
<input type="checkbox" class="checkbox checkbox-primary checkbox-md" />
<input type="radio" name="options" class="radio radio-secondary" />
<input
  type="checkbox"
  class="toggle toggle-success toggle-lg"
  checked="checked"
/>
```

### Hover 3D & Hover Gallery

```html
<div class="hover-3d w-64 h-64">
  <figure class="w-full h-full rounded-xl bg-primary"><img src="..." /></figure>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>

<figure class="hover-gallery max-w-sm">
  <img src="img1.jpg" /><img src="img2.jpg" /><img src="img3.jpg" />
</figure>
```

### Join (Group Elements)

```html
<div class="join">
  <input class="input input-bordered join-item" placeholder="Search..." />
  <button class="btn join-item rounded-r-full">Go</button>
</div>

<div class="join join-horizontal">
  <button class="join-item btn btn-active">1</button>
  <button class="join-item btn">2</button>
  <button class="join-item btn">3</button>
</div>
```

### Loading

```html
<span class="loading loading-spinner loading-md"></span>
<span class="loading loading-dots loading-lg text-primary"></span>
<span class="loading loading-bars loading-sm text-info"></span>
<span class="loading loading-infinity loading-xl text-error"></span>
```

### Modal

```html
<button class="btn" onclick="my_modal_1.showModal()">Open Modal</button>
<dialog id="my_modal_1" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Attention!</h3>
    <p class="py-4">Are you sure you want to continue?</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-error">Cancel</button>
        <button class="btn btn-success">Confirm</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
```

### Navbar

```html
<div class="navbar bg-base-100 shadow-sm">
  <div class="navbar-start">
    <div class="dropdown">...</div>
    <a class="btn btn-ghost text-xl">Logo</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a>Home</a></li>
      <li><a>About</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <a class="btn btn-primary">Login</a>
  </div>
</div>
```

### Progress & Radial Progress

```html
<progress
  class="progress progress-primary w-56"
  value="40"
  max="100"
></progress>
<progress class="progress progress-error w-56"></progress>
<div
  class="radial-progress text-success"
  style="--value:70;"
  aria-valuenow="70"
  role="progressbar"
>
  70%
</div>
```

### Skeleton (Layout Loading)

```html
<div class="flex flex-col gap-4 w-52">
  <div class="skeleton h-32 w-full"></div>
  <div class="skeleton skeleton-text h-4 w-28"></div>
  <div class="skeleton skeleton-text h-4 w-full"></div>
</div>
```

### Stat (Statistics)

```html
<div class="stats stats-vertical lg:stats-horizontal shadow">
  <div class="stat">
    <div class="stat-title">Revenue</div>
    <div class="stat-value text-primary">$ 90K</div>
    <div class="stat-desc">21% increase compared to last month</div>
  </div>
  <div class="stat">
    <div class="stat-title">New Users</div>
    <div class="stat-value text-secondary">4,200</div>
    <div class="stat-actions">
      <button class="btn btn-sm btn-success">View list</button>
    </div>
  </div>
</div>
```

### Swap (Animated Toggle)

```html
<label class="swap swap-rotate">
  <input type="checkbox" />
  <div class="swap-on text-4xl">☀️</div>
  <div class="swap-off text-4xl">🌙</div>
</label>
```

### Tabs

```html
<div role="tablist" class="tabs tabs-box">
  <input
    type="radio"
    name="my_tabs_1"
    role="tab"
    class="tab"
    aria-label="Tab 1"
  />
  <div role="tabpanel" class="tab-content p-10">Tab 1 Content</div>

  <input
    type="radio"
    name="my_tabs_1"
    role="tab"
    class="tab"
    aria-label="Tab 2"
    checked="checked"
  />
  <div role="tabpanel" class="tab-content p-10">Tab 2 Content</div>
</div>
```

### Theme Controller (Theme Swap)

```html
<input
  type="checkbox"
  value="synthwave"
  class="theme-controller toggle toggle-primary"
/>
```
