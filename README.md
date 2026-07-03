# Your Next Store — Interview Exercise

A functional mock e-commerce frontend built for a technical interview exercise. This project started from the [Your Next Store](https://demo.yournextstore.com) Next.js template, was gutted of its commerce backend, and re-wired to use the [Fake Store API](https://fakeapi.platzi.com/) for all product data.

> **Live demo:** https://yournextstore-lac-pi.vercel.app

## What this is (and isn't)

This is a **mock frontend only** — there is no real authentication, no payment processing, and no backend database. The checkout form is for demonstration purposes and does not process payments. Only a curated subset of products from the Fake Store API are displayed (the API has a lot of low-quality listings)

## Key features

- **Fake Store API integration** — Products, categories, and search all fetched from the remote API with graceful error handling
- **Client-side image editor** — Edit button on product images opens [Filerobot Image Editor](https://scaleflex.github.io/filerobot-image-editor/) with Adjust, Finetune, Filters, and Annotate tools

## Tech stack

- **Next.js** 16.3 (canary, Turbopack)
- **Fake Store API** (escuelajs.co)
- **Filerobot Image Editor**
- **Vercel** (hosting)

## Setup

```bash
git clone https://github.com/farzanuddin/yournextstore.git
cd yournextstore
bun install
cp .env.example .env.local
bun dev
```
