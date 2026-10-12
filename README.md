# 🏢 Real Estate Platform

A full-stack modern Real Estate Web Application built with **React**, **Vite**, **Express**, **Node.js**, **MongoDB**, and **Socket.io**.

---

## 🌟 Key Features

- 🔍 **Property Search & Filtering:** Browse properties with real-time status updates.
- 💬 **Real-time Live Chat:** Connect buyers and sellers directly using `Socket.io`.
- 🔐 **Role-based Authentication:** Custom flows for **Buyers**, **Sellers**, and **Admins**.
- 📋 **Property Management:** Sellers can post, edit, update listing status (Available/Sold), and manage inquiries.
- ❤️ **Wishlist & Inquiries:** Save favorite properties and submit inquiry messages directly to property owners.
- ⚙️ **Admin Dashboard:** Platform monitoring, seller approvals, and user management.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 19** with **Vite 8**
- **TailwindCSS 4** & Custom Component Styling
- **React Router 7**
- **Axios** & **React Icons**

### **Backend**
- **Node.js** & **Express 5**
- **MongoDB** with **Mongoose 9**
- **Socket.io 4** for real-time messaging
- **Cloudinary** & **Multer** for image uploads
- **JWT** (`jsonwebtoken`) & **bcryptjs** for security

---

## 🚀 Quick Start Guide

### 1. Clone the repository
```bash
git clone <repository-url>
cd Real-Estate-Platoform
```

### 2. Configure Backend Environment
Create a `.env` file inside the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Backend Server
```bash
cd backend
npm install
npm run dev
```

### 4. Run Frontend App
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
