# ✨ AURA PARFUMS — Luxury Perfume E-Commerce & Administrative Suite

An ultra-luxury, high-end perfume e-commerce platform and administrative atelier dashboard crafted with a dark/gold aesthetic, glassmorphism UI, smooth transitions, and responsive design.

---

## 🏛️ System Architecture & Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons, React Router v6, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript (NodeNext / ESM), JSON Web Tokens (JWT), bcryptjs.
- **Database & ORM**: SQL Relational Database managed via Prisma ORM (configured out-of-the-box with SQLite, easily switchable to PostgreSQL or MySQL).
- **Authentication**: JWT token-based auth with Role-Based Access Control (`customer` vs `admin`).

---

## 💎 Relational Database Models (Prisma)

1. **User**: `id`, `email`, `password_hash`, `role` ('customer' | 'admin'), `created_at`.
2. **Category**: `id`, `name`, `slug` (e.g., "Oud & Amber", "Haute Floral", "Smoky Woody", "Velvet Gourmand").
3. **Product (Perfumes)**: `id`, `name`, `brand`, `description`, `price`, `stock_quantity`, `volume_ml` (50ml, 100ml, 200ml), `top_notes`, `heart_notes`, `base_notes`, `image_url`, `category_id`, `created_at`.
4. **Order**: `id`, `user_id`, `total_amount`, `status` ('pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'), `shipping_address`, `created_at`.
5. **OrderItem**: `id`, `order_id`, `product_id`, `quantity`, `price_at_purchase`.

---

## 🔑 Default Seeded Accounts

For instant testing and evaluation, the database is pre-seeded with two demo accounts:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@auraparfums.com` | `AdminPassword123!` | Full Admin Atelier & Storefront |
| **VIP Customer** | `vip@auraparfums.com` | `CustomerPass123!` | Storefront, Shopping Chest, Orders |

> **Pro-Tip**: The login page features **1-Click Quick Demo Sign-In** buttons for both accounts.

---

## 🌐 API Route Specification

### Authentication
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Retrieve current user profile (JWT protected)

### Perfumes Catalog
- `GET /api/products` — Filterable catalog (by category, search, minPrice, maxPrice, volume, sort)
- `GET /api/products/:id` — Single perfume details with Olfactory Pyramid and related flacons
- `POST /api/products` — Add new perfume flacon (*Admin only*)
- `PUT /api/products/:id` — Update perfume details/stock (*Admin only*)
- `DELETE /api/products/:id` — Delete perfume (*Admin only*)

### Categories
- `GET /api/categories` — Fragrance families with active product counts

### Orders & Checkout
- `POST /api/orders` — Customer checkout (stock validation + transaction deduction)
- `GET /api/orders` — Logged-in user's past acquisition history
- `GET /api/admin/orders` — All platform orders (*Admin only*)
- `PUT /api/admin/orders/:id/status` — Update order status (*Admin only*)

### Analytics & Intelligence
- `GET /api/admin/analytics` — Revenue stats, pipeline distribution, top selling perfumes, low-stock alerts (*Admin only*)

---

## 🚀 Running the Project

### 1. Backend Server
```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Storefront & Admin
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🔄 Switching to PostgreSQL or MySQL

In `backend/prisma/schema.prisma`:
```prisma
// For PostgreSQL:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// For MySQL:
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

In `backend/.env`:
```env
# PostgreSQL:
DATABASE_URL="postgresql://user:password@localhost:5432/aura_parfums?schema=public"

# MySQL:
DATABASE_URL="mysql://user:password@localhost:3306/aura_parfums"
```
Then run:
```bash
npx prisma db push
npm run prisma:seed
```
