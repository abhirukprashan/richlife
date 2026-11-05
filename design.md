# Rich Life Christmas Cheese Box — Design

A one-page festive shop where people build a box of Rich Life cheese, or pick
a ready-made gift box, and order it on WhatsApp. This document describes how
the site looks and behaves, and the rules to keep when changing it.

## Principles

- **Rich Life first.** Rich Life blue leads every surface. Christmas comes
  through motion and accents (snow, lights, gold, pine), not competing colours.
- **Real products, real milk.** Show the actual packs, cut out cleanly, never
  illustrations or made-up packaging. Milk and dairy carry the mood.
- **One view, no hunting.** The box and the product list are always visible
  together; ordering is one tap on a floating WhatsApp button.
- **Joyful, never noisy.** Motion is soft and slow, and everything stills for
  people who prefer reduced motion.

## Page structure

| Order | Section | File |
|---|---|---|
| 0 | Loading screen (milk fills, then lifts away) | `index.html`, `src/BootLoader.ts` |
| 1 | Top bar: days-to-Christmas countdown, `#RichLifeChristmas` | `src/App.tsx` |
| 2 | Header: centred Rich Life logo, string lights below | `src/App.tsx` |
| 3 | Hero: headline, Rich Life range standing in rolling milk | `src/Hero.tsx` |
| 4 | Builder (`#builder`): live box + cheese list | `src/App.tsx` |
| 5 | Ready to gift (`#premade`): three photographed gift boxes | `src/App.tsx` |
| 6 | Footer | `src/App.tsx` |
| — | Floating WhatsApp order button + packing animation | `src/App.tsx` |
| — | Full-page snowfall | `src/Snowfall.tsx` |

## Colour

All colours are defined inline in Tailwind classes or `src/index.css`.

| Role | Hex | Used for |
|---|---|---|
| Rich Life navy | `#13306b` | Text, dark sections, footer base, buttons |
| Rich Life blue | `#2a5bc0` | Accents, labels, badges, highlights |
| Loader blue | `#0b1f8f` | Loading screen, hero sky base |
| Sky light | `#1aa6ea` | Hero glow |
| Ice blue | `#8fc3ff` / `#cfe0f7` / `#bfe6ff` | Lights, ribbons, hero accent text |
| Milk | `#ffffff` → `#e6f1ff` | Milk waves, loader milk |
| Cream | `#f7f2e8` | Page background |
| Card | `#fffaf1` | Builder panel, product cards |
| Gold | `#e8c15a` | Sparkles, bulbs |
| Pine | `#1d5c45` | Top-bar and footer stripes, bulbs |
| WhatsApp green | `#1fa855` (hover `#178f47`) | Order buttons only |

Rules:
- No red anywhere. Christmas accents use blue, gold, pine and white.
- WhatsApp green is reserved for ordering actions.
- Text on blue is white; text on cream is navy.

## Typography

Loaded from Google Fonts in `index.html` (with `preconnect`).

| Style | Font | Use |
|---|---|---|
| Display | DM Serif Display | Headlines, section titles, gift box names |
| Body / UI | DM Sans 400–700 | Everything else |
| Label | DM Sans 700, 10–12px, uppercase, 0.14–0.2em tracking | Kickers, brand names on cards, pills |

- Hero title: `clamp(2.9rem, 6.4vw, 5.6rem)`, tight leading (0.95); the
  "Merry Christmas." line is italic, ice blue, 72% size, never wraps.

## Layout and breakpoints

| Width | Behaviour |
|---|---|
| ≤ 640px (phone) | Single column. Box height adapts (`clamp(240px, 100svh − 550px, 420px)`) so box, tabs and a row of cards fit above the WhatsApp bar. Box items use a 3-column layout. WhatsApp button becomes a full-width bottom bar. |
| 641–1099px | Box keeps the photo's 3:2 shape; cards scroll horizontally below it. |
| ≥ 1100px | Box (left) and a two-column, scrolling product list (right) side by side, both sized to the screen height. |

- Page content max width 1440px; side gutter 16–20px on phones.
- The builder panel always hugs the box width.

## Components

### Loading screen
Rich Life blue with the centred logo (no other text). A stream of milk pours
from the top; the milk level follows real loading progress (page, fonts,
first-view images). When ready the milk fills the screen, the pour stops and
the screen lifts away with a wavy milk edge.
- Shown at least 1.4s, at most 6s. Scrolling is locked until it lifts.
- Waves are inline SVG, never tiled background images (those leave seam lines).

### Hero
- Centred: kicker pill, three-line headline, one-line description. No buttons
  and no Rich Life logo.
- Rich Life products stand in rolling milk: milk cartons and flavoured milks at
  the back, Kiri Pani in the middle, cheeses in front. Each item is **partly
  submerged** — its lower part sits under the front wave, never fully hidden.
  Positions live in `heroProducts` in `src/Hero.tsx` (`bottom` in px). Phones
  scale the whole cluster up by `1.5`, hide `mobileHidden` items, and can move
  an item with `mobileX`.

### Builder
- The box is a photo of an open wooden box of paper shred on pine.
- Products are added with **+**, by dragging a card (mouse drag, or
  press-and-hold on touch), and can be rearranged inside the box freely.
- Cards show **− count +** once a product is in the box. Tapping an item in
  the box reveals its × remove button.
- The item counter pill bounces on change; products pop in with a bounce.

### Ready to gift
Three cheese-only boxes shown as photographed composites (real cut-outs packed
into the gift box photo with shadows). A Rich Life blue gift wrap with a white
ribbon, bow and centred logo tag slides apart as each card scrolls into the
middle of the screen. The green button orders that box on WhatsApp at its
bundle price.

### WhatsApp ordering
Floating button shows item count and total. Tapping plays a white packing
overlay (items drop into a Rich Life blue box, lid closes, ribbon and bow, logo
stamp) for 3s, then opens WhatsApp with the itemised order. The number is set
in `WHATSAPP_NUMBER` in `src/App.tsx` (empty = WhatsApp asks for a contact).

### Festive details
- **String lights** under the header, along the top of Ready to gift and the
  footer. Each bulb hangs from its own swag of wire. Not used inside the box.
- **Snow** falls over the whole page (canvas, above content, never blocks clicks).
- **Footer**: navy with a blue/white/pine candy stripe, logo, cheese list and
  ordering notes.

## Motion

| Element | Duration | Easing |
|---|---|---|
| Hover lifts, button feedback | 160–220ms | ease |
| Products popping into the box | 520ms | overshoot (`0.3, 1.6, 0.5, 1`) |
| Gift wrap opening | 1100ms | `0.65, 0, 0.25, 1` |
| Loader lift | 1100ms | `0.7, 0, 0.2, 1` |
| Ambient loops (waves, bobbing, twinkling, glow) | 1.6–14s | linear / ease-in-out |

- Nothing flashes or moves fast; loops are slow and small.
- `prefers-reduced-motion`: ambient loops stop, the loader fades instead of
  pouring and lifting, and the packing overlay shortens to 0.6s.

## Imagery

| Folder | Content | Size |
|---|---|---|
| `public/products/` | Product cut-outs (transparent WebP) | ≤ 400px, ~15–40 KB |
| `public/hero/` | Rich Life milk range cut-outs for the hero | ≤ 400px |
| `public/gift-boxes/` | Gift box composites (`*.webp` 1080px, `*-640.webp`) | ~80–180 KB |
| `public/box-backdrop*.webp` | Builder box photo (1200px and 800px) | 103–182 KB |

- Cut-outs: background removed, trimmed, convex outline kept so pale lids and
  rims survive; watermarks below the pack are dropped.
- Responsive `srcset` on the backdrop and gift photos; below-the-fold images
  load lazily; the backdrop and logo are preloaded.
- All `public/` files are normal git files (not Git LFS) so hosts like Vercel
  serve them.

### Sources and rights
Product photos come from retailer listings (Lassana, SPAR2U, Veena's, Kapruka)
and richlife.lk; the box and pine photos from Unsplash. Lassana marks its
images as copyrighted and Veena's photos carry a small watermark on the pack.
**Before launch, replace retailer photos with official Rich Life packshots, or
get permission.**

## Accessibility

- Decorative layers (snow, lights, waves, wrap) are `aria-hidden`.
- Gift box photos and product images have descriptive `alt` text.
- Focus is visible (2px outline); all controls are buttons or links.
- Touch targets are at least 32px; drag has tap alternatives (+ / − / ×).

## Content notes

- Prices are in LKR, from current store listings; bundle prices sit below the
  sum of their items. Confirm all prices before launch.
- Only cheeses are Rich Life in the builder; the hero shows the wider Rich Life
  dairy range.
