const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
require("dotenv").config();

const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const Doctor = require("./models/Doctor");
const Patient = require("./models/Patient");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

// Dynamic CORS configuration for local development & Vercel production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .forEach((url) => {
      if (url && !allowedOrigins.includes(url)) {
        allowedOrigins.push(url);
      }
    });
}

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^https?:\/\/.*\.vercel\.app$/.test(origin)) return true;
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
};

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions,
});

// Socket Authentication Middleware
io.use(async (socket, next) => {
  try {
    let token = socket.handshake.auth && socket.handshake.auth.token;
    if (token && typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let name = decoded.name;
      if (!name) {
        if (decoded.role === "doctor") {
          const doc = await Doctor.findById(decoded.id).select("name");
          if (doc) name = doc.name;
        } else {
          const pat = await Patient.findById(decoded.id).select("name");
          if (pat) name = pat.name;
        }
      }

      socket.user = {
        id: String(decoded.id),
        name: name || (decoded.role === "doctor" ? "Doctor" : "Patient"),
        role: decoded.role,
      };

      socket.join(String(decoded.id));
    }
  } catch (err) {
    // If invalid or missing, do NOT disconnect; leave socket.user unset
  }
  next();
});

// Socket.io Connection & Events
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  if (socket.user && socket.user.id) {
    socket.join(String(socket.user.id));
  }

  // Private Message Event
  socket.on("privateMessage", async (payload) => {
    try {
      // Ignore if socket.user is not set
      if (!socket.user || !socket.user.id) {
        return;
      }

      const senderId = String(socket.user.id);
      const senderName = socket.user.name;
      const senderRole = socket.user.role;

      const { to, text } = payload || {};
      if (!to || !mongoose.Types.ObjectId.isValid(to)) {
        return;
      }

      const trimmedText = typeof text === "string" ? text.trim() : "";
      if (!trimmedText || trimmedText.length > 1000) {
        return;
      }

      // Check recipient existence and role
      let recipient = await Doctor.findById(to).select("_id role");
      let recipientRole = "doctor";
      let toModel = "Doctor";

      if (!recipient) {
        recipient = await Patient.findById(to).select("_id role");
        recipientRole = "patient";
        toModel = "Patient";
      }

      if (!recipient) {
        return; // Recipient not found
      }

      // Allowed pairs: doctor-doctor, doctor-patient, patient-doctor. Reject patient-patient.
      if (senderRole === "patient" && recipientRole === "patient") {
        return;
      }

      const fromModel = senderRole === "doctor" ? "Doctor" : "Patient";
      const message = await Message.create({
        from: senderId,
        fromModel,
        to: recipient._id,
        toModel,
        text: trimmedText,
        senderName: senderName,
        createdAt: new Date(),
      });

      const messagePayload = {
        _id: message._id,
        from: senderId,
        to: String(recipient._id),
        text: message.text,
        createdAt: message.createdAt,
        senderName: senderName,
      };

      // Emit to both recipient and sender room only
      io.to(String(to)).emit("privateMessage", messagePayload);
      io.to(String(senderId)).emit("privateMessage", messagePayload);
    } catch (err) {
      console.error("Error processing privateMessage:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Make io accessible to route handlers
app.set("io", io);

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use(limiter);

// Standard Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Connection Error:", error));

// Routes
app.get("/", (req, res) => res.send("MediCare API is Running"));
app.get("/api", (req, res) => res.json({ message: "Backend is running inside Docker!" }));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/chat", chatRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
