# Medicare System

A full-stack Medicare and appointment management system.

## Project Structure

```text
Medicare system/
├── backend/                # Express / Node.js API server
│   ├── models/             # Mongoose / Data models
│   ├── routes/             # Express API routes
│   ├── server.js           # Server entry point
│   ├── seed.js             # Database seeding script
│   ├── .env                # Backend environment configuration
│   └── package.json        # Backend dependencies & scripts
│
└── frontend/               # Vite + React Client Application
    ├── src/                # React source code (components, pages, context, etc.)
    ├── public/             # Static public assets
    ├── index.html          # HTML entry point
    ├── vite.config.js      # Vite configuration
    ├── tailwind.config.js  # Tailwind CSS configuration
    ├── .env                # Frontend environment configuration
    └── package.json        # Frontend dependencies & scripts
```

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev # or node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
