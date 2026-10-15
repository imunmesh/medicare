const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "fromModel",
    },
    fromModel: {
      type: String,
      enum: ["Doctor", "Patient"],
      default: "Patient",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "toModel",
    },
    toModel: {
      type: String,
      enum: ["Doctor", "Patient"],
      default: "Doctor",
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    senderName: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

messageSchema.index({ from: 1, to: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
