const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// CREATE — POST /api/appointments
router.post("/", async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL (with optional query filtering) — GET /api/appointments
// Supports ?patientId=X and ?doctorId=X
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.patientId) {
      filter.patientId = req.query.patientId;
    }
    if (req.query.doctorId) {
      filter.doctorId = req.query.doctorId;
    }
    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET BY ID — GET /api/appointments/:id
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE (full) — PUT /api/appointments/:id
router.put("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE (partial) — PATCH /api/appointments/:id
// Needed because the frontend uses axiosInstance.patch() for cancel/confirm
router.patch("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE — DELETE /api/appointments/:id
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
