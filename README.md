# Shpikov’s Recipes (Next.js)

A small full-stack recipes app built with **Next.js App Router**, **React 19**, **NextAuth (v5 beta)**, **Prisma**, and **PostgreSQL**.

**Live demo:** https://next-shpikov-recipes.vercel.app :contentReference[oaicite:1]{index=1}

---

## What this project is

Shpikov’s Recipes is a lightweight “personal cookbook”:

- Browse a list of recipes (public + your own private recipes when logged in) :contentReference[oaicite:2]{index=2}
- Create / update / delete recipes via **Server Actions** (no classic REST layer needed) :contentReference[oaicite:3]{index=3}
- Maintain a personal ingredients catalog (CRUD; cannot delete ingredients used in recipes) :contentReference[oaicite:4]{index=4}
- Login / signup using **Credentials** (email + password) backed by NextAuth + Prisma :contentReference[oaicite:5]{index=5}

---

## Tech stack

**Core**

- Next.js `^16.0.7` (App Router) :contentReference[oaicite:6]{index=6}
- React `^19.2.1` :contentReference[oaicite:7]{index=7}
- TypeScript `^5` :contentReference[oaicite:8]{index=8}

**Auth**

- NextAuth `^5.0.0-beta.30` (Credentials provider)
- `@auth/prisma-adapter` + `bcryptjs` for password verification :contentReference[oaicite:9]{index=9}

**Data**

- Prisma `6.19.0` + `@prisma/client`
- PostgreSQL via `pg` :contentReference[oaicite:10]{index=10}

**UI**

- TailwindCSS (v4)
- HeroUI components (`@heroui/*`)
- Framer Motion (optional animations) :contentReference[oaicite:11]{index=11}

**State / Validation**

- Zustand (client state stores)
- Zod (form and server-side validation) :contentReference[oaicite:12]{index=12}

---

## Key features (under the hood)

### Recipes: Server Actions + Prisma

Recipes are loaded and mutated via server actions (create/update/delete). The list query returns:

- Only public recipes for guests
- Public OR user-owned recipes for authenticated users :contentReference[oaicite:13]{index=13}

Also includes basic input normalization/validation (trim, required fields, quantity validation). :contentReference[oaicite:14]{index=14}

### Ingredients: client actions + optimistic remove

Ingredients are stored in a Zustand store. The UI uses a thin hook wrapper (`useIngredientActions`) to:

- Load ingredients after auth
- Add ingredient
- Remove ingredient with optimistic UI (rolls back on error) :contentReference[oaicite:15]{index=15}

Deletion is protected: an ingredient can’t be deleted if it’s used by any recipe. :contentReference[oaicite:16]{index=16}

### Auth: NextAuth v5 + Prisma Adapter

Auth is based on NextAuth (v5 beta) using:

- Prisma adapter (DB tables: users/accounts/sessions/etc.)
- Credentials provider (email/password)
- JWT strategy + enriched session (`session.user.id`) :contentReference[oaicite:17]{index=17}

### App bootstrap / hydration

`AppLoader` listens to `useSession()` and syncs auth state into Zustand, plus loads ingredients for logged-in users. :contentReference[oaicite:18]{index=18}

---

## Database schema (Prisma)

Main entities:

- `User`
- `Recipe` (with `isPublic`, `image_url`, optional `steps`)
- `Ingredient` (with category/unit, optional price and description, `normalized_name`)
- `RecipeIngredient` as a join table with `quantity` :contentReference[oaicite:19]{index=19}

---

## Project structure

Uses a feature/module layout:

src/
app/ # Next.js App Router (layout, pages, api routes, providers)
modules/
auth/ # NextAuth config + auth store + UI (login/signup)
recipe/ # recipe types, server actions, widgets/ui
ingredient/ # ingredient types, server actions, store, hooks
shared/
config/ # site/layout config
lib/ # prisma client singleton, shared helpers
model/ # shared types/constants (e.g. auth status)
ui/ # reusable UI components (Header, Search, EmptyState, etc.)

Path aliases:

- `@/*` → `src/*`
- `@/modules/*` → `src/modules/*`
- `@/shared/*` → `src/shared/*` :contentReference[oaicite:20]{index=20}

---

## Getting started

### 1) Install dependencies

This repo uses Yarn classic.

```bash
yarn
2) Configure environment variables

Create .env:

# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/shpikov_recipes?schema=public"

# NextAuth secret (required)
AUTH_SECRET="YOUR_LONG_RANDOM_SECRET"


Note: Prisma config reads DATABASE_URL and migrations live in prisma/migrations.

3) Prisma: migrate + generate
yarn prisma generate
yarn prisma migrate dev

4) Run the dev server
yarn dev


Open http://localhost:3000

Useful scripts
yarn dev           # start dev server
yarn build         # production build
yarn start         # run production server
yarn lint          # eslint
yarn fix           # eslint --fix
yarn type-check    # tsc --noEmit
yarn check         # lint + type-check
yarn format        # prettier --write
yarn format:check  # prettier --check


Bundle analyzer (optional)

This repo supports Next.js bundle analyzer via:

ANALYZE=true yarn build


Notes / known limitations

Code in the repo is intentionally “MVP-simple”: server actions return { success, error } style results to keep UI predictable.

Auth is Credentials-only (no OAuth providers yet).

Remote images are allowed from any hostname (see next.config.ts remotePatterns).

License

MIT (or your choice). Add a LICENSE file if you want an explicit license.
```
