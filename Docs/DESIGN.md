# Design System — SkillBridge AI

## Overview

This document defines the visual language, component tokens, and UX requirements for SkillBridge AI. Every UI implementation must follow this system to maintain consistency across all pages and states.

---

## Design Implementation

This design system is implemented using **shadcn/ui** (built on Radix UI primitives) + **Tailwind CSS 3.4**.

- **Design tokens** (colors, spacing, radii, shadows) are defined as CSS custom properties in the global stylesheet and mapped to the Tailwind config via `tailwind.config.ts`.
- **shadcn/ui components** (Button, Card, Input, Badge, Dialog, Select, Tabs, Toast, etc.) are the building blocks for all UI. They live in `frontend/src/components/ui/` and are fully owned by the project.
- **React Bits** ([reactbits.dev](https://reactbits.dev)) components provide animated, interactive micro-interactions (text animations, scroll effects, animated backgrounds, etc.) for visual polish.
- **Libraries.dev** ([libraries.dev](https://libraries.dev)) provides production-ready visual effect libraries (Beam, Orb, Gooey, Metal, Image) for premium UI effects.
- **Custom components** compose shadcn/ui primitives and React Bits / Libraries.dev effects — do not build raw HTML/CSS equivalents when a component from these sources exists.
- Use the **`cn()` utility** (from `frontend/src/lib/utils.ts`) for conditional class merging.

---

## Design Philosophy

- **Modern** — Clean lines, generous whitespace, contemporary aesthetics.
- **Professional** — Trustworthy and credible for an academic/career tool.
- **Data-rich but uncluttered** — Present complex information (fit scores, skill graphs, trends) without overwhelming the user.
- **Accessible** — WCAG 2.1 AA compliant. Works with keyboard navigation and screen readers.

---

## Typography

| Element | Font | Weight | Size |
|---|---|---|---|
| **Primary Font** | Inter | — | — |
| **Monospace Font** | JetBrains Mono | — | — |
| H1 (Page Title) | Inter | 700 (Bold) | 32px / 2rem |
| H2 (Section Title) | Inter | 600 (SemiBold) | 24px / 1.5rem |
| H3 (Subsection) | Inter | 600 (SemiBold) | 20px / 1.25rem |
| Body | Inter | 400 (Regular) | 16px / 1rem |
| Body Small | Inter | 400 (Regular) | 14px / 0.875rem |
| Caption | Inter | 400 (Regular) | 12px / 0.75rem |
| Button | Inter | 500 (Medium) | 14px / 0.875rem |
| Code / Data | JetBrains Mono | 400 | 14px / 0.875rem |

**Line height:** 1.5 for body text, 1.3 for headings.

---

## Color Palette

### Light Mode (Default)

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#6366F1` | Primary actions, links, active states |
| `--color-primary-hover` | `#4F46E5` | Primary hover state |
| `--color-primary-light` | `#EEF2FF` | Primary backgrounds, badges |
| `--color-secondary` | `#8B5CF6` | Secondary accents, graph highlights |
| `--color-success` | `#10B981` | Positive scores, matched skills, pass states |
| `--color-warning` | `#F59E0B` | Partial matches, medium scores |
| `--color-danger` | `#EF4444` | Missing skills, errors, destructive actions |
| `--color-info` | `#3B82F6` | Informational badges, tips |
| `--color-background` | `#F8FAFC` | Page background |
| `--color-surface` | `#FFFFFF` | Card, modal, panel backgrounds |
| `--color-border` | `#E2E8F0` | Borders, dividers |
| `--color-text-primary` | `#0F172A` | Primary text |
| `--color-text-secondary` | `#475569` | Secondary text, labels |
| `--color-text-muted` | `#94A3B8` | Placeholder, disabled, captions |

### Dark Mode

| Token | Hex | Usage |
|---|---|---|
| `--color-background` | `#0F172A` | Page background |
| `--color-surface` | `#1E293B` | Card, panel backgrounds |
| `--color-border` | `#334155` | Borders, dividers |
| `--color-text-primary` | `#F1F5F9` | Primary text |
| `--color-text-secondary` | `#CBD5E1` | Secondary text |
| `--color-text-muted` | `#64748B` | Placeholder, disabled |

Primary, success, warning, danger, and info colors remain the same in dark mode.

---

## Spacing Scale

Use a consistent 4px base unit:

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Small elements (badges, chips) |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Modals, large containers |
| `--radius-full` | 9999px | Avatars, circular elements |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Modals, popovers |
| `--shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Overlays |

---

## Components

### Buttons

| Variant | Background | Text Color | Border |
|---|---|---|---|
| **Primary** | `--color-primary` | `#FFFFFF` | none |
| **Secondary** | transparent | `--color-primary` | `1px solid --color-primary` |
| **Destructive** | `--color-danger` | `#FFFFFF` | none |
| **Ghost** | transparent | `--color-text-secondary` | none |
| **Disabled** | `--color-border` | `--color-text-muted` | none |

- Padding: `--space-2` vertical, `--space-4` horizontal
- Border radius: `--radius-md`
- Font weight: 500
- Hover: darken background by 10%, slight scale(1.02) transform
- Active: scale(0.98)
- Transition: `all 150ms ease`

### Cards

- Background: `--color-surface`
- Border: `1px solid --color-border`
- Border radius: `--radius-lg`
- Padding: `--space-6`
- Shadow: `--shadow-sm`, elevate to `--shadow-md` on hover
- Transition: `box-shadow 200ms ease, transform 200ms ease`

### Inputs

- Background: `--color-surface`
- Border: `1px solid --color-border`
- Border radius: `--radius-md`
- Padding: `--space-2` vertical, `--space-3` horizontal
- Focus: `2px solid --color-primary` outline with `--color-primary-light` ring
- Error: `1px solid --color-danger` border with error message below

### Badges / Chips

- Padding: `--space-1` vertical, `--space-2` horizontal
- Border radius: `--radius-sm`
- Font size: Caption (12px)
- Variants: primary, success, warning, danger, neutral (matching color tokens)

### Score Display

For fit scores (0–100):

| Range | Color | Label |
|---|---|---|
| 80–100 | `--color-success` | Excellent Match |
| 60–79 | `--color-info` | Good Match |
| 40–59 | `--color-warning` | Partial Match |
| 0–39 | `--color-danger` | Low Match |

Display as a circular progress indicator with the score number centered.

---

## Layout

### Breakpoints

| Name | Width | Target |
|---|---|---|
| `mobile` | 375px – 767px | Phones |
| `tablet` | 768px – 1023px | Tablets |
| `desktop` | 1024px – 1439px | Laptops |
| `wide` | 1440px+ | Desktops |

### Grid

- Max content width: 1280px
- Sidebar width: 260px (collapsible on mobile)
- Page padding: `--space-6` (desktop), `--space-4` (mobile)
- Column gap: `--space-6`

### Navigation

- **Desktop**: Fixed left sidebar with icon + label nav items.
- **Tablet**: Collapsed sidebar (icons only), expandable on hover.
- **Mobile**: Bottom navigation bar with 4–5 primary destinations. Full menu via hamburger overlay.

---

## UX Requirements

### Every page must include:

1. **Loading state** — Skeleton placeholders matching the content layout. Never show a blank page.
2. **Empty state** — Friendly illustration + message + call-to-action (e.g., "No resumes uploaded yet. Upload your first resume to get started.").
3. **Error state** — Clear error message + retry action. Never show raw error codes to the user.
4. **Mobile responsive** — All features usable on 375px width.

### Forms

- Inline validation on blur.
- Clear error messages below the field.
- Submit button disabled until all required fields are valid.
- Loading spinner on submit button during async operations.
- Success toast notification on completion.

### Animations & Transitions

- Page transitions: fade-in (`opacity 0→1, translateY 8px→0`) over 300ms.
- Card hover: subtle lift (`translateY -2px`) + shadow elevation.
- Score reveal: count-up animation from 0 to final score over 800ms.
- Skeleton loading: shimmer animation (gradient sweep left-to-right).
- Toast notifications: slide in from top-right, auto-dismiss after 4 seconds.
- Modal open: fade + scale(`0.95→1`) over 200ms.

### Accessibility

- All interactive elements must be keyboard navigable.
- Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text.
- Form inputs must have associated labels.
- Images must have alt text.
- Focus indicators must be visible.
- ARIA labels on icon-only buttons.

---

## Key Pages

| Page | Primary Content |
|---|---|
| **Login / Signup** | Auth form, centered card layout |
| **Dashboard** | Market insights cards, recent activity, quick actions |
| **Job Explorer** | Search bar, filter sidebar, job listing cards, trend charts |
| **Resume Analyzer** | Upload area, fit score display, matched/missing skills, download button |
| **Mock Interview** | Chat-style interface, question display, answer input, feedback panel |
| **Profile / Settings** | Account info, preferences, uploaded resumes list |
