# 🌸 Spring Tools SaaS — Claude Code Project Brief

## Project Overview

Build a **bilingual (English + Korean) SaaS website** featuring 10 spring-themed productivity tools. Each tool exists as a standalone React component. The goal is a deployable, monetizable web app.

**Business Model:** Freemium SaaS — 2-3 free tools, rest behind a monthly subscription ($5-8/month or ₩6,900-₩9,900/month).

**Target Audience:** English-speaking users + Korean users (Korea-localized content, not just translations).

---

## Tech Stack (Recommended)

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Auth:** Clerk or Supabase Auth (simple, beginner-friendly)
- **Payments:** Stripe (Checkout Sessions + Customer Portal)
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics or Google Analytics
- **i18n:** next-intl or custom routing (`/en/...` and `/ko/...`)

---

## Tools Inventory (20 Components)

### English (10 tools)
| # | Tool Name | File | Free/Paid |
|---|-----------|------|-----------|
| 1 | Spring Garden Planner | `spring-garden-planner.jsx` | FREE |
| 2 | Lawn Care Cost Estimator | `lawn-care-estimator.jsx` | FREE |
| 3 | Spring Cleaning Checklist | `spring-cleaning-checklist.jsx` | FREE |
| 4 | Declutter Plan Generator | `declutter-plan-generator.jsx` | PAID |
| 5 | Allergy Season Prep Tool | `allergy-season-prep.jsx` | PAID |
| 6 | Couch to 5K Plan | `couch-to-5k-plan.jsx` | PAID |
| 7 | Outdoor Workout Generator | `outdoor-workout-generator.jsx` | PAID |
| 8 | Spring Capsule Wardrobe | `capsule-wardrobe-builder.jsx` | PAID |
| 9 | Spring Meal Prep Planner | `spring-meal-prep-planner.jsx` | PAID |
| 10 | Spring Pet Care Checklist | `spring-pet-care-checklist.jsx` | PAID |

### Korean (10 tools — fully localized)
| # | Tool Name | File |
|---|-----------|------|
| 1 | 봄 텃밭 플래너 | `kr-spring-garden-planner.jsx` |
| 2 | 정원 관리 비용 계산기 | `kr-lawn-care-estimator.jsx` |
| 3 | 봄맞이 대청소 체크리스트 | `kr-spring-cleaning-checklist.jsx` |
| 4 | 정리정돈 플래너 | `kr-declutter-plan.jsx` |
| 5 | 봄철 알레르기 대비 플래너 | `kr-allergy-prep.jsx` |
| 6 | 소파에서 5K까지 | `kr-couch-to-5k.jsx` |
| 7 | 아웃도어 운동 생성기 | (to be created — use English version structure) |
| 8 | 봄 캡슐 옷장 | (to be created — use English version structure) |
| 9 | 봄 식단 플래너 | (to be created — use English version structure) |
| 10 | 반려동물 봄 케어 | (to be created — use English version structure) |

**Note:** Korean tools #7-10 still need to be built. The English versions can be used as templates — translate UI text to Korean and adapt content for Korean context (Korean exercises, Korean food/recipes, Korean fashion, Korean pet care norms).

---

## Site Architecture

```
/
├── / (or /en)                    → English landing page
├── /ko                           → Korean landing page
├── /en/tools/garden-planner      → English tool page
├── /ko/tools/garden-planner      → Korean tool page
├── /en/tools/[slug]              → All English tools
├── /ko/tools/[slug]              → All Korean tools
├── /pricing                      → Pricing page (bilingual)
├── /auth/sign-in                 → Sign in
├── /auth/sign-up                 → Sign up
└── /api/stripe-webhook           → Stripe webhook handler
```

---

## Phase-by-Phase Build Plan

### Phase 1: Project Scaffold
1. Initialize Next.js project with App Router
2. Set up Tailwind CSS
3. Create the folder structure with `/en` and `/ko` route groups
4. Set up a shared layout with header/nav and language toggle
5. Import all 20 React components into the project
6. Create a tool registry (array of tool metadata: slug, name, description, component, free/paid, language)

### Phase 2: Landing Page
1. Build a responsive landing page showcasing all 10 tools
2. Each tool gets a card with: emoji, title, short description, "Try Free" or "Unlock" button
3. Language toggle in header (EN / 한국어)
4. Hero section with value proposition
5. Social proof section (can be placeholder for now)
6. CTA to sign up / start free

**Design direction:** Colorful, playful spring vibes — consistent with the tools themselves. Use the Fredoka One / Jua (Korean) font pairing from the tools. Gradient backgrounds, spring colors.

### Phase 3: Tool Pages
1. Each tool renders on its own page (`/en/tools/garden-planner`, etc.)
2. Free tools are accessible to everyone
3. Paid tools show a preview/teaser + paywall overlay for non-subscribers
4. "Upgrade to unlock all tools" CTA on paid tool pages

### Phase 4: Authentication
1. Add Clerk (or Supabase Auth) for user accounts
2. Sign up / sign in pages
3. Middleware to check auth status on paid tool pages
4. User profile page showing subscription status

### Phase 5: Stripe Payments
1. Create Stripe products:
   - Monthly plan: $7.99/month (or ₩9,900/month)
   - Annual plan: $59.99/year (or ₩79,000/year) — optional
2. Implement Stripe Checkout for subscription
3. Stripe webhook to update user subscription status
4. Stripe Customer Portal for subscription management (cancel, update card)
5. Gate paid tools based on subscription status

### Phase 6: SEO Optimization
1. Add metadata for every tool page:
   - Title: "Spring Garden Planner — Free Planting Schedule by Zone"
   - Description: Unique per tool
   - Open Graph images (can generate with @vercel/og)
2. Add structured data (JSON-LD) for each tool
3. Create a sitemap.xml
4. Add robots.txt
5. Korean pages should have proper `hreflang` tags linking to English equivalents

### Phase 7: Deploy & Launch
1. Deploy to Vercel (connect GitHub repo)
2. Custom domain (e.g., springtools.app or similar)
3. Set up Vercel Analytics
4. Test payment flow end-to-end
5. Submit to Google Search Console (both English and Korean)

---

## Free vs Paid Strategy

**Free tools (3):** Garden Planner, Lawn Care Estimator, Spring Cleaning Checklist
- These are the most SEO-friendly (high search volume keywords)
- They drive organic traffic
- They demonstrate value → convert to paid

**Paid tools (7):** Everything else
- More specialized, higher perceived value
- Show a preview (first section or blurred content) to tease the tool
- Clear upgrade CTA

---

## SEO Target Keywords

### English
- "spring garden planting schedule by zone"
- "lawn care cost calculator"
- "spring cleaning checklist printable"
- "couch to 5k plan free"
- "spring capsule wardrobe"
- "spring meal prep plan"
- "allergy season tips"

### Korean
- "봄 텃밭 파종 시기"
- "정원 관리 비용"
- "봄맞이 대청소 체크리스트"
- "미세먼지 알레르기 대비"
- "봄 캡슐 옷장 만들기"
- "봄 식단 추천"

---

## Design System

### Fonts
- **English:** Fredoka One (headers), Nunito (body)
- **Korean:** Jua (headers), Noto Sans KR (body)
- Load from Google Fonts

### Colors (Spring palette)
- Primary greens: #2e7d32, #43a047, #66bb6a
- Accent warm: #e65100, #ff8a65
- Accent pink: #ad1457, #ec407a
- Background gradients: Mix of #e8f5e9, #fff9c4, #fce4ec, #e0f7fa
- Each tool can have its own accent color (they already do in the prototypes)

### Components to Extract
- `Section` — numbered section wrapper (used in all tools)
- `Btn` — toggle/select button (used in all tools)
- `CheckItem` — checkable task item
- `ProgressBar` — completion progress
- `MiniStat` — small stat display

These are repeated across all 20 tools and should be extracted into shared components.

---

## Monetization Enhancements (Post-Launch)

1. **Affiliate links** — Capsule Wardrobe (fashion retailers), Meal Prep (grocery delivery), Garden Planner (seed/tool shops), Pet Care (pet supply stores)
2. **PDF export** — Paid feature: export any checklist/plan as a printable PDF
3. **Email capture** — Free users can save their email to get their plan emailed to them (builds mailing list)
4. **Seasonal expansion** — Summer Tools, Fall Tools, Winter Tools (4x the content, year-round revenue)

---

## Quick Start for Claude Code

Paste this into Claude Code to begin:

```
I'm building a bilingual SaaS website with 10 spring-themed productivity tools (English + Korean versions). I have all 20 React components ready as .jsx files.

Please help me:
1. Create a Next.js 14 project with App Router and Tailwind CSS
2. Set up bilingual routing (/en/... and /ko/...)
3. Create a landing page that showcases all 10 tools with a spring-themed design
4. Set up the tool pages where each component renders on its own route
5. Use Fredoka One + Nunito for English, Jua + Noto Sans KR for Korean

Start with the project scaffold and landing page. I'll provide the tool components as we go.
```

---

## Files Included

All `.jsx` files referenced above are the tool prototypes built in Claude.ai. They are standalone React components with no external dependencies beyond React hooks (`useState`, `useRef`). They use inline styles and Google Fonts.

To integrate them into Next.js:
1. Convert `export default function` to Next.js page components
2. Move Google Fonts to `next/font` or `layout.tsx`
3. Extract shared components (`Section`, `Btn`, `CheckItem`)
4. Add `'use client'` directive since they use React hooks

---

*Generated by Claude — Spring Tools SaaS Project Brief v1.0*
