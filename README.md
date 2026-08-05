# 🏥 Smart Rural Health (Doctor Bangaram)

![Smart Rural Health Banner](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000)

Smart Rural Health is an advanced, AI-powered healthcare platform designed specifically to bridge the gap in rural healthcare access. By leveraging artificial intelligence, predictive analytics, and a comprehensive hospital network, the platform provides instant disease predictions, manages global supply chains, handles emergency requests, and digitizes patient records securely.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features & Modules](#-key-features--modules)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Database Schema Overview](#-database-schema-overview)
6. [Installation & Setup](#-installation--setup)
7. [Environment Variables](#-environment-variables)
8. [Running the Application](#-running-the-application)
9. [Seed Data & Test Accounts](#-seed-data--test-accounts)
10. [API Documentation](#-api-documentation)
11. [Directory Structure](#-directory-structure)

---

## 🎯 Project Overview
In many rural areas, access to immediate healthcare and robust medical supply chains is severely limited. **Smart Rural Health** (Project Doctor Bangaram) acts as a digital bridge between patients, hospitals, doctors, and blood banks. 

By utilizing **Predictive AI**, the system can:
1. Analyze patient symptoms to predict potential diseases and suggest immediate actions.
2. Monitor medicine consumption across a network of hospitals to predict and prevent critical shortages before they happen.

---

## ✨ Key Features & Modules

### 1. 🤖 AI-Powered Healthcare Engine
* **Disease Prediction Engine:** Patients input their symptoms through a conversational UI. The AI evaluates the inputs against medical datasets to provide probability-based disease predictions and recommended next steps.
* **Predictive Medicine Supply Chain:** The system analyzes the `dailyConsumptionRate` of hospital inventory. If an item is predicted to deplete within 7 days, it raises a critical alert.
* **AI Global Network Re-routing:** To prevent stockouts, the AI automatically scans the global hospital network. If it finds a hospital with excess stock (>30 days runway), it creates an automated **Transfer Recommendation** for the Admin to approve.

### 2. 👥 Multi-Role Interactive Dashboards
The platform employs strict Role-Based Access Control (RBAC) to serve 4 primary user types:
* **Admin Dashboard (`/dashboard/admin`):** 
  * Centralized command center.
  * Oversees the global Hospital and Blood Bank networks.
  * Approves/Rejects AI-recommended supply chain transfers.
  * Manages government insurance claims and health camps.
* **Hospital Dashboard (`/dashboard/hospital`):**
  * Local inventory and supply chain management.
  * Patient admission and digital health record (EHR) tracking.
  * Handles emergency dispatch requests.
* **Patient Portal (`/dashboard/patient`):**
  * Secure access to personal medical history.
  * Symptom checker and disease predictions.
  * Appointment booking and local health camp locator.
* **Blood Bank Portal (`/dashboard/blood-bank`):**
  * Real-time tracking of blood group availability (A+, B-, O+, etc.).
  * Donation camp organization.

### 3. 🛡️ Digital Healthcare Infrastructure
* **Emergency Management:** Patients can trigger SOS requests. The system uses Leaflet mapping and Geolocation to route the request to the nearest available hospital.
* **Claims Management:** Automated processing for government health schemes (e.g., Ayushman Bharat, Aarogyasri) and private insurance integration.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
* **Framework:** React.js (Bootstrapped with Vite for extremely fast HMR)
* **Styling:** Tailwind CSS (Utility-first CSS framework)
* **Animations:** Framer Motion (For fluid, interactive UI transitions)
* **Icons:** Lucide React
* **State Management:** React Hooks & Context API
* **Form Handling:** React Hook Form
* **Mapping:** Leaflet & React-Leaflet
* **HTTP Client:** Axios (Configured with Auth Interceptors)

### Backend (Server-Side)
* **Runtime:** Node.js
* **Framework:** Express.js (RESTful architecture)
* **Database:** MongoDB (NoSQL document database)
* **ODM:** Mongoose (Schema validation and relationship mapping)
* **Authentication:** JSON Web Tokens (JWT)
* **Security:** Bcrypt.js (Password hashing)

---

## 🏗️ System Architecture

1. **Client Layer:** React SPA communicates with the backend via RESTful APIs.
2. **API Gateway Layer:** Express.js router intercepts requests, applies `cors`, parses `json`, and routes to specific controllers.
3. **Security Middleware:** `authMiddleware.js` verifies the JWT token. The `authorize(...roles)` function ensures the user has the required permission level.
4. **Service / Controller Layer:** Business logic is executed (e.g., calculating depletion dates, running AI predictions).
5. **Data Access Layer:** Mongoose interacts with MongoDB to fetch/mutate data.

---

## 🗄️ Database Schema Overview

The core models driving the platform:

* **User (`User.js`):** The base model for all accounts. Includes fields like `full_name`, `email`, `password`, `role` (Enum: `patient`, `hospital_admin`, `admin`, `doctor`), and role-specific data like `medicalHistory`.
* **InventoryItem (`InventoryItem.js`):** Tracks medical supplies at specific hospitals. Fields: `hospital` (Ref: User), `name`, `quantity`, `threshold`, `dailyConsumptionRate`, `predictedDepletionDate`.
* **SupplyTransfer (`SupplyTransfer.js`):** Ledger of inventory movements. Fields: `sourceHospital`, `targetHospital`, `item`, `quantityToTransfer`, `status` (Pending/Approved/Rejected), `isAiRecommended`.
* **Hospital (`Hospital.js`):** Dedicated model for hospital profiles, locations, and specializations.
* **Disease (`Disease.js`):** Medical knowledge base mapping symptoms to conditions.

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v16.x or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance running on port 27017, or a MongoDB Atlas URI)
* Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/doctor-bangaram.git
cd "doctor bangaram"
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

You must create `.env` files in both the `backend` and `frontend` directories before starting the application.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_rural_health
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃‍♂️ Running the Application

To run the application locally, you need two terminal windows.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run dev
```
*(Nodemon will start the server on `http://localhost:5000` and watch for file changes)*

**Terminal 2: Start the Frontend Server**
```bash
cd frontend
npm run dev
```
*(Vite will start the frontend on `http://localhost:5173` or `http://localhost:5174`)*

---

## 🧪 Seed Data & Test Accounts

To fully experience the Predictive Supply Chain AI and Network Features, you should populate the database with our pre-configured seed scripts.

### Running the Seeds
Open a terminal in the `backend` directory and run:

1. **Primary Database Seed** (Creates Users, Hospitals, and Diseases):
   ```bash
   node seed.js
   ```

2. **Supply Chain Simulation Seed** (Creates Inventory Shortages & Excesses):
   ```bash
   node seedSupplyChain.js
   ```

### Default Test Credentials

After running the seeds, you can log into the platform using the following accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `korikanasaipraneeth@gmail.com` | `password` | Full network visibility, Supply Chain Approval |
| **Hospital** | `mohankrisna@gmail.com` | `password123` | Inventory Management, Patient Admissions |
| **Hospital 2** | `secondhospital@gmail.com` | `password123` | City Hospital (Excess Inventory Source) |
| **Patient** | `patient.karanpatel39...` | *(Randomized)* | Personal Health Dashboard |

---

## 📡 API Documentation

Below are the primary API routes available in the system. All protected routes require a `Bearer <token>` in the Authorization header.

### Authentication (`/api/auth`)
* `POST /login` - Authenticate User/Admin/Hospital and receive JWT.
* `POST /register` - Register a new Patient.
* `POST /hospital/login` - Authenticate a Hospital.

### Supply Chain & Inventory (`/api/inventory`)
* `GET /` - Get local inventory (Role: `hospital_admin`, `admin`).
* `POST /` - Add new medical stock (Role: `hospital_admin`).
* `GET /predict` - Run AI algorithm to find critical shortages and recommendations (Role: `hospital_admin`, `admin`).
* `GET /transfers` - View all network supply transfers (Role: `admin`, `hospital_admin`).
* `PUT /transfers/:id` - Approve/Reject a transfer (Role: `admin`).

### Emergency (`/api/emergency`)
* `POST /` - Create a new SOS emergency request.
* `GET /` - Fetch all active emergencies.

---

## 📁 Directory Structure

```text
doctor bangaram/
├── backend/                  # Node.js / Express Server
│   ├── controllers/          # Request handlers and business logic
│   │   ├── authController.js
│   │   ├── inventoryController.js
│   │   └── ...
│   ├── middleware/           # Custom Express middlewares
│   │   ├── authMiddleware.js # JWT Verification & RBAC
│   │   └── errorMiddleware.js
│   ├── models/               # Mongoose Database Schemas
│   │   ├── User.js
│   │   ├── InventoryItem.js
│   │   ├── SupplyTransfer.js
│   │   └── ...
│   ├── routes/               # Express API Route definitions
│   │   ├── authRoutes.js
│   │   ├── inventoryRoutes.js
│   │   └── ...
│   ├── seed.js               # Primary DB Seeder
│   ├── seedSupplyChain.js    # Supply Chain Simulation Seeder
│   └── server.js             # Application Entry Point
│
├── frontend/                 # React.js / Vite Application
│   ├── public/               # Static assets
│   ├── src/                  # React Source Code
│   │   ├── assets/           # Images, SVGs
│   │   ├── components/       # Reusable UI Components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── pages/            # Application Views/Pages
│   │   │   ├── admin/        # Admin Dashboards (AdminSupplyChain.jsx, etc)
│   │   │   ├── hospital/     # Hospital Dashboards (InventoryManagement.jsx, etc)
│   │   │   ├── patient/      # Patient Dashboards
│   │   │   └── auth/         # Login & Registration Pages
│   │   ├── services/         # Axios API Client configuration
│   │   │   └── api.js
│   │   ├── App.jsx           # Main React Router configuration
│   │   └── main.jsx          # React DOM render entry point
│   ├── index.html
│   ├── tailwind.config.js    # Tailwind CSS Configuration
│   └── vite.config.js        # Vite Build Configuration
└── README.md
```

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
"# Smart-Rural-Health-" 
