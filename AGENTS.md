# Real Estate Platform — Workspace Context & Instructions

This document provides project context, system architecture, directory organization, and instructions for AI agents working in this repository.

---

## 1. Project Overview

The **Real Estate Platform** is a full-stack web application designed for browsing, listing, and managing real estate properties with real-time messaging, inquiry management, and role-based access control.

---

## 2. Technology Stack

### **Frontend** (`/frontend`)
- **Framework:** React 19 + Vite 8
- **Routing:** `react-router-dom` (v7)
- **Styling:** TailwindCSS (v4) + Vanilla CSS (`index.css`, `dummyStyles.js`)
- **Icons:** `react-icons` (Hi, Fi, etc.)
- **State Management & Auth:** React Context (`AuthContext.jsx`) + `localStorage` / `sessionStorage`
- **HTTP Client:** `axios`
- **Dev Server:** `http://localhost:5173`

### **Backend** (`/backend`)
- **Runtime & Server:** Node.js (ES Modules `"type": "module"`) + Express 5
- **Database & ODM:** MongoDB + Mongoose (v9)
- **Real-Time Communication:** `socket.io` (v4)
- **File Uploads & Media Storage:** `multer` + Cloudinary API
- **Authentication & Security:** JWT (`jsonwebtoken`), `bcryptjs`, CORS middleware
- **Process Manager:** `nodemon`
- **Dev Server:** `http://localhost:5000`

---

## 3. Directory Structure

```text
Real-Estate-Platoform/
├── AGENTS.md                  # Project context & AI instructions
├── README.md                  # Main repository README
├── backend/                   # Express backend service
│   ├── config/                # Database (`db.js`) & Cloudinary configuration
│   ├── controllers/           # API request handlers (auth, property, user, inquiry, chat, admin, contact)
│   ├── middlewares/           # Authentication, role check, and upload middlewares
│   ├── models/                # Mongoose schemas (User, Property, Inquiry, Chat, Wishlist, Contact)
│   ├── routes/                # Express router modules (`*.routes.js`)
│   ├── utils/                 # Helper scripts & utilities
│   ├── server.js              # Server entry point, Socket.io setup, middleware mounting
│   ├── package.json           # Backend dependencies & scripts (`npm start`, `npm run dev`)
│   └── .env                   # Environment variables (PORT, MONGO_URI, JWT_SECRET, CLOUDINARY_*)
└── frontend/                  # React Vite frontend application
    ├── src/
    │   ├── assets/            # Global images & style definitions (`dummyStyles.js`)
    │   ├── components/        # Reusable UI components (Navbar, Logo, PropertyCard, Footer, etc.)
    │   ├── context/           # React Context providers (`AuthContext.jsx`)
    │   ├── pages/             # Page components categorized by role (shared, buyer, seller, admin)
    │   ├── config.js          # API base URL & configuration constants
    │   ├── App.jsx            # Application route definitions
    │   ├── main.jsx           # Entry point rendering App wrapped with BrowserRouter & AuthProvider
    │   └── index.css          # Global CSS & Tailwind imports
    ├── package.json           # Frontend dependencies & scripts (`npm run dev`, `npm run build`)
    └── vite.config.js         # Vite bundler configuration
```

---

## 4. Roles & Capabilities

- **Buyer:** Browse available properties, save items to wishlist, send property inquiries, and communicate via live chat with sellers.
- **Seller:** Create, edit, and delete property listings, update listing statuses (Available / Sold), view incoming inquiries, and manage profile/dashboard.
- **Admin:** Monitor system health, review & approve seller registrations, manage platform users, inspect property listings, and view contact submissions.

---

## 5. Backend API Endpoints Reference

| Prefix | Router | Key Responsibilities |
|---|---|---|
| `/api/auth` | `auth.routes.js` | User Registration, Login, Logout, Verification |
| `/api/user` | `user.routes.js` | User Profile details & updates |
| `/api/property` | `property.routes.js` | Property CRUD operations, Filtering, Status updates |
| `/api/inquiry` | `inquiry.routes.js` | Submit & view property inquiries |
| `/api/wishlist` | `wishlist.routes.js` | Add/Remove properties from user wishlist |
| `/api/contact` | `contact.routes.js` | Contact form submissions |
| `/api/admin` | `admin.routes.js` | Admin analytics, User management, Listing controls |
| `/api/chat` | `chat.routes.js` | Chat history & messaging routes |

---

## 6. How to Run the Application

### **Start Backend Server:**
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

### **Start Frontend App:**
```bash
cd frontend
npm run dev
# App will run on http://localhost:5173
```
