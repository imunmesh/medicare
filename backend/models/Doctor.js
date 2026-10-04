const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    rating: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    role: { type: String, default: "doctor" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
