# Student Management System

React + TypeScript frontend with Node.js + Express + TypeScript backend, MongoDB database, and **2-level AES encryption**.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, TypeScript, CryptoJS      |
| Backend  | Node.js, Express, TypeScript        |
| Database | MongoDB via Mongoose                |
| Auth     | JSON Web Tokens (JWT)               |
| Crypto   | AES (CryptoJS) — two independent keys |

---

## How Encryption Works

```
                  Frontend                          Backend                  MongoDB
                  ────────                          ───────                  ───────
Sensitive data ──► AES encrypt (KEY_1) ──► POST /api ──► AES encrypt (KEY_2) ──► stored

GET /api/students ──► AES decrypt (KEY_2) ──► sends FE-encrypted data ──► AES decrypt (KEY_1) ──► shown to user
```

1. **Frontend (Layer 1)** — Before sending to the API, the React app encrypts sensitive fields (name, email, phone, DOB, address, password) using `REACT_APP_FRONTEND_KEY` via `crypto-js` AES.

2. **Backend (Layer 2)** — The Express server re-encrypts the already-encrypted payload using `BACKEND_KEY` before storing in MongoDB.

3. **Fetching** — On `GET /api/students`, the backend strips its own layer. The frontend then strips its layer to display plaintext.

Sensitive fields encrypted: `fullName`, `email`, `phoneNumber`, `dateOfBirth`, `address`, `password`.  
Non-sensitive fields stored as-is: `gender`, `courseEnrolled`.

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone / unzip

```bash
cd task-react-node-typescript
```

### 2. Backend

```bash
cd server
cp .env.example .env        # edit keys and MONGO_URI as needed
npm install
npm run dev                 # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd ../client
# Create a .env file with:
# REACT_APP_FRONTEND_KEY=frontend-secret-key-32chars!!!!!
npm install
npm start                   # starts on http://localhost:3000
```

The React dev server proxies `/api` calls to `localhost:5000` automatically.

---

## API Routes

| Method | Route                    | Description          |
|--------|--------------------------|----------------------|
| POST   | `/api/login`             | Login (returns JWT)  |
| POST   | `/api/register`          | Create student       |
| GET    | `/api/students`          | Get all students     |
| PUT    | `/api/student/:id`       | Update student       |
| DELETE | `/api/student/:id`       | Delete student       |

### Demo Login Credentials

```
Email:    admin@example.com
Password: admin123
```

---

## Features

- ✅ Login with email & password validation
- ✅ Student registration form (all required fields)
- ✅ Full CRUD — Create, Read, Update, Delete
- ✅ 2-level AES encryption (frontend + backend)
- ✅ Responsive table with edit/delete actions
- ✅ TypeScript end-to-end
