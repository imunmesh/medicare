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

## Run with Docker

To run both backend and frontend inside containers using Docker Compose:

1. **Build and start the containers in detached mode**:
   ```bash
   docker compose up --build -d
   ```

2. **Verify containers are running**:
   ```bash
   docker compose ps
   ```

3. **View live logs**:
   ```bash
   docker compose logs -f
   ```

4. **Access the applications**:
   - Frontend Application: [http://localhost:3000](http://localhost:3000)
   - Backend Test Endpoint: [http://localhost:5000/api](http://localhost:5000/api)

5. **Stop the containers**:
   ```bash
   docker compose down
   ```

