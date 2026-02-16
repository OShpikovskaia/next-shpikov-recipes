# Shpikov's Recipes (Next.js)

[![CI](https://github.com/OShpikovskaia/next-shpikov-recipes/actions/workflows/ci.yml/badge.svg)](https://github.com/OShpikovskaia/next-shpikov-recipes/actions/workflows/ci.yml)

A small full-stack recipes app built with **Next.js App Router**,
**React 19**, **NextAuth (v5 beta)**, **Prisma**, and **PostgreSQL**.

**Live demo:** https://next-shpikov-recipes.vercel.app

---

## What this project is

Shpikov's Recipes is a lightweight "personal cookbook":

- Browse a list of recipes (public + your own private recipes when
  logged in)
- Create / update / delete recipes via **Server Actions**
- Maintain a personal ingredients catalog (CRUD; protected delete)
- Login / signup using **Credentials** auth via NextAuth + Prisma

---

## Tech stack

**Core** - Next.js 16 (App Router) - React 19 - TypeScript

**Auth** - NextAuth v5 beta - Prisma Adapter - bcryptjs

**Database** - Prisma ORM - PostgreSQL

**UI** - TailwindCSS - HeroUI - Framer Motion

**State & validation** - Zustand - Zod

---

## Architecture overview

The project uses a modular feature-based structure:

    src/
      app/                # Next.js App Router
      modules/
        auth/             # authentication logic and UI
        recipe/           # recipes domain
        ingredient/       # ingredients domain
      shared/
        config/           # configs
        lib/              # prisma client and utilities
        model/            # shared models/types
        ui/               # reusable components

---

## Key Technical Solutions

- **Type-safe Server Actions:** End-to-end type safety for server-client communication, leveraging **Zod** for robust schema validation.
- **Modular Domain-Driven Architecture:** Scalable project structure organized by business domains (Auth, Recipe, Ingredient) to ensure low coupling and high maintainability.
- **Modern Data Fetching & Rendering:** Utilization of **React 19** and **Next.js App Router** features (Server Components, Streaming) for optimized performance and SEO.

---

## Database schema

Entities:

- User
- Recipe
- Ingredient
- RecipeIngredient (join table)

---

## Getting started

### Install dependencies

```bash
yarn
```

### Configure environment

Create `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shpikov_recipes?schema=public"
AUTH_SECRET="your-secret"
```

### Run prisma

```bash
yarn prisma generate
yarn prisma migrate dev
```

### Start dev server

```bash
yarn dev
```

Open:

    http://localhost:3000

---

## Scripts

    yarn dev
    yarn build
    yarn start
    yarn lint
    yarn check
    yarn format

---

## Features

- Next.js App Router
- Fullstack architecture
- Prisma ORM
- Authentication
- Server Actions
- Modular architecture
- Type-safe backend and frontend

---

## License

MIT
