# 🏥 MediCare - Healthcare & Appointment Management System

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%26%20Bcrypt-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

A full-stack, enterprise-grade healthcare and doctor appointment management platform built with modern web technologies. The project has progressed through 7 incremental engineering experiments—from foundational UI and state architecture to secure RESTful microservices, Role-Based Access Control (RBAC), and containerized multi-service deployment.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Comprehensive Experiments Roadmap (Exp 1 - 7)](#-comprehensive-experiments-roadmap-exp-1---7)
  - [Experiment 1: Frontend Initialization & UI Component Architecture](#experiment-1-frontend-initialization--ui-component-architecture)
  - [Experiment 2: React Hooks, Dynamic State & Mock REST API](#experiment-2-react-hooks-dynamic-state--mock-rest-api)
  - [Experiment 3: Centralized State Management (Context API) & Client CRUD](#experiment-3-centralized-state-management-context-api--client-crud)
  - [Experiment 4: Full-Stack Architecture - Express API & MongoDB Integration](#experiment-4-full-stack-architecture---express-api--mongodb-integration)
  - [Experiment 5: Backend Authentication & Secure Password Management](#experiment-5-backend-authentication--secure-password-management)
  - [Experiment 6: Role-Based Access Control (RBAC) & Protected Routes](#experiment-6-role-based-access-control-rbac--protected-routes)
  - [Experiment 7: Multi-Container Dockerization & Docker Compose](#experiment-7-multi-container-dockerization--docker-compose)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [API Reference](#-api-reference)
- [Demo Credentials](#-demo-credentials)
- [Getting Started](#-getting-started)
  - [Option A: Running with Docker Compose (Recommended)](#option-a-running-with-docker-compose-recommended)
  - [Option B: Local Development Setup](#option-b-local-development-setup)
- [Running Automated Tests](#-running-automated-tests)

---

## 🌟 Project Overview

**MediCare** bridges the gap between healthcare providers and patients by offering a seamless digital portal for:
- Exploring specialist doctors across cardiological, neurological, pediatric, and general medical disciplines.
- Real-time appointment scheduling with automated slot allocation and status tracking.
- Role-segregated portals: dedicated dashboards for patients to manage bookings and for doctors to review clinical schedules and update appointment statuses.
- Enterprise security with token-based stateless authentication, bcrypt password hashing, and strict role authorization.

---

## 🔬 Comprehensive Experiments Roadmap (Exp 1 - 7)

| Experiment | Focus Area | Key Deliverables & Achievements |
| :--- | :--- | :--- |
| **EXP-1** | **UI Architecture & Layouts** | Vite + React frontend, Tailwind CSS design system, modular UI components (`Navbar`, `Footer`, `Button`, `Card`, `Modal`), responsive dashboards. |
| **EXP-2** | **Hooks & Mock API Integration** | Custom hooks (`useFetch`, `useForm`, `useDebounce`), dynamic form validation, `ThemeContext` (Dark/Light mode), JSON-server mock API. |
| **EXP-3** | **Context State & Client CRUD** | Centralized `AppointmentContext`, full client-side CRUD operations (Book, Confirm, Cancel), authentication UI guards. |
| **EXP-4** | **Decoupled Backend & Database** | Full-stack separation (`frontend/` & `backend/`), Express REST API, MongoDB connection via Mongoose, schemas (`Doctor`, `Appointment`), database seed script. |
| **EXP-5** | **Authentication & Security** | Patient registration & login, password hashing with `bcryptjs`, stateless JWT authentication, JWT verification middleware (`protect`), auth test suite. |
| **EXP-6** | **Role-Based Access Control (RBAC)** | Multi-role authorization (`patient` vs `doctor`), endpoint security (`authorize`), scoped appointment queries, frontend `ProtectedRoute` wrapper. |
| **EXP-7** | **Containerization & Orchestration** | Multi-container Docker deployment (`Dockerfile` for backend & frontend), unified `compose.yaml`, isolated bridge network, port bindings (3000 & 5000). |

---

### Experiment 1: Frontend Initialization & UI Component Architecture
- **Objective:** Establish a high-performance modern React client application and build an accessible, reusable component library.
- **Implementations:**
  - Initialized project with **Vite** and **React 19** with Tailwind CSS utility styling.
  - Built core atomic components: `Button.jsx`, `Card.jsx`, `DoctorCard.jsx`, `Modal.jsx`, `Dropdown.jsx`, `Navbar.jsx`, and `Footer.jsx`.
  - Constructed primary application views:
    - `Home.jsx`: Hero showcase, specialty search, feature highlights, and interactive call-to-actions.
    - `DoctorDashboard.jsx`: Daily schedule view, patient lists, and quick-action metrics.
    - `PatientDashboard.jsx`: Upcoming appointments, past medical consults, and status indicators.
    - `Login.jsx`: Responsive authentication UI layout.

### Experiment 2: React Hooks, Dynamic State & Mock REST API
- **Objective:** Introduce advanced React patterns, reusable custom hooks, client-side validation, and asynchronous data fetching.
- **Implementations:**
  - Created reusable custom React hooks:
    - `useFetch.js`: Asynchronous HTTP lifecycle handling with loading, error states, and manual `refetch()` capability.
    - `useForm.js`: Dynamic form state manager with dirty tracking, touched states, and real-time validation.
    - `useDebounce.js`: Debounced user input to optimize doctor search queries and reduce unnecessary re-renders.
  - Implemented application-level state contexts:
    - `AuthContext.jsx`: User session and login state.
    - `ThemeContext.jsx`: Dark mode / light mode toggle with theme persistence.
  - Built dedicated `Doctors.jsx` directory with live specialty filtering and real-time availability filters.
  - Connected frontend to `json-server` (`db.json`) via Axios instance for mock CRUD testing.

### Experiment 3: Centralized State Management (Context API) & Client CRUD
- **Objective:** Eliminate prop drilling, coordinate global booking workflows, and enforce client-side navigation guards.
- **Implementations:**
  - Developed `AppointmentContext.jsx` implementing full lifecycle CRUD operations:
    - `fetchAppointments()`: Pulls user-specific bookings.
    - `bookAppointment()`: Validates and pushes new appointment requests.
    - `updateAppointmentStatus()`: Transitions status between `Pending`, `Confirmed`, and `Cancelled`.
    - `deleteAppointment()`: Removes cancelled or historical records.
  - Added authentication guards on navigation and dashboard routes.
  - Synchronized real-time status updates across patient and doctor views.

### Experiment 4: Full-Stack Architecture - Express API & MongoDB Integration
- **Objective:** Transition from mock APIs to an enterprise decoupled full-stack architecture with persistent NoSQL storage.
- **Implementations:**
  - Restructured repository into standalone `frontend/` and `backend/` micro-packages.
  - Engineered **Node.js** & **Express** REST API server:
    - Structured routes, controllers, middleware, and environment config (`.env`).
    - Configured CORS, Helmet security headers, and Express rate limiting.
  - Integrated **MongoDB** using **Mongoose ORM**:
    - `Doctor` model: Name, email, specialization, experience, fees, availability, rating.
    - `Appointment` model: References to patient and doctor IDs, date, time slot, symptoms, and appointment status.
  - Created database seeder (`seed.js`) generating realistic sample doctors and default data records.

### Experiment 5: Backend Authentication & Secure Password Management
- **Objective:** Implement cryptographic security, user registration, credential authentication, and stateless token authorization.
- **Implementations:**
  - Created `Patient` Mongoose model with email uniqueness and validated attributes.
  - Password hashing with **`bcryptjs`** utilizing automatic salt generation before persistence.
  - Token-based stateless authentication using **JSON Web Tokens (JWT)**:
    - Token generation on successful registration or login with defined expiry.
    - Bearer token verification middleware (`protect`) decoding user IDs and roles from request headers.
  - Synchronized frontend `AuthContext` and Axios interceptors to automatically transmit `Authorization: Bearer <token>` on all secure requests.
  - Built automated auth validation suite (`test_auth.js`).

### Experiment 6: Role-Based Access Control (RBAC) & Protected Routes
- **Objective:** Enforce granular authorization separating `patient` and `doctor` access rights across backend endpoints and frontend views.
- **Implementations:**
  - Implemented authorization middleware (`authorize("patient")`, `authorize("doctor")`) preventing privilege escalation.
  - Data isolation & scoped access:
    - Patients can only retrieve and schedule their own appointments (`patientId = req.user.id`).
    - Doctors can only view appointments assigned to them (`doctorId = req.user.id`).
    - Only doctors have permission to confirm or update clinical appointment statuses.
  - Developed `ProtectedRoute.jsx` component for React Router:
    - Unauthenticated requests redirect to `/login`.
    - Authenticated users with invalid roles are blocked with an "Access Denied" view.
  - Verified security via the 17-point automated test suite covering cross-role and unauthorized scenarios.

### Experiment 7: Multi-Container Dockerization & Docker Compose
- **Objective:** Package the entire multi-tier system into portable, reproducible container images orchestrated via Docker Compose.
- **Implementations:**
  - **Backend Container (`backend/Dockerfile`):**
    - Built on lightweight `node:20-alpine`.
    - Configured production dependencies and exposed port `5000`.
  - **Frontend Container (`frontend/Dockerfile`):**
    - Vite dev runtime running on Node Alpine with `--host 0.0.0.0` binding.
    - Direct access mapped to port `3000` with hot-reloading support.
  - **Docker Compose (`compose.yaml`):**
    - Multi-container orchestration managing service dependencies (`depends_on`).
    - Environment propagation linking frontend API requests directly to the backend container.
  - Optimized `.dockerignore` for both environments to exclude extraneous node modules, git objects, and local logs.
  - Resolved containerized authentication race conditions to ensure smooth startup.

---

## 🛠 System Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                   Client Browser                       │
│              http://localhost:3000                     │
└───────────────────────────┬────────────────────────────┘
                            │
               HTTP / JSON  │  REST API Calls
                            ▼
┌────────────────────────────────────────────────────────┐
│               Dockerized Frontend (Vite)               │
│        React 19 • Tailwind CSS • Axios • Context       │
└───────────────────────────┬────────────────────────────┘
                            │
               Bearer JWT   │  API Requests (Port 5000)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Dockerized Backend (Express)              │
│       Node.js • JWT Middleware • RBAC • Helmet         │
└───────────────────────────┬────────────────────────────┘
                            │
               Mongoose ORM │  Port 27017 / Cloud URI
                            ▼
┌────────────────────────────────────────────────────────┐
│                    MongoDB Database                    │
│          Collections: Doctors, Patients, Appointments  │
└────────────────────────────────────────────────────────┘
```

### Technology Breakdown

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router DOM 7, Tailwind CSS 3.4, Axios, Context API |
| **Backend** | Node.js, Express 5, Mongoose 9, jsonwebtoken, bcryptjs, express-validator |
| **Security** | Helmet HTTP headers, express-rate-limit, Role-Based Access Control (RBAC), JWT Bearer Auth |
| **Database** | MongoDB (NoSQL Database), Mongoose Schemas & Population |
| **DevOps** | Docker, Docker Compose, Multi-stage Dockerfiles, Alpine Linux |

---

## 📂 Project Directory Structure

```text
Medicare system/
├── compose.yaml                # Docker Compose multi-container configuration
├── README.md                   # Comprehensive project documentation
│
├── backend/                    # Express & Node.js API Service
│   ├── controllers/            # Request handlers (authController, etc.)
│   ├── middleware/             # Security & RBAC middleware (authMiddleware)
│   ├── models/                 # Mongoose schemas (Doctor, Patient, Appointment)
│   ├── routes/                 # Express route definitions
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── userRoutes.js
│   ├── .dockerignore           # Files excluded from backend image
│   ├── .env                    # Backend environment config
│   ├── Dockerfile              # Backend container recipe
│   ├── package.json            # Backend dependencies & scripts
│   ├── seed.js                 # Database seeder with sample accounts
│   ├── server.js               # Express application entrypoint
│   └── test_auth.js            # Automated security & RBAC test suite
│
└── frontend/                   # Vite & React Client Application
    ├── public/                 # Static assets & icons
    ├── src/
    │   ├── api/                # Axios instance & interceptors
    │   ├── components/         # Reusable UI components & ProtectedRoute
    │   ├── context/            # AuthContext, AppointmentContext, ThemeContext
    │   ├── hooks/              # Custom hooks (useFetch, useForm, useDebounce)
    │   ├── pages/              # Home, Doctors, Dashboards, Auth pages
    │   ├── App.jsx             # Route definitions & layout wrappers
    │   ├── index.css           # Tailwind CSS directives & global styling
    │   └── main.jsx            # React root mount
    ├── .dockerignore           # Files excluded from frontend image
    ├── Dockerfile              # Frontend container recipe
    ├── package.json            # Frontend dependencies & scripts
    ├── tailwind.config.js      # Tailwind theme & design tokens
    └── vite.config.js          # Vite server & port configuration
```

---

## 🔌 API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/patients/register` | Public | Register a new patient account |
| `POST` | `/api/auth/patients/login` | Public | Authenticate patient & receive JWT token |
| `POST` | `/api/auth/doctors/register` | Public | Register a new doctor account |
| `POST` | `/api/auth/doctors/login` | Public | Authenticate doctor & receive JWT token |
| `GET` | `/api/auth/profile` | Authenticated | Get current authenticated user profile |

### Appointments Endpoints (`/api/appointments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Patient Only | Schedule a new appointment |
| `GET` | `/api/appointments` | Authenticated | Retrieve role-scoped appointments |
| `GET` | `/api/appointments/:id` | Authenticated | Retrieve single appointment (patient/doctor only) |
| `PATCH` | `/api/appointments/:id` | Doctor / Patient | Update status (`Confirmed`, `Cancelled`) |
| `DELETE` | `/api/appointments/:id` | Authenticated | Delete or cancel an appointment |

### Doctors Endpoints (`/api/doctors`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Public | List all available doctors (supports `?email=` filter) |
| `GET` | `/api/doctors/:id` | Public | Get doctor details by ID |
| `POST` | `/api/doctors` | Public / Admin | Create a new doctor profile |
| `PUT` | `/api/doctors/:id` | Public / Admin | Update doctor profile details |

### RBAC Test Area (`/api/user`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/dashboard` | Any logged-in user | Validates basic JWT authentication |
| `GET` | `/api/user/patient-area` | Patient Only | Validates patient role authorization |
| `GET` | `/api/user/doctor-area` | Doctor Only | Validates doctor role authorization |

---

## 🔑 Demo Credentials

Use the following pre-seeded test accounts to explore the system:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Patient** | `john@email.com` | `password123` | Book appointments, view personal appointment history |
| **Doctor** | `sarah@medicare.com` | `password123` | View assigned appointments, confirm/cancel bookings |
| **Doctor** | `michael@medicare.com` | `password123` | View assigned appointments, update patient schedule |

---

## 🚀 Getting Started

### Option A: Running with Docker Compose (Recommended)

Run both frontend and backend in isolated containers with a single command:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imunmesh/medicare.git
   cd medicare
   ```

2. **Launch with Docker Compose:**
   ```bash
   docker compose up --build -d
   ```

3. **Verify running containers:**
   ```bash
   docker compose ps
   ```

4. **Access the application:**
   - 🌐 **Frontend UI:** [http://localhost:3000](http://localhost:3000)
   - 🔌 **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

5. **Stop containers:**
   ```bash
   docker compose down
   ```

---

### Option B: Local Development Setup

#### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Seed the database with sample data & users
npm run seed

# Start the backend server (runs on http://localhost:5000)
npm run dev
```

#### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Vite development server (runs on http://localhost:3000)
npm run dev
```

---

## 🧪 Running Automated Tests

Run the security and Role-Based Access Control (RBAC) test suite:

```bash
cd backend
node test_auth.js
```

This script verifies:
1. Patient registration and duplicate detection.
2. Patient and Doctor authentication & JWT generation.
3. Access to public vs protected endpoints.
4. Token-less request rejection (`401 Unauthorized`).
5. Role authorization verification (`403 Forbidden` on role mismatch).
6. Scoped appointment query permissions for both roles.
