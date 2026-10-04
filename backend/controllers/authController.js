const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// Helper to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Register Patient
const registerPatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    const { name, email, password, phone } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingPatient = await Patient.findOne({ email: normalizedEmail });
    if (existingPatient) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = await Patient.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : undefined,
      role: "patient",
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: newPatient._id,
    });
  } catch (error) {
    console.error("Register patient error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

// Register Doctor
const registerDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    const { name, email, password, specialization, experience, rating, available } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingDoctor = await Doctor.findOne({ email: normalizedEmail });
    if (existingDoctor) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = await Doctor.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      specialization: specialization ? specialization.trim() : "General Physician",
      experience: experience || 0,
      rating: rating || 0,
      available: available !== undefined ? available : true,
      role: "doctor",
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: newDoctor._id,
    });
  } catch (error) {
    console.error("Register doctor error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

// Login Patient
const loginPatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const patient = await Patient.findOne({ email: normalizedEmail });
    if (!patient) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(patient._id, "patient");

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        role: "patient",
        phone: patient.phone,
      },
    });
  } catch (error) {
    console.error("Login patient error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// Login Doctor
const loginDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const doctor = await Doctor.findOne({ email: normalizedEmail });
    if (!doctor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(doctor._id, "doctor");

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: "doctor",
        specialization: doctor.specialization,
        rating: doctor.rating,
        experience: doctor.experience,
        available: doctor.available,
      },
    });
  } catch (error) {
    console.error("Login doctor error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// Get Profile (Protected route)
const getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user = null;
    if (role === "doctor") {
      user = await Doctor.findById(id).select("-password");
    } else if (role === "patient") {
      user = await Patient.findById(id).select("-password");
    } else {
      // Fallback search across both
      user = (await Patient.findById(id).select("-password")) ||
             (await Doctor.findById(id).select("-password"));
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Server error retrieving profile" });
  }
};

module.exports = {
  registerPatient,
  registerDoctor,
  loginPatient,
  loginDoctor,
  getProfile,
};
