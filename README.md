# AI Food Waste Management System (NourishAI)

> Production-ready, full-stack web application designed for hackathon excellence. Bridges restaurant surplus food with local NGOs using Google Gemini AI, Supabase PostgreSQL, and Socket.IO real-time delivery optimization.

---

## 🌟 Key Features & Highlights

- **4 Role-Based Portals**:
  - 🍽️ **Restaurant**: Gemini AI surplus forecasting, freshness estimation, donation publishing.
  - 🤝 **NGO / Shelter**: Interactive map feed, distance/expiry filters, 1-click donation claim.
  - 🚚 **Express Driver**: Route optimization polyline maps, 4-digit OTP verification, proof of delivery upload.
  - 🛡️ **System Admin**: User management, blacklist toggles, governance metrics, PDF & CSV audit exports.
- **Gemini AI Core Engine**:
  - Food surplus prediction based on customer count, sales averages, bookings, and weather.
  - Freshness score (0-100), remaining safe shelf-life calculation, spoilage risk probability, and NGO recommendation ranking.
- **Supabase & Postgres Architecture**:
  - Full relational PostgreSQL schema (`users`, `donations`, `claims`, `deliveries`, `notifications`, `impact_logs`).
  - Native Supabase JS client integration with an offline memory fallback engine for instant zero-config demonstration.
- **Real-Time Notifications & Maps**:
  - Socket.IO live notifications triggered on donation creation, claim, driver dispatch, and completion.
  - Interactive Leaflet & OpenStreetMap dark theme map visualization.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm / npx

### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed     # Pre-populates database with demo accounts & sample donations
npm start        # Starts server on http://localhost:5000
```

### 2. Client Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Restaurant** | `restaurant@demo.com` | `password123` | AI Surplus Predictor, Publish Food |
| **NGO** | `ngo@demo.com` | `password123` | Interactive Map Feed, Claim Food |
| **Driver** | `driver@demo.com` | `password123` | Route Navigation, OTP Verification |
| **Admin** | `admin@demo.com` | `password123` | User Governance, PDF & CSV Exports |

---

## 📂 Project Structure

```
ai-food-waste-system/
├── server/
│   ├── config/          # Supabase client & fallback store
│   ├── controllers/     # Express controllers (auth, AI, donation, NGO, driver, admin)
│   ├── services/        # Gemini AI, NGO matching, route optimization, Socket.IO, Nodemailer
│   ├── routes/          # REST API route endpoints
│   ├── middleware/      # JWT verification & role authorization
│   ├── supabase_schema.sql # PostgreSQL schema DDL
│   ├── seed.js          # Hackathon seed generator
│   └── server.js        # Server entry point
└── client/
    ├── src/
    │   ├── components/  # Navbar, Footer, LeafletMap
    │   ├── context/     # AuthContext, SocketContext
    │   ├── pages/       # Landing, Login, Signup, Restaurant, NGO, Driver, Admin, Leaderboard
    │   ├── services/    # Axios API client
    │   └── index.css    # Tailwind CSS & glassmorphism custom styles
```

---

## ⚡ API Endpoints Summary

- `POST /api/auth/login` - Authenticates user & returns JWT
- `POST /api/auth/signup` - Registers restaurant, NGO, or driver
- `POST /api/ai/predict-surplus` - Executes Gemini AI surplus prediction model
- `POST /api/ai/analyze-freshness` - Analyzes food freshness & remaining shelf life
- `GET  /api/donations` - Retrieves available food donations with filters
- `POST /api/donations` - Publishes new donation & triggers Socket.IO broadcast
- `POST /api/ngo/claim` - Claims donation & dispatches driver
- `POST /api/driver/verify-otp` - Verifies 4-digit OTP & completes delivery
- `GET  /api/reports/pdf` - Exports PDF audit report
- `GET  /api/reports/csv` - Exports CSV data file
>>>>>>> a7fb88c (Initial commit: AI-Powered Real-Time Food Waste Management System)
