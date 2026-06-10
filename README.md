# AchaarWaala — The Heritage Pickle Store

A full-stack e-commerce platform for **AchaarWaala**, an artisanal Indian pickle brand. Built with a modern monorepo architecture featuring a customer storefront, admin dashboard, and a secure REST API backend.

---

## 🌶️ About the Project

AchaarWaala brings the authentic taste of hand-crafted, traditionally prepared Indian pickles (achaar) directly to customers. The platform is designed to reflect a premium, heritage brand identity.

**Live URLs:**
- 🛒 Storefront: [achaarwaala.com](https://achaarwaala.com)
- 🛠️ Admin Panel: [admin.achaarwaala.com](https://admin.achaarwaala.com)

---

## 🏗️ Architecture

```
achaarwaala/
├── backend/            # Express.js REST API + Prisma ORM
├── frontend-store/     # Customer-facing storefront (Vite + React)
└── frontend-admin/     # Role-based admin dashboard (Vite + React)
```

---

## 🚀 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| Database | PostgreSQL + Prisma ORM |
| Authentication | **Firebase Phone Auth** (OTP-based) + PASETO session tokens |
| Payments | Razorpay (webhooks + COD) |
| Image Storage | Cloudinary |
| Email | SMTP (Gmail / custom) |
| Cache & Rate Limiting | Redis / Upstash Valkey |
| Security | Helmet.js, CORS, CSRF protection, Zod validation |

### Frontend (Store & Admin)
| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Styling | Vanilla CSS (heritage-inspired design system) |
| State Management | Zustand |
| Auth Client | Firebase JS SDK (Phone OTP) |
| Routing | React Router v6 |
| HTTP Client | Axios (with auto-refresh interceptors) |
| Analytics | Meta Pixel |

---

## ✨ Key Features

### Customer Storefront
- 📱 **Phone OTP Login** — Friction-free Firebase phone authentication (no passwords)
- 🛒 **Cart & Checkout** — Guest cart that merges on login, full Razorpay integration
- 📦 **Order Tracking** — Real-time order status updates and history
- ❤️ **Wishlist** — Save favourite products for later
- 🔍 **Product Catalog** — Filter by category, price sort, and search
- 📍 **Address Management** — Save multiple delivery addresses

### Admin Dashboard
- 📊 **Analytics** — Revenue charts, top products, and sales breakdowns
- 📋 **Order Management** — View, update, and manage the full order lifecycle
- 🏷️ **Product CMS** — Create, edit, and manage products with Cloudinary image uploads
- 👥 **Customer Management** — View customer profiles and order history
- 🔄 **Returns & Refunds** — End-to-end returns management
- 🎫 **Support Tickets** — In-app customer support system

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL database
- Redis / Upstash Valkey instance
- Firebase project (with Phone Auth enabled)
- Cloudinary, Razorpay, and SMTP email accounts

---

### 1. Backend

```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# → Fill in all values in .env

# Set up the database
npx prisma generate
npx prisma db push

# (Optional) Seed initial data
node src/utils/seed.js

# Start development server
npm run dev
```

---

### 2. Frontend Store

```bash
cd frontend-store
npm install

# Set up environment variables
cp .env.example .env
# → Fill in your Firebase config and API URL

# Start development server
npm run dev
```

---

### 3. Admin Dashboard

```bash
cd frontend-admin
npm install
cp .env.example .env
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|:---|:---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` / `VALKEY_URL` | Redis/Valkey for rate limiting & caching |
| `PASETO_SECRET_KEY` | 32-byte hex secret for session tokens |
| `FIREBASE_PROJECT_ID` | Firebase project ID (from service account) |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase private key (escape newlines with `\n`) |
| `RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `SMTP_USER` | Gmail address for transactional emails |
| `SMTP_PASS` | Gmail App Password |
| `COOKIE_DOMAIN` | `.achaarwaala.com` (for cross-subdomain sessions) |

*See [`backend/.env.example`](./backend/.env.example) for the full reference.*

### Frontend Store (`frontend-store/.env`)

| Variable | Description |
|:---|:---|
| `VITE_API_BASE_URL` | Backend API URL (e.g., `http://localhost:5000/api`) |
| `VITE_FIREBASE_API_KEY` | Firebase Web App API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_META_PIXEL_ID` | Meta (Facebook) Pixel ID |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API Key (address input) |

*See [`frontend-store/.env.example`](./frontend-store/.env.example) for the full reference.*

---

## 🔐 Authentication Flow

AchaarWaala uses a **100% passwordless, phone-first** authentication system:

```
1. User enters mobile number
        ↓
2. Firebase sends OTP via SMS (invisible reCAPTCHA)
        ↓
3. User enters OTP → Firebase verifies → returns ID Token
        ↓
4. Frontend sends ID Token to backend (/auth/verify-firebase)
        ↓
5. Backend verifies token via Firebase Admin SDK
        ↓
6. Backend upserts user in PostgreSQL, issues PASETO session cookies
        ↓
7. User is logged in ✅
```

---

## 🛡️ Security

- **HttpOnly Cookies** — Session tokens stored in secure, JS-inaccessible cookies
- **CSRF Protection** — Double-submit cookie pattern on all state-mutating requests
- **PASETO Tokens** — Modern, cryptographically secure alternative to JWT
- **Rate Limiting** — Redis-backed protection against brute force attacks
- **Helmet.js** — Secure HTTP headers (XSS, Clickjacking protection)
- **Zod Validation** — Schema validation on all API endpoints

---

## 📄 License

This project is licensed under the **ISC License**.

---

*Made with ❤️ for authentic Indian flavours*
