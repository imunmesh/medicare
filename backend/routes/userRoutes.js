const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/user/dashboard -> protect only (any logged-in role)
router.get("/dashboard", protect, (req, res) => {
  res.status(200).json({
    message: "Welcome to the protected dashboard",
    user: req.user,
  });
});

// GET /api/user/patient-area -> protect, authorize("patient")
router.get("/patient-area", protect, authorize("patient"), (req, res) => {
  res.status(200).json({
    message: "Welcome Patient! You can access this page.",
  });
});

// GET /api/user/doctor-area -> protect, authorize("doctor")
router.get("/doctor-area", protect, authorize("doctor"), (req, res) => {
  res.status(200).json({
    message: "Welcome Doctor! You can access this page.",
  });
});

module.exports = router;
