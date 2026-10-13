const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { protect, authorize } = require("../middleware/authMiddleware");

// CREATE — POST /api/appointments (Protected: Patient only)
// Set patientId from req.user.id (do not trust body)
router.post("/", protect, authorize("patient"), async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      patientId: req.user.id,
    };
    const appointment = await Appointment.create(appointmentData);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL — GET /api/appointments (Protected)
// Patients only get their own appointments (filter by req.user.id),
// doctors only get appointments where doctorId = req.user.id.
router.get("/", protect, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "patient") {
      filter.patientId = req.user.id;
    } else if (req.user.role === "doctor") {
      filter.doctorId = req.user.id;
    }
    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET BY ID — GET /api/appointments/:id (Protected)
router.get("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const isPatient = String(appointment.patientId) === String(req.user.id);
    const isDoctor = String(appointment.doctorId) === String(req.user.id);
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: "Access denied. You do not have permission." });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper for PUT and PATCH updates
const handleAppointmentUpdate = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const newStatus = req.body.status;

    if (newStatus === "confirmed" || newStatus === "completed") {
      if (req.user.role !== "doctor" || String(appointment.doctorId) !== String(req.user.id)) {
        return res.status(403).json({ message: "Access denied. You do not have permission." });
      }
    } else if (newStatus === "cancelled") {
      const isPatient = String(appointment.patientId) === String(req.user.id);
      const isDoctor = String(appointment.doctorId) === String(req.user.id);
      if (!isPatient && !isDoctor) {
        return res.status(403).json({ message: "Access denied. You do not have permission." });
      }
    } else {
      const isPatient = String(appointment.patientId) === String(req.user.id);
      const isDoctor = String(appointment.doctorId) === String(req.user.id);
      if (!isPatient && !isDoctor) {
        return res.status(403).json({ message: "Access denied. You do not have permission." });
      }
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE (full) — PUT /api/appointments/:id (Protected)
router.put("/:id", protect, handleAppointmentUpdate);

// UPDATE (partial) — PATCH /api/appointments/:id (Protected)
router.patch("/:id", protect, handleAppointmentUpdate);

// Specific Status Endpoints for Confirm / Complete / Cancel
router.patch("/:id/confirm", protect, authorize("doctor"), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (String(appointment.doctorId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied. You do not have permission." });
    }
    appointment.status = "confirmed";
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/complete", protect, authorize("doctor"), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (String(appointment.doctorId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied. You do not have permission." });
    }
    appointment.status = "completed";
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const isPatient = String(appointment.patientId) === String(req.user.id);
    const isDoctor = String(appointment.doctorId) === String(req.user.id);
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: "Access denied. You do not have permission." });
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE — DELETE /api/appointments/:id (Protected: Doctor only)
router.delete("/:id", protect, authorize("doctor"), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (String(appointment.doctorId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied. You do not have permission." });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
