# Netaspan — Custom Made Creativity

> *High-end cinematic digital experience for a creative digital agency.*

A premium landing page built with **Next.js 16**, **Framer Motion**, and a fully custom volumetric atmospheric engine. Designed to feel like flying through a digital sea of clouds.

---

## ✦ Live Preview

**[netaspan-web-design.vercel.app](https://netaspan-web-design.vercel.app)** *(deploy via Vercel)*

---

## ✦ Features

### 🌥 Cinematic Atmosphere System
- **Multi-layer global cloudscape** — 10+ independent cloud layers at different z-depths with individual parallax speeds, creating true volumetric depth
- **Sea of Clouds narrative** — scroll-driven "diving" sequence where the user pierces through cloud layers into the project world below
- **Mountain silhouette layers** — scroll-linked parallax mountain ranges that fade in and out during the cinematic transition

### ✦ Mist-Sync Navigation
- Custom `nav-burst` browser event fired on every nav link click
- Triggers a high-speed foreground cloud burst, simulating flight between sections
- Works on both desktop and mobile menus

### 🃏 Project Islands
- Floating glassmorphism cards with 3D perspective tilt via mouse tracking (`useSpring` + `rotateX/Y`)
- Magnetic typography that follows the cursor independently
- Scroll-linked fade, scale, and parallax entrance per card

### 📐 Responsive Design
- Full mobile/tablet/desktop breakpoint system (`sm:` / `lg:` Tailwind prefixes)
- Project cards reflow to centered, full-width on mobile
- Adaptive typography and spacing at every breakpoint

### ⚡ Performance
- All cloud animations use `transform-gpu` and `willChange: transform`
- `getStableValue` seeded determinism for SSR-safe hydration
- Framer Motion scroll transforms — no JS scroll listeners

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Animation | Framer Motion 12 |
| Styling | Tailwind CSS v4 |
| 3D / WebGL | React Three Fiber + Drei |
| Scroll | Lenis (smooth scroll) |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
| Language | TypeScript |

---

## ✦ Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page — sections, ProjectIsland, cloud parallax
│   ├── layout.tsx        # Root layout — Nav + Atmosphere (persistent)
│   └── globals.css       # Global styles, @keyframes drift animation
├── components/
│   ├── Atmosphere.tsx    # Global fixed cloud + mountain layer system
│   ├── Hero.tsx          # Hero section with layered clouds + animated logo
│   ├── Nav.tsx           # Navigation with Mist-Sync burst event
│   ├── CloudTransition.tsx
│   └── ui/
│       └── animated-shiny-text.tsx   # Gradient shimmer text component
public/
└── images/
    ├── cloud4.webp — cloud7.webp     # Cloud assets
    └── mountain1, mountain4, mountain5.webp
```

---

## ✦ Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Install & Run
```bash
# Clone the repository
git clone https://github.com/nuran-command/netaspan-web-design.git
cd netaspan-web-design

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm run start
```

---

## ✦ Deployment

This project is optimized for **Vercel** — zero configuration required.

1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click **"Add New Project"** → import `netaspan-web-design`
3. Click **Deploy** — live in under 2 minutes

Every `git push origin main` auto-deploys via Vercel CI.

---

## ✦ Key Architectural Decisions

**Why `Atmosphere` is in `layout.tsx`**
The atmospheric cloud system is mounted at the root layout level so it persists across route changes without remounting. This prevents the cloud drift animations from resetting during navigation.

**Why `overflow-hidden` was removed from sections**
Fixed-position cloud layers extend beyond section boundaries by design. `overflow-hidden` on Hero/About/Contact sections was clipping these layers at hard pixel edges, creating visible "division lines". Removing it allows clouds to bleed naturally between sections.

**Seeded determinism with `getStableValue`**
All cloud positions, sizes, and opacities are generated using a sine-based seed function so values are identical between server render and client hydration, preventing React hydration mismatches.

---

## ✦ Design System

| Token | Value |
|---|---|
| Primary | `#FF9F1C` (Amber Orange) |
| Background | `#0A2540` (Deep Navy) |
| Accent Text | `white` / `white/50` |
| Font | Inter, sans-serif |
| Border Radius (cards) | `48px` |
| Card Glass | `bg-[#0A2540]/90 border border-white/20` |

---

## ✦ License

Private project — © 2026 Netaspan Digital. All rights reserved.

---

*Built with precision. Deployed with purpose.*
