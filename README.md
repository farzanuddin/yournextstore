# Your Next Store — Interview Exercise

A fully functional mock e-commerce frontend built for a technical interview exercise. This project started from the [Your Next Store](https://demo.yournextstore.com) Next.js template, was gutted of its commerce backend, and re-wired to use the [Fake Store API](https://fakeapi.platzi.com/) for all product data.

> **Live demo:** https://yournextstore-lac-pi.vercel.app

## What this is (and isn't)

This is a **mock frontend only** — there is no real authentication, no payment processing, and no backend database. The checkout form is for demonstration purposes and does not process payments. Only a curated subset of products from the Fake Store API are displayed (most of their catalog is low-quality or irrelevant).

## Pages

- **Home** — Hero banner + featured product grid
- **Products** — Full product listing with loading skeletons
- **Product Detail** — Image gallery, variant selector, quantity controls, trust badges, related products
- **Cart** — Slide-out sidebar with quantity controls, free shipping progress bar, localStorage persistence
- **Checkout** — Shipping form with validation, payment method selection (Card / Google Pay), order summary
- **Search** — Real-time product search with debounced suggestions
- **Login / Signup / Forgot Password** — Static auth pages for UI demonstration only
- **404** — Custom not-found page

## Key features

- **Fake Store API integration** — Products, categories, and search all fetched from the remote API with graceful error handling
- **Client-side image editor** — Edit button on product images opens [Filerobot Image Editor](https://scaleflex.github.io/filerobot-image-editor/) with Adjust, Finetune, Filters, and Annotate tools
- **Server components with caching** — Pages use Next.js `"use cache"` and `cacheLife` for optimal performance
- **Optimistic cart updates** — Instant UI feedback with queued server sync for rapid quantity changes
- **Responsive design** — Mobile-first layout using Tailwind CSS v4 and shadcn/ui components
- **Next.js best practices** — `next/image` everywhere, proper SEO metadata on all pages, loading states, error boundaries

## Tech stack

- **Next.js** 16.3 (canary, Turbopack)
- **React** 19 (canary)
- **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Fake Store API** (escuelajs.co)
- **Filerobot Image Editor**
- **Bun** (package manager & runtime)
- **Vercel** (hosting)

## Setup

```bash
git clone https://github.com/farzanuddin/yournextstore.git
cd yournextstore
bun install
cp .env.example .env.local
bun dev
```

Open [http://localhost:3000](http://localhost:3000).
