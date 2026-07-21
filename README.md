# RAWW — Natural Fibers, Unhurried Silhouettes

A premium fashion e-commerce storefront built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Supabase project URL + anon key
3. Run `supabase-schema.sql` in your Supabase project's SQL Editor (creates tables, seed products, and Row Level Security policies)
4. `npm run dev`

## Deploy

Import this repo into Vercel, add the two env vars from `.env.example` in the Vercel project settings, and deploy.

## Structure

- `src/pages` — route-level pages (Home, Shop, Product Detail, Checkout, About, FAQ, Shipping & Returns, 404)
- `src/components` — shared UI (Header, Footer, CartDrawer, ProductCard, Button, Deckle frame)
- `src/lib` — Supabase client, product-fetching hook, cart context
- `src/types` — shared TypeScript types matching the Supabase schema

## Status

Customer-facing storefront is wired to live Supabase data (products) and writes real orders on checkout.
Admin panel (product/order management) is the next phase — not yet built.
