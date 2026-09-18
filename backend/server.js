const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Connection Error:", error));

// Routes
app.get("/", (req, res) => res.send("MediCare API is Running"));
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
