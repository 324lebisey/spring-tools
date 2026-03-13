# 🌸 Spring Tools — Claude Code Project Brief

## Project Overview

Build a **bilingual (English + Korean) website** featuring 10 spring-themed productivity tools. Each tool exists as a standalone React component. Deploy to **Vercel** with all tools free — build audience first, add payments later.

**Strategy:** Launch free on Vercel → build SEO traffic → grow audience → add Stripe when ready.

**Target Audience:** English-speaking users + Korean users (Korea-localized content, not just translations).

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (free tier — connect GitHub repo once, auto-deploys forever, no token renewal)
- **Analytics:** Google Analytics or Vercel Analytics (free)
- **i18n:** Custom routing with /en/... and /ko/... paths
- **Auth/Payments:** None yet (Phase 2, when traffic justifies it)

---

## Tools Inventory (20 Components)

### English (10 tools)
| # | Tool Name | File |
|---|-----------|------|
| 1 | Spring Garden Planner | spring-garden-planner.jsx |
| 2 | Lawn Care Cost Estimator | lawn-care-estimator.jsx |
| 3 | Spring Cleaning Checklist | spring-cleaning-checklist.jsx |
| 4 | Declutter Plan Generator | declutter-plan-generator.jsx |
| 5 | Allergy Season Prep Tool | allergy-season-prep.jsx |
| 6 | Couch to 5K Plan | couch-to-5k-plan.jsx |
| 7 | Outdoor Workout Generator | outdoor-workout-generator.jsx |
| 8 | Spring Capsule Wardrobe | capsule-wardrobe-builder.jsx |
| 9 | Spring Meal Prep Planner | spring-meal-prep-planner.jsx |
| 10 | Spring Pet Care Checklist | spring-pet-care-checklist.jsx |

### Korean (10 tools — fully localized)
| # | Tool Name | File |
|---|-----------|------|
| 1 | 봄 텃밭 플래너 | kr-spring-garden-planner.jsx |
| 2 | 정원 관리 비용 계산기 | kr-lawn-care-estimator.jsx |
| 3 | 봄맞이 대청소 체크리스트 | kr-spring-cleaning-checklist.jsx |
| 4 | 정리정돈 플래너 | kr-declutter-plan.jsx |
| 5 | 봄철 알레르기 대비 플래너 | kr-allergy-prep.jsx |
| 6 | 소파에서 5K까지 | kr-couch-to-5k.jsx |
| 7 | 야외 운동 생성기 | kr-outdoor-workout.jsx |
| 8 | 봄 캡슐 옷장 | kr-capsule-wardrobe.jsx |
| 9 | 봄 식단 플래너 | kr-meal-prep.jsx |
| 10 | 반려동물 봄 케어 | kr-pet-care.jsx |

---

## Site Architecture

```
/en                           → English landing page
/ko                           → Korean landing page
/en/tools/garden-planner      → English tool page
/ko/tools/garden-planner      → Korean tool page
/en/tools/[slug]              → All English tools
/ko/tools/[slug]              → All Korean tools
```

---

## Phase 1: Build & Deploy to Vercel (DO THIS NOW)

### Step 1: Project Scaffold
1. Initialize Next.js project with App Router
2. Set up Tailwind CSS
3. Create folder structure with /en and /ko route groups
4. Shared layout with header/nav and language toggle (EN / 한국어)
5. Import all 20 React components
6. Tool registry (array of metadata: slug, name, description, component, language)

### Step 2: Landing Page
1. Responsive landing page showcasing all 10 tools
2. Each tool = card with emoji, title, short description, "Try It" button
3. Language toggle in header
4. Hero section with value proposition
5. Mobile-responsive design

**Design direction:** Colorful, playful spring vibes. Use the Fredoka One / Jua (Korean) font pairing from the tools. Gradient backgrounds, spring colors.

### Step 3: Tool Pages
1. Each tool on its own page with clean URL
2. All tools free and accessible
3. Back-to-home navigation on each tool page

### Step 4: SEO
1. Unique title + description metadata per tool page
2. hreflang tags linking English ↔ Korean pages
3. sitemap.xml (Next.js can auto-generate this)
4. robots.txt
5. Open Graph images for social sharing

### Step 5: Deploy to Vercel
1. Push project to GitHub
2. Go to vercel.com → "Add New Project" → import your GitHub repo
3. Vercel auto-detects Next.js, configures everything
4. Click Deploy — site is live in ~30 seconds
5. Every future push to main auto-deploys (no tokens to renew!)
6. Optional: add custom domain later (e.g., springtools.app)

### Step 6: Analytics + Search Console
1. Add Google Analytics or Vercel Analytics
2. Submit site to Google Search Console
3. Submit sitemap for both English and Korean pages
4. Monitor which tools get the most traffic

---

## Phase 2: Monetize (LATER — when you have traffic)

1. Add Clerk auth (user accounts)
2. Add Stripe ($7.99/month or ₩9,900/month subscription)
3. Gate 7 tools behind paywall, keep 3 free as traffic drivers
4. Add PDF export as paid feature
5. Optional: custom domain (springtools.app)

---

## SEO Target Keywords

### English
- spring garden planting schedule by zone
- lawn care cost calculator
- spring cleaning checklist
- couch to 5k plan free
- spring capsule wardrobe
- outdoor workout generator
- spring meal prep plan
- allergy season tips
- spring pet care checklist

### Korean
- 봄 텃밭 파종 시기
- 정원 관리 비용
- 봄맞이 대청소 체크리스트
- 미세먼지 알레르기 대비
- 봄 캡슐 옷장 만들기
- 봄 식단 추천
- 봄 반려동물 관리
- 5K 러닝 플랜

---

## Design System

### Fonts
- English: Fredoka One (headers), Nunito (body)
- Korean: Jua (headers), Noto Sans KR (body)

### Colors (Spring palette)
- Greens: #2e7d32, #43a047, #66bb6a
- Warm: #e65100, #ff8a65
- Pink: #ad1457, #ec407a
- Backgrounds: #e8f5e9, #fff9c4, #fce4ec, #e0f7fa

### Shared Components to Extract
- Section — numbered section wrapper
- Btn — toggle/select button
- CheckItem — checkable task
- ProgressBar — completion progress
- MiniStat — small stat display

---

## Quick Start Prompt for Claude Code

```
I'm building a bilingual website (English + Korean) with 10 spring-themed
productivity tools per language (20 React components total). Deploy to Vercel.

Please help me:
1. Create a Next.js 14 project with App Router
2. Set up Tailwind CSS
3. Set up bilingual routing (/en/ and /ko/)
4. Create a landing page showcasing all 10 tools with spring-themed design
5. Set up tool pages where each component renders on its own route
6. Use Fredoka One + Nunito for English, Jua + Noto Sans KR for Korean
7. Make sure it's ready to deploy to Vercel (just connect GitHub repo)

Start with the project scaffold and landing page. I have all 20 .jsx components ready.
```

---

## Integrating the Tool Components

All .jsx files are standalone React components using:
- React hooks (useState, useRef)
- Inline styles
- Google Fonts via link tags

To integrate into Next.js:
1. Add 'use client' directive at top of each file
2. Move Google Fonts to layout.tsx or next/font
3. Extract shared components into /components folder
4. Create a page file per tool that imports the component

---

## Vercel Deploy Checklist

- [ ] Project pushed to GitHub
- [ ] Vercel account created (free tier)
- [ ] GitHub repo imported into Vercel
- [ ] Build succeeds (Vercel auto-detects Next.js)
- [ ] All pages load correctly
- [ ] Language toggle works (EN ↔ 한국어)
- [ ] Google Analytics added
- [ ] Submitted to Google Search Console
- [ ] Sitemap submitted
- [ ] Tested on mobile

---

## Why Vercel over GitHub Pages

- Connect once, auto-deploys forever (no token renewal!)
- Built for Next.js (Vercel made Next.js)
- Free tier is generous for new sites
- Serverless functions included (needed for Stripe later)
- Preview deployments for every PR
- Global edge network = fast in US and Korea
- Easy custom domain when ready

---

## Future Monetization Ideas

1. Stripe subscriptions for premium tools
2. Affiliate links (무신사, 쿠팡, 마켓컬리, Uniqlo, Amazon)
3. PDF export (paid feature)
4. Email capture (newsletter list building)
5. Seasonal expansion (Summer/Fall/Winter = year-round revenue)

---

*Spring Tools Project Brief v3.0 — Vercel Free Tier*
