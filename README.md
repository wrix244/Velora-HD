# Velora HD 🌌 — Premium Full-Stack Wallpaper Marketplace

Velora HD is a production-ready, highly interactive wallpaper marketplace featuring a stunning, cinematic glassmorphic user interface. The platform supports browsing, previewing, wishlisting, purchasing, and downloading ultra-high-definition wallpapers (both static and live animated formats) for both mobile devices and PC screens.

---

## 🛠️ Tech Stack

- **Frontend Client**: React.js (ES6+ Javascript), Vite, Tailwind CSS v4, Zustand, Framer Motion, Axios, React Query.
- **Backend API**: Node.js, Express.js, JWT Authentication, Multer file upload handling.
- **Database Storage**: MongoDB (Mongoose ORM).

---

## ✨ Features

1. **Vibrant Glassmorphism Design**: Dark theme by default, matching premium interfaces (e.g., Apple, Wallpaper Engine). High-end purple-cyan gradients, micro-animations, skeleton loaders, and custom toast alerts.
2. **Static & Live Wallpapers**: Live wallpapers load interactive, loop-ready `.mp4` video players on hover or detail selection.
3. **Advanced Filtering Engine**: Search filters combining categories (11 choices), resolution, device format (Mobile/PC), format type (Static/Live), pricing status, and popularity sorting (Downloads/Likes).
4. **Mock Checkout & Payment**: Premium wallpapers require passing card details (CVV, Expiry, Card Numbers) validated on both client and server sides, creating persistent transaction logs and unlocking downloads.
5. **Secure Admin Dashboard**: 
   - Login at `admin@velorahd.com` with `admin123`.
   - Admin Analytics displaying overview cards, monthly download trends, and monthly revenue trends via responsive SVG line charts (no heavy external chart libraries).
   - CRUD management for adding, updating, and deleting wallpapers supporting local file uploads or URL sourcing.
   - Registry tables for users, transactions, and download logs.
6. **Zustand & React Query Cache Integration**: Seamless cache synchronization, optimistic favorite states, recently viewed session trails, and infinite scrolling feeds.
7. **PWA Support**: Built-in Service Worker and offline support caching essential styles, fonts, and scripts.

---

## 🚀 Setup & Installation

Ensure you have **Node.js** (v18+) and **MongoDB** installed and running on your local machine.

### 1. Database Seeding & Backend API Startup

Open a terminal inside the project directory:

```bash
# Navigate to the backend folder
cd backend

# Create the environment configuration file
# Check backend/.env. Default connection URI is mongodb://127.0.0.1:27017/velorahd

# Run the database seeder script to populate 50+ beautiful wallpapers
npm run seed

# Start the Node Express backend in development mode
npm run dev
```

### 2. Frontend Client Startup

Open a second terminal inside the root directory:

```bash
# Navigate to the frontend folder
cd frontend

# Install frontend node modules
npm install

# Start the Vite React client dev server
npm run dev
```

Vite is pre-configured with a proxy routing `/api` and `/uploads` requests directly to `http://localhost:5000` to avoid CORS issues.

---

## 🔒 Test Credentials

### Administrator Account
- **Email**: `admin@velorahd.com`
- **Password**: `admin123`

### Standard Test Account
- **Email**: `user@velorahd.com`
- **Password**: `user123`
