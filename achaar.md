# 📚 Categories Info Page — Full Documentation

> **AchaarWaala** · Full-Stack Reference · Last Updated: June 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Route & Navigation](#route--navigation)
3. [Frontend — CategoriesInfo Page](#frontend--categoriesinfo-page)
4. [Frontend — Category (Dynamic Slug) Page](#frontend--category-dynamic-slug-page)
5. [Frontend — API Integration](#frontend--api-integration)
6. [Backend — API Routes](#backend--api-routes)
7. [Backend — Controller Logic](#backend--controller-logic)
8. [Database — Prisma Schema](#database--prisma-schema)
9. [SEO & Meta Tags](#seo--meta-tags)
10. [Category Hierarchy (Static Content)](#category-hierarchy-static-content)
11. [File Reference Map](#file-reference-map)

---

## Overview

The **Categories Info** page (`/categories-info`) is a **static editorial page** on the Achaarwaala storefront. It serves as a brand storytelling and navigation hub that:

- Introduces the **4 core pickle categories** with their heritage stories.
- Explains **ancient curing methods** (sun-curing, cold-pressed mustard oil, fermentation).
- Links users directly to the corresponding **dynamic category product listing pages** (`/categories/:slug`).

This is distinct from the **dynamic Category page** (`/categories/:slug`) which fetches live product data from the backend.

---

## Route & Navigation

### URL
```
/categories-info
```

### Registered in `App.jsx`
```jsx
// frontend-store/src/App.jsx — Line 36, 110
const CategoriesInfo = lazy(() => import('./pages/CategoriesInfo'));

<Route path="categories-info" element={<CategoriesInfo />} />
```

### Navbar Link
The route is exposed as a primary navigation link in the sticky `Navbar`:

```js
// frontend-store/src/components/Navbar.jsx — Lines 24–30
const navLinks = [
  { to: '/',                label: 'Home'           },
  { to: '/products',        label: 'Shop'           },
  { to: '/our-story',       label: 'Our Story'      },
  { to: '/categories-info', label: 'Categories Info' }, // ← this page
  { to: '/contact',         label: 'Contact Us'     },
];
```

The link becomes **amber** (`text-[#C8922A]`) when the route is active, and is available in **both desktop and mobile** nav menus.

---

## Frontend — CategoriesInfo Page

**File:** `frontend-store/src/pages/CategoriesInfo.jsx`  
**Type:** Static React Component (no API calls, no state)  
**Lines:** 108

### Component Structure

```
CategoriesInfo
├── <SEO />                        — Meta tags, title, keywords
└── <div> max-w-4xl container
    ├── Header Section             — "Our Offerings" label + H1 + description
    ├── Ancient Methods Card       — 🏺 Sun-curing heritage block
    └── Categories Breakdown
        ├── Mango Specialities     — 🥭 + description + shop link
        ├── Artisanal Chilli       — 🌶️ + description + shop link
        ├── Desert Delicacies      — 🌵 + description + shop link
        └── Heritage Blends        — 🍋 + description + shop link
```

### Design Tokens Used

| Token | Value | Usage |
|---|---|---|
| Background | `#FAFAF4` | Page background + card bg |
| Border | `#E8E2D8` | All card/section borders |
| Text Primary | `#1A1A1A` | Headings |
| Text Secondary | `#6B6560` | Body text |
| Text Muted | `#9A8A70` | Label / eyebrow text |
| Accent / Gold | `#C8922A` | Links, italic headline |
| White Card | `#FFFFFF` | Ancient Methods card |

### Layout Pattern

- Container: `max-w-4xl mx-auto` with `space-y-16`
- Sections alternate between **left-image + right-text** and **right-image + left-text** (using `flex-row` and `flex-row-reverse`)
- Responsive: stacks vertically on mobile via `flex-col`
- Top padding: `pt-24 md:pt-32` (accounts for sticky navbar)

### Padding & Spacing
```
Page:    pt-24 md:pt-32, pb-24, px-4
Header:  space-y-4
Cards:   space-y-12 (between categories), gap-8 (image/text within)
Image:   md:w-1/3, aspect-square, rounded-xl
Text:    md:w-2/3, space-y-4
```

---

## 4 Static Category Blocks

### 1. 🥭 Mango Specialities
| Property | Value |
|---|---|
| Link | `/categories/mango-achaar` |
| CTA | `Shop Mango Pickles →` |
| Layout | Image left, text right |
| Description | Raw mangoes harvested before monsoon, sun-dried, marinated in traditional spices. Pays homage to grandmothers who mastered the balance of sour and spicy. |

### 2. 🌶️ Artisanal Chilli
| Property | Value |
|---|---|
| Link | `/categories/chilli-achaar` |
| CTA | `Shop Chilli Pickles →` |
| Layout | Image right, text left |
| Description | Rajasthani green and red chillies, hand-slit and stuffed with smoked spice blend (split mustard + dry mango powder). |

### 3. 🌵 Desert Delicacies
| Property | Value |
|---|---|
| Link | `/categories/desert-achaar` |
| CTA | `Shop Desert Delicacies →` |
| Layout | Image left, text right |
| Description | Wild-harvested Ker and Sangri desert beans/berries. Intense earthy flavors; traditionally reserved for royalty. Authentic Marwar taste. |

### 4. 🍋 Heritage Blends
| Property | Value |
|---|---|
| Link | `/categories/heritage-blends` |
| CTA | `Shop Heritage Blends →` |
| Layout | Image right, text left |
| Description | Oil-free / slow-fermented pickles like Ancestral Lemon Pickle. Cured with rock salt, black pepper, and time. Ayurvedic/digestive roots. |

---

## Frontend — Category (Dynamic Slug) Page

**File:** `frontend-store/src/pages/Category.jsx`  
**Type:** Dynamic, data-driven page  
**Route:** `/categories/:slug`  
**Lines:** 83

This page is reached when a user clicks any **"Shop ... →"** CTA from `CategoriesInfo`. It fetches live data from the backend by category slug.

### Data Fetching
```js
// Uses React Query with 5-minute stale time
const { data, isLoading } = useQuery({
  queryKey: ['category', slug],
  queryFn: () => categoriesApi.getBySlug(slug).then(r => r.data.data),
  staleTime: 1000 * 60 * 5,
});
```

### UI States

| State | Behavior |
|---|---|
| **Loading** | 12-cell skeleton grid with `animate-pulse` |
| **Empty** | Centered 📦 icon + "No Products Available" message + Browse All link |
| **Populated** | 2–4 column responsive product grid using `<ProductCard />` |

### Breadcrumb
```
Home › Products › {Category Name}
```

### Schema Markup (SEO)
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "{category.name}",
  "description": "{category.description}",
  "url": "{window.location.href}"
}
```

---

## Frontend — API Integration

**File:** `frontend-store/src/api/index.js` — Lines 21–27

```js
export const categoriesApi = {
  list:      ()             => api.get('/categories'),
  getBySlug: (slug)         => api.get(`/categories/${slug}`),
  create:    (data)         => api.post('/categories', data),
  update:    (id, data)     => api.put(`/categories/${id}`, data),
  delete:    (id)           => api.delete(`/categories/${id}`),
};
```

> **Note:** `create`, `update`, and `delete` are admin-only operations. The storefront only calls `list` and `getBySlug`.

---

## Backend — API Routes

**File:** `backend/src/routes/category.routes.js`

```
Base Path: /api/categories
```

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | ❌ No | Public | List all active root categories |
| `GET` | `/:slug` | ❌ No | Public | Get single category + its products |
| `POST` | `/` | ✅ Yes | ADMIN / SUPER_ADMIN | Create new category |
| `PUT` | `/:id` | ✅ Yes | ADMIN / SUPER_ADMIN | Update category by ID |
| `DELETE` | `/:id` | ✅ Yes | ADMIN / SUPER_ADMIN | Soft-delete (deactivate) category |

---

## Backend — Controller Logic

**File:** `backend/src/controllers/category.controller.js`

### `listCategories` — `GET /categories`
```js
// Returns all root-level active categories with their children and product counts
prisma.category.findMany({
  where: { isActive: true, parentId: null },  // root categories only
  orderBy: { sortOrder: 'asc' },
  include: {
    children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
    _count: { select: { products: { where: { isActive: true } } } },
  },
})
```

**Returns:** Array of categories, each with their sub-categories and active product count.

### `getCategory` — `GET /categories/:slug`
```js
// Fetches a single category by slug with its products (max 20)
prisma.category.findUnique({
  where: { slug },
  include: {
    children: true,
    products: {
      where: { isActive: true },
      take: 20,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    },
  },
})
```

**Returns:** Category details + up to 20 active products, each with its primary image.

### `createCategory` — `POST /categories` _(Admin)_

Validates body with **Zod schema**:

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | ✅ | 2–100 chars |
| `slug` | `string` | ❌ | Auto-generated from name if omitted |
| `description` | `string` | ❌ | — |
| `imageUrl` | `string (url)` | ❌ | Valid URL |
| `parentId` | `string (uuid)` | ❌ | For sub-categories |
| `sortOrder` | `number (int)` | ❌ | Default: `0` |

### `updateCategory` — `PUT /categories/:id` _(Admin)_
Partial update; all fields from `categorySchema` are optional.

### `deleteCategory` — `DELETE /categories/:id` _(Admin)_
**Soft delete** — sets `isActive: false`. Does **not** delete from database.

---

## Database — Prisma Schema

**File:** `backend/prisma/schema.prisma` — Lines 134–149  
**Table:** `categories`

```prisma
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  slug        String    @unique
  description String?
  imageUrl    String?
  parentId    String?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())

  @@map("categories")
}
```

### Key Design Decisions

| Decision | Detail |
|---|---|
| **Self-referential relation** | `parent` / `children` via `"CategoryHierarchy"` supports unlimited nesting |
| **Soft delete** | `isActive` flag — categories are never hard-deleted |
| **Unique slug** | URL-safe identifier used in routing |
| **Sort order** | Manual ordering via `sortOrder` integer |
| **No `updatedAt`** | Category edits are infrequent; `updatedAt` omitted to keep schema light |

### Relation to Product
```prisma
// Product model (Line 158)
category   Category  @relation(fields: [categoryId], references: [id])

// Indexes on Product for category queries (Lines 181–183)
@@index([categoryId])
@@index([isActive, categoryId])
```

---

## SEO & Meta Tags

### CategoriesInfo Page SEO
```jsx
<SEO
  title="Categories Info & Heritage"
  description="Discover the stories, ancient methods, and categories behind Achaarwaala's artisanal pickles."
  keywords="achaar categories, ancient pickle methods, rajasthani heritage, mango pickle, ker sangri"
/>
```

**Resolved title tag:** `Categories Info & Heritage | Achaarwaala`

### Dynamic Category Page SEO
```jsx
<SEO
  title={data?.name || slug}
  description={data?.description || `Explore our premium collection of ${data?.name} at Achaarwaala...`}
  keywords={`${data?.name}, buy ${data?.name} online, authentic rajasthani achaar, village pickles, Achaarwaala`}
  schemaMarkup={categorySchema}  // JSON-LD CollectionPage
/>
```

### SEO Component Outputs
The `<SEO>` component (`frontend-store/src/components/SEO.jsx`) renders:
- `<title>` — `{title} | Achaarwaala`
- `<meta name="description">` — page description
- `<meta name="keywords">` — keyword string
- `<link rel="canonical">` — current URL
- **Open Graph** — `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
- **Twitter Cards** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **JSON-LD** — structured schema (only on dynamic Category page)

---

## Category Hierarchy (Static Content)

The static content on `CategoriesInfo.jsx` maps to these expected database slugs:

```
categories/
├── mango-achaar       → 🥭 Mango Specialities
├── chilli-achaar      → 🌶️ Artisanal Chilli
├── desert-achaar      → 🌵 Desert Delicacies
└── heritage-blends    → 🍋 Heritage Blends
```

These slugs must be seeded into the `categories` table in the database for the dynamic product pages to return results.

---

## File Reference Map

| Layer | File | Purpose |
|---|---|---|
| **Page (Static)** | `frontend-store/src/pages/CategoriesInfo.jsx` | Brand editorial — categories overview |
| **Page (Dynamic)** | `frontend-store/src/pages/Category.jsx` | Live product listing by slug |
| **Routing** | `frontend-store/src/App.jsx` | Route registration (L110) |
| **Navigation** | `frontend-store/src/components/Navbar.jsx` | Nav link (L28) |
| **SEO** | `frontend-store/src/components/SEO.jsx` | Meta/OpenGraph component |
| **API Client** | `frontend-store/src/api/index.js` | `categoriesApi` (L21–27) |
| **Backend Routes** | `backend/src/routes/category.routes.js` | REST endpoints |
| **Backend Controller** | `backend/src/controllers/category.controller.js` | Business logic |
| **Database Schema** | `backend/prisma/schema.prisma` | `Category` model (L134–149) |