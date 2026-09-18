const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// CREATE — POST /api/doctors
router.post("/", async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL (with optional email filtering) — GET /api/doctors
// Supports ?email=X for login lookup
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.email) {
      filter.email = req.query.email;
    }
    const doctors = await Doctor.find(filter).sort({ name: 1 });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET BY ID — GET /api/doctors/:id
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE (full) — PUT /api/doctors/:id
router.put("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE (partial) — PATCH /api/doctors/:id
router.patch("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE — DELETE /api/doctors/:id
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
