# 🏥 MediCare - Healthcare & Appointment Management System

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%26%20Bcrypt-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

A full-stack, enterprise-grade healthcare and doctor appointment management platform built with modern web technologies. The project has progressed through 8 incremental engineering experiments—from foundational UI and state architecture to secure RESTful microservices, Role-Based Access Control (RBAC), multi-container Dockerization, and real-time WebSockets with Socket.IO.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Comprehensive Experiments Roadmap (Exp 1 - 8)](#-comprehensive-experiments-roadmap-exp-1---8)
  - [Experiment 1: Frontend Initialization & UI Component Architecture](#experiment-1-frontend-initialization--ui-component-architecture)
  - [Experiment 2: React Hooks, Dynamic State & REST API Integration](#experiment-2-react-hooks-dynamic-state--rest-api-integration)
  - [Experiment 3: Centralized State Management (Context API) & Client CRUD](#experiment-3-centralized-state-management-context-api--client-crud)
  - [Experiment 4: Full-Stack Architecture - Express API & MongoDB Integration](#experiment-4-full-stack-architecture---express-api--mongodb-integration)
  - [Experiment 5: Backend Authentication & Secure Password Management](#experiment-5-backend-authentication--secure-password-management)
  - [Experiment 6: Role-Based Access Control (RBAC) & Protected Routes](#experiment-6-role-based-access-control-rbac--protected-routes)
  - [Experiment 7: Multi-Container Dockerization & Docker Compose](#experiment-7-multi-container-dockerization--docker-compose)
  - [Experiment 8: Real-Time Communication with WebSockets (Socket.IO)](#experiment-8-real-time-communication-with-websockets-socketio)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [API & WebSocket Reference](#-api--websocket-reference)
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
- Real-time bidirectional WebSocket communication: live appointment status toasts, instant dashboard synchronization with zero page reload, and private doctor-patient consultations.

---

## 🔬 Comprehensive Experiments Roadmap (Exp 1 - 8)

| Experiment | Focus Area | Key Deliverables & Achievements |
| :--- | :--- | :--- |
| **EXP-1** | **UI Architecture & Layouts** | Vite + React frontend, Tailwind CSS design system, modular UI components (`Navbar`, `Footer`, `Button`, `Card`, `Modal`), responsive dashboards. |
| **EXP-2** | **Hooks & API Integration** | Custom hooks (`useFetch`, `useForm`, `useDebounce`), dynamic form validation, `ThemeContext` (Dark/Light mode), REST API integration. |
| **EXP-3** | **Context State & Client CRUD** | Centralized `AppointmentContext`, full client-side CRUD operations (Book, Confirm, Cancel), authentication UI guards. |
| **EXP-4** | **Decoupled Backend & Database** | Full-stack separation (`frontend/` & `backend/`), Express REST API, MongoDB connection via Mongoose, schemas (`Doctor`, `Appointment`). |
| **EXP-5** | **Authentication & Security** | Patient registration & login, password hashing with `bcryptjs`, stateless JWT authentication, JWT verification middleware (`protect`), auth test suite. |
| **EXP-6** | **Role-Based Access Control (RBAC)** | Multi-role authorization (`patient` vs `doctor`), endpoint security (`authorize`), scoped appointment queries, frontend `ProtectedRoute` wrapper. |
| **EXP-7** | **Containerization & Orchestration** | Multi-container Docker deployment (`Dockerfile` for backend & frontend), unified `compose.yaml`, isolated bridge network, port bindings (3000 & 5000). |
| **EXP-8** | **WebSockets & Real-Time Chat** | Integrated Socket.IO, JWT handshake auth, real-time appointment notifications, live dashboard sync with no reload, private chat (`Message` schema, pair validation), notification bell & badge. |

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

### Experiment 2: React Hooks, Dynamic State & REST API Integration
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
  - Connected frontend to API endpoints via Axios instance with structured error handling.

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
- **Objective:** Establish an enterprise decoupled full-stack architecture with persistent NoSQL storage.
- **Implementations:**
  - Restructured repository into standalone `frontend/` and `backend/` micro-packages.
  - Engineered **Node.js** & **Express** REST API server:
    - Structured routes, controllers, middleware, and environment config (`.env`).
    - Configured CORS, Helmet security headers, and Express rate limiting.
  - Integrated **MongoDB** using **Mongoose ORM**:
    - `Doctor` model: Name, email, specialization, experience, fees, availability, rating.
    - `Appointment` model: References to patient and doctor IDs, date, time slot, symptoms, and appointment status.
  - Designed schema models for Doctors and Appointments with MongoDB Atlas persistence.

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
  - Verified security via the 22-point automated test suite covering cross-role and unauthorized scenarios.

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

### Experiment 8: Real-Time Communication with WebSockets (Socket.IO)
- **Objective:** Enable instantaneous bidirectional event streaming, live notifications, real-time dashboard state synchronization without page reloads, and secure role-restricted private chat.
- **Implementations:**
  - **Backend WebSocket Server:**
    - Integrated **Socket.IO** wrapped around HTTP server in `server.js` listening on `0.0.0.0:5000`.
    - CORS configured for frontend origins (`http://localhost:3000` and `http://localhost:5173`).
    - Socket authentication via `io.use()` handshake middleware verifying JWT and joining personal rooms (`socket.join(userId)`).
    - Connection logging: `"A user connected: <socket.id>"` and `"A user disconnected"`.
  - **Real-Time Appointment Notifications:**
    - App set `io` accessible in appointment routes (`app.set("io", io)`).
    - Emits `appointmentCreated` to doctor room upon patient booking.
    - Emits `appointmentUpdated` to patient room on doctor confirmation.
    - Emits `appointmentUpdated` to the opposite party upon appointment cancellation.
  - **Private Chat Architecture:**
    - Created `backend/models/Message.js`: Indexed on `(from, to, createdAt)`.
    - REST endpoints: `GET /api/chat/contacts` (all users except caller) and `GET /api/chat/:otherUserId` (chronological message history).
    - Socket event `privateMessage`: validates recipient, sender identity enforced via `socket.user`, role pair check (allows doctor-doctor, doctor-patient, patient-doctor; blocks patient-patient), saving to DB and emitting only to sender and recipient rooms.
  - **Frontend Real-Time Client (`frontend/src/context/SocketContext.jsx` & `Chat.jsx`):**
    - `SocketContext` managing lifecycle, connection status, global toasts, and unread counters.
    - Dynamic toasts on incoming booking, confirmation, and cancellation events.
    - Notification bell with unread badge in Navbar.
    - Live `AppointmentContext` cache updating without page reloads.
    - Dedicated `Chat.jsx` page (`/chat`) with contacts search, conversation thread, auto-scrolling, Enter-to-send, and conversation persistence across page reloads.
  - Verified with 16-point automated WebSocket and chat test suite (`test_exp8.js`).

---

## 🛠 System Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                   Client Browser                       │
│              http://localhost:3000                     │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
  HTTP / REST  │ API Calls                │ WebSockets (Socket.IO)
               │ (Axios)                  │ Bidirectional Events
               ▼                          ▼
┌────────────────────────────────────────────────────────┐
│               Dockerized Frontend (Vite)               │
│     React 19 • Tailwind CSS • SocketContext • Context  │
└───────────────────────────┬────────────────────────────┘
                            │
               Bearer JWT   │  API Requests & Socket Handshake
                            ▼
┌────────────────────────────────────────────────────────┐
│              Dockerized Backend (Express)              │
│       Node.js • Socket.IO • JWT • RBAC • Helmet        │
└───────────────────────────┬────────────────────────────┘
                            │
               Mongoose ORM │  Port 27017 / Cloud URI
                            ▼
┌────────────────────────────────────────────────────────┐
│                    MongoDB Database                    │
│      Collections: Doctors, Patients, Appointments,     │
│                   Messages                             │
└────────────────────────────────────────────────────────┘
```

### Technology Breakdown

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router DOM 7, Tailwind CSS 3.4, Socket.io-client 4.8, Axios, Context API |
| **Backend** | Node.js, Express 5, Socket.io 4.8, Mongoose 9, jsonwebtoken, bcryptjs, express-validator |
| **Real-Time** | WebSockets (Socket.IO), Handshake JWT Auth, Targeted Room Emissions, Bidirectional Messaging |
| **Security** | Helmet headers, express-rate-limit, Role-Based Access Control (RBAC), JWT Bearer Auth |
| **Database** | MongoDB (NoSQL Database), Mongoose Schemas & Indexing |
| **DevOps** | Docker, Docker Compose, Volume Mounts, Alpine Linux |

---

## 📂 Project Directory Structure

```text
Medicare system/
├── compose.yaml                # Docker Compose multi-container configuration
├── README.md                   # Comprehensive project documentation
│
├── backend/                    # Express & Node.js API & Socket.IO Service
│   ├── controllers/            # Request handlers (authController, etc.)
│   ├── middleware/             # Security & RBAC middleware (authMiddleware)
│   ├── models/                 # Mongoose schemas (Doctor, Patient, Appointment, Message)
│   ├── routes/                 # Express route definitions
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── userRoutes.js
│   ├── .dockerignore           # Files excluded from backend image
│   ├── .env                    # Backend environment config
│   ├── Dockerfile              # Backend container recipe
│   ├── package.json            # Backend dependencies & scripts
│   ├── server.js               # Express & Socket.io server entrypoint
│   ├── test_auth.js            # Automated security & RBAC test suite
│   └── test_exp8.js            # Automated Socket.IO & chat test suite
│
└── frontend/                   # Vite & React Client Application
    ├── public/                 # Static assets & icons
    ├── src/
    │   ├── api/                # Axios instance & interceptors
    │   ├── components/         # Reusable UI components, Navbar, ProtectedRoute
    │   ├── context/            # AuthContext, SocketContext, AppointmentContext, ThemeContext
    │   ├── hooks/              # Custom hooks (useFetch, useForm, useDebounce)
    │   ├── pages/              # Home, Doctors, Dashboards, Chat, Auth pages
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

## 🔌 API & WebSocket Reference

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
| `POST` | `/api/appointments` | Patient Only | Schedule a new appointment (emits `appointmentCreated`) |
| `GET` | `/api/appointments` | Authenticated | Retrieve role-scoped appointments |
| `GET` | `/api/appointments/:id` | Authenticated | Retrieve single appointment (patient/doctor only) |
| `PATCH` | `/api/appointments/:id/confirm` | Doctor Only | Confirm appointment (emits `appointmentUpdated`) |
| `PATCH` | `/api/appointments/:id/cancel` | Doctor / Patient | Cancel appointment (emits `appointmentUpdated`) |
| `DELETE` | `/api/appointments/:id` | Doctor Only | Delete an appointment record |

### Real-Time Chat Endpoints (`/api/chat`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chat/contacts` | Authenticated | List all users except caller `{ _id, name, role }` |
| `GET` | `/api/chat/:otherUserId` | Authenticated | Retrieve chronological chat messages between users |

### Socket.IO WebSocket Events
| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `appointmentCreated` | Server $\rightarrow$ Client | Populated Appointment | Sent to doctor's room on booking |
| `appointmentUpdated` | Server $\rightarrow$ Client | Populated Appointment | Sent to opposite party on confirm/cancel |
| `privateMessage` | Client $\rightarrow$ Server | `{ to, text }` | Client sends message to recipient |
| `privateMessage` | Server $\rightarrow$ Client | `{ _id, from, to, text, senderName, createdAt }` | Delivered only to sender and recipient |

---

## 👤 User Registration & Roles

MediCare uses real MongoDB storage with JWT authentication. You can create accounts directly via the Registration page:

- **Patient:** Click **Register** on the navbar or login screen, select **Patient**, and provide your name, email, phone, and password. Once registered, book appointments, receive real-time notifications, and chat with doctors.
- **Doctor:** Select **Doctor** on the registration screen, enter your name, email, phone, password, and specialization (e.g. *Cardiologist*, *Neurologist*, *Pediatrician*). Once registered, your profile immediately appears on the Doctors list and Home page for patients to book visits.

---

## 🚀 Getting Started

### Option A: Running with Docker Compose (Recommended)

Run both frontend and backend in isolated containers with a single command:

1. **Launch with Docker Compose:**
   ```bash
   docker compose up --build -d
   ```

2. **Verify running containers:**
   ```bash
   docker compose ps
   ```

3. **Access the application:**
   - 🌐 **Frontend UI:** [http://localhost:3000](http://localhost:3000)
   - 🔌 **Backend API & WebSockets:** [http://localhost:5000](http://localhost:5000)

4. **Stop containers:**
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

Run the security, RBAC, and WebSocket test suites:

```bash
cd backend

# Run RBAC security tests (22 test assertions)
node test_auth.js

# Run Experiment 8 Socket.IO & Chat tests (16 test assertions)
node test_exp8.js
```
