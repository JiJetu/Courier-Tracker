# Courier Tracker - Parcel Management System 🚚

A full-stack parcel booking and tracking system with real-time location tracking, role-based dashboards, and PDF/CSV report generation. Built using **React**, **Redux Toolkit**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**.

---

## 📂 Project Structure

- `client/` – Frontend (React + TypeScript)
- `server/` – Backend (Express + MongoDB)

---

## 🔗 Live Links

- **Frontend (Vercel):** [https://courier-tracker-client.vercel.app/](https://courier-tracker-client.vercel.app/)
- **Backend (Vercel):** [https://courier-tracker-server.vercel.app/](https://courier-tracker-server.vercel.app/)

---

## Test Admin Credentials

To access the **Admin Dashboard**, log in with:

- **Email:** `admin@gmail.com`
- **Password:** `123456`

> You must use this account to test admin-specific routes like flight management and booking approvals.

---

## 🖥️ Technology Stack

### Frontend

- React + TypeScript
- React Router DOM
- Redux Toolkit (RTK Query)
- Socket.io Client
- React-Leaflet (OpenStreetMap for tracking)
- Tailwind CSS + HeadlessUI + DaisyUI
- Recharts (Admin analytics)
- Sonner (Notification system)

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io Server
- PDFKit & json-2-csv for reports
- Nodemailer for email notifications

---

## 📌 Postman API Collection

**Postman API Collection is available in the project:**

server/Courier Tracker.postman_collection.json

- Import this JSON file in Postman to quickly test all APIs including authentication, parcel CRUD operations, reports export, dashboard metrics, etc.

---

## User Roles & Features

| Role     | Features                                                             |
| -------- | -------------------------------------------------------------------- |
| Customer | Book parcels, track parcel live, check delivery status               |
| Agent    | See assigned parcels, update parcel status, live tracking            |
| Admin    | Manage parcel & users, assign agents, view analytics, export reports |

---

## 📌 API Routing Summary

| Route                    | Method    | Description                         |
| ------------------------ | --------- | ----------------------------------- |
| `/api/register`          | POST      | User Registration                   |
| `/api/login`             | POST      | User Login                          |
| `/api/logout`            | POST      | Logout Session                      |
| `/api/parcel/`           | GET/POST  | Book & fetch parcels based on role  |
| `/api/parcel/assign/:id` | PATCH     | Admin assigns agent to parcel       |
| `/api/parcel/status/:id` | PATCH     | Agent updates parcel status         |
| `/api/parcel/track/:id`  | PATCH     | Agent updates parcel live location  |
| `/api/parcel/:id`        | DELETE    | Admin can delete parcel             |
| `/api/parcel/export/csv` | GET       | Export parcels CSV report           |
| `/api/parcel/export/pdf` | GET       | Export parcels PDF report           |
| `/api/admin/agents`      | GET       | Admin fetches agent list            |
| `/api/admin/users`       | GET       | Admin fetches all users             |
| `/api/profile`           | GET/PATCH | Fetch/update logged-in user profile |

---

## 🛣️ Frontend Routing Summary

| Route                            | Description                          |
| -------------------------------- | ------------------------------------ |
| `/`                              | Landing Page                         |
| `/login` & `/register`           | Authentication pages                 |
| `/dashboard`                     | Protected Dashboard layout           |
| `/dashboard/book-parcel`         | Customer: Book parcel                |
| `/dashboard/my-parcels`          | Customer: My Parcels                 |
| `/dashboard/parcel-track/:id`    | Common: Track Parcel live            |
| `/dashboard/my-assigned-parcels` | Agent: View assigned parcels         |
| `/dashboard/live-tracking`       | Agent: Update parcel live location   |
| `/dashboard/manage-parcels`      | Admin: Assign agents, manage parcels |
| `/dashboard/manage-users`        | Admin: Manage all users              |

---

## 🗂️ Project Structure

    Courier-Tracker/
    ├── client/ # Frontend (React + Vite)
    ├── server/ # Backend (Express + MongoDB)
    ├── README.md

---

## Installation & Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/JiJetu/Courier-Tracker.git
```

### Step 2: Setup Frontend

```bash
cd client
touch .env.local
npm install
npm run dev
```

### Step 3: Setup Backend

```bash
cd ../server
touch .env
npm install
npm run dev
```

    💡 Make sure MongoDB is running and the .env contains valid values

---

### Environment Variables

#### Frontend (client/.env.local)

| Key                | Description          |
| ------------------ | -------------------- |
| VITE_API_URL       | Backend API endpoint |
| VITE_IMGBB_API_KEY | Your imgBB API key   |

#### Backend (server/.env)

| Key                    | Description                  |
| ---------------------- | ---------------------------- |
| DB_URI                 | MongoDB connection URI       |
| BCRYPT_SALT_ROUNDS     | Bcrypt salt rounds           |
| JWT_ACCESS_SECRET      | Access token secret          |
| JWT_REFRESH_SECRET     | Refresh token secret         |
| JWT_ACCESS_EXPIRES_IN  | e.g., 10d                    |
| JWT_REFRESH_EXPIRES_IN | e.g., 365d                   |
| TRANSPORTER_EMAIL      | Gmail address for nodemailer |
| TRANSPORTER_PASSWORD   | Gmail app password           |

---

## Features Summary

- Role Based Authentication (Customer, Agent, Admin)
- Parcel Booking with COD option
- Live Parcel Status Update via Socket.io
- Real-time Location Tracking using React-Leaflet (OSM)
- Admin Dashboard with analytics and filtering
- PDF/CSV Report Export
- Email Notifications on Parcel Status Change
- Clean Responsive UI

---

## 📊 Admin Dashboard Highlights

- Total bookings, delivered, failed

- COD Amount and Total Amount collected

- Last 10 days booking trends via Recharts

- Downloadable reports (CSV/PDF)

---

## 🧑‍💻 Author

Md Jaoadul Islam
GitHub: @[Jijetu](https://github.com/JiJetu)
