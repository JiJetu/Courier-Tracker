const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    parcelType: { type: String, required: true },
    isCOD: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Booked", "Picked Up", "In Transit", "Delivered", "Failed"],
      default: "Booked",
    },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    trackingCoordinates: [
      {
        lat: Number,
        lng: Number,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

const Parcel = mongoose.model("Parcel", parcelSchema);
module.exports = Parcel;
