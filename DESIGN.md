---
name: Zion Dark Mode
colors:
  primary: '#6657ec'
  primary-content: '#ffffff'
  secondary: '#374151'
  secondary-content: '#ffffff'
  accent: '#db2777'
  accent-content: '#ffffff'
  neutral: '#2a323c'
  base-100: '#1d232a'
  base-200: '#191e24'
  base-content: '#a6adbb'
  info: '#1d4ed8'
  success: '#16a34a'
  warning: '#facc15'
  error: '#e14545'
  slate-400: '#94a3b8'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 1.25
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 1.25
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
  body-bold:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  2xl: 1rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
---

# Design System: Zion Dark Mode

## 1. Visual Theme & Atmosphere

The dark mode visual language is modern, technical, and immersive, optimized for high-end educational content about engineering and programming. The atmosphere relies on deep dark backgrounds (`bg-base-100` and `bg-base-200`) contrasted with neon-like vibrant accents, specifically the Angular pink-to-violet gradient and primary solid violet.

The design philosophy leans heavily into glassmorphism and subtle transparencies. Cards and containers often use `bg-base-200/30` with delicate borders (`border-base-content/5`) to create depth without relying on heavy shadows. The overall mood is "premium developer tool," balancing readability with striking visual cues.

## 2. Color Palette & Roles

### Primary Foundation

- **Base 100** (`#1d232a`): The deepest background color, used for alternating sections and the main canvas.
- **Base 200** (`#191e24`): Slightly lighter dark background, used for cards and floating containers, often with transparency (`/30`).
- **Base Content** (`#a6adbb`): Muted text color for secondary text, often used for subtle borders at low opacity (`/5` or `/10`).

### Accent & Interactive

- **Primary Violet** (`#6657ec`): The main brand color for buttons, active states, and highlights. Often used as a transparent background (`bg-primary/20`) for tags and icons.
- **Angular Gradient**: A striking linear gradient from `#e30a7b` to `#584bcd` used exclusively as a text fill for the word "Angular" to create a signature brand moment.
- **Secondary Slate** (`#374151`): Used for secondary tags and less prominent interactive elements.

### Typography & Text Hierarchy

- **White** (`#ffffff`): Used for all primary headings, titles, and high-emphasis text.
- **Slate 400** (`#94a3b8`): Used for body text, descriptions, and paragraphs, providing a soft contrast against the dark background that reduces eye strain compared to pure white.
- **Primary Text** (`#6657ec`): Used for uppercase kickers above headlines and specific keyword highlights.

### Functional States

- **Success** (`#16a34a`): Used for positive feedback and secure transaction notices.
- **Warning** (`#facc15`): Used for tags indicating specific technical stacks (e.g., Template Driven Forms).

## 3. Typography Rules

### Hierarchy & Weights

- **Font Family**: **Inter** is used universally across all text elements for its clean, technical legibility.
- **Hero & Section Titles**: Extremely bold (`font-bold`) and large (`text-3xl`, `text-4xl`, `text-5xl`), with tight line heights (`leading-tight`) to create impactful statements. Always rendered in white.
- **Kickers**: Small (`text-xs` or `text-sm`), uppercase, widely tracked (`tracking-widest`), and bold. Placed above main titles to provide context.
- **Body Text**: Relaxed line heights (`leading-relaxed`) and moderate sizing (`text-base` to `text-lg`). Usually rendered in `text-slate-400`.

### Spacing Principles

- Generous vertical rhythm between sections (typically `py-24`).
- Paragraphs and descriptions have ample line height to ensure readability of technical explanations.
- Inner padding within cards is spacious (e.g., `p-8`) to give content room to breathe.

## 4. Component Stylings

### Cards & Containers

- Cards use a semi-transparent dark background (`bg-base-200/30`) with a very subtle border (`border-base-content/5` or `border-base-content/10`).
- Corners are significantly rounded (`rounded-2xl`).
- Hover states subtly increase the background opacity (`hover:bg-base-200/50`) to provide interactive feedback without aggressive motion.

### Badges & Tags

- Tags use a soft background and text color combination (e.g., `bg-primary/20 text-primary` or `bg-secondary/20 text-secondary`).
- They are pill-shaped (`rounded-full`), small text (`text-sm`), and bold (`font-bold`), providing clear visual categorization without dominating the layout.

### Icons & Imagery

- Feature icons are placed inside rounded square containers (`w-12 h-12 rounded-lg` or `w-16 h-16 rounded-2xl`).
- These containers use the same soft background paradigm as tags (e.g., `bg-primary/10 text-primary`).
- Images are often housed in containers with subtle borders and significant corner rounding (`rounded-2xl`).

### Hero & Banners

- The hero section employs a large, blurred radial gradient background (`bg-radial from-indigo-500/40 via-violet-500/20 to-transparent`) to create an atmospheric glow behind the main text.

## 5. Layout Principles

### Grid & Structure

- The main container is constrained to a readable maximum width (`max-w-7xl`) and centered (`mx-auto`).
- Features and benefits are laid out using CSS Grid, typically collapsing to 1 column on mobile, 2 on tablets, and 3 on large screens (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

### Whitespace Strategy

- The design heavily leverages empty space. Major sections are separated by large margins (`mb-16`, `mb-24`).
- Text elements within sections are constrained in width (`max-w-2xl`, `max-w-4xl`) and centered to maintain ideal reading line lengths.

### Alignment & Visual Balance

- High-level sections (Hero, Section Headers) are aggressively center-aligned.
- Alternating content blocks (like features with images) use a zig-zag pattern (`lg:order-1`, `lg:order-2`), alternating text and image alignment to keep the user engaged while scrolling.

## 6. Design System Notes for Stitch Generation

### Language to Use

When prompting for this design system, describe the interface as: "A premium, dark mode developer tool aesthetic. Use deep backgrounds with glassmorphic cards. Use bright violet accents and soft slate-colored text. Elements should feel precise and technical but highly polished with rounded corners."

### Color References

- **Background**: Use `Base 100` (`#1d232a`) and `Base 200` (`#191e24`).
- **Cards**: Describe as "semi-transparent dark gray with a very faint border" (`bg-base-200/30 border-base-content/5`).
- **Text**: Use `White` for headings and `Slate 400` (`#94a3b8`) for body.
- **Accents**: Use `Primary Violet` (`#6657ec`) for buttons and active states.

### Component Prompts

- **Card**: "Create a dark feature card with rounded-2xl corners, a semi-transparent dark background, and a faint border. Inside, place a violet icon inside a softly tinted violet rounded box. Add a bold white title and slate-400 description text."
- **Tag**: "Create a small, rounded-full pill tag with a soft primary background (10-20% opacity) and primary text color."
- **Hero Title**: "Create a large, bold white title where one key keyword uses a linear gradient from pink to violet."

### Incremental Iteration

When applying this to new screens, start by setting the root background to dark. Build the typography hierarchy strictly in white and slate. Add cards using the glassmorphic dark pattern. Finally, inject the violet and gradient accents sparingly to draw the eye to key elements.
