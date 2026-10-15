const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

// GET /api/chat/contacts -> all users except the caller, returning { _id, name, role }
router.get("/contacts", protect, async (req, res) => {
  try {
    const callerId = req.user.id;
    const [doctors, patients] = await Promise.all([
      Doctor.find({ _id: { $ne: callerId } }).select("_id name role specialization"),
      Patient.find({ _id: { $ne: callerId } }).select("_id name role"),
    ]);

    const formattedDoctors = doctors.map((d) => ({
      _id: d._id,
      name: d.name,
      role: d.role || "doctor",
      specialization: d.specialization || "Doctor",
    }));

    const formattedPatients = patients.map((p) => ({
      _id: p._id,
      name: p.name,
      role: p.role || "patient",
    }));

    const allContacts = [...formattedDoctors, ...formattedPatients];
    res.status(200).json(allContacts);
  } catch (error) {
    console.error("Error fetching chat contacts:", error);
    res.status(500).json({ message: "Server error fetching chat contacts" });
  }
});

// GET /api/chat/:otherUserId -> messages between req.user and otherUserId, oldest first
router.get("/:otherUserId", protect, async (req, res) => {
  try {
    const callerId = req.user.id;
    const otherUserId = req.params.otherUserId;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const callerObjId = new mongoose.Types.ObjectId(callerId);
    const otherUserObjId = new mongoose.Types.ObjectId(otherUserId);

    const messages = await Message.find({
      $or: [
        { from: callerObjId, to: otherUserObjId },
        { from: otherUserObjId, to: callerObjId },
        { from: String(callerId), to: String(otherUserId) },
        { from: String(otherUserId), to: String(callerId) },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Server error fetching chat messages" });
  }
});

module.exports = router;
