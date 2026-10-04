const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerPatient,
  registerDoctor,
  loginPatient,
  loginDoctor,
  getProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Patient Routes
router.post(
  "/patients/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  registerPatient
);

router.post(
  "/patients/login",
  [
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginPatient
);

router.get("/patients/profile", protect, getProfile);

// Doctor Routes
router.post(
  "/doctors/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  registerDoctor
);

router.post(
  "/doctors/login",
  [
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginDoctor
);

router.get("/doctors/profile", protect, getProfile);

// General Profile route
router.get("/profile", protect, getProfile);

module.exports = router;
