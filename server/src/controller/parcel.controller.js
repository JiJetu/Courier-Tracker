const Parcel = require("../model/Parcel.model");

// Create a booking as parcel in db
exports.bookParcel = async (req, res) => {
  try {
    const newParcel = await Parcel.create({
      ...req.body,
      sender: req.user.userId,
    });

    res.status(201).send({ message: "Parcel booked successfully", newParcel });
  } catch (err) {
    res.status(500).send({ message: "Failed to book parcel" });
  }
};

// Fetching parcel data from db (customer will their created parcel, agent can see their assign parcel and admin can see all parcel data)
exports.getParcels = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "customer") filter.sender = req.user.userId;
    if (req.user.role === "agent") filter.assignedAgent = req.user.userId;

    const parcels = await Parcel.find(filter).populate("sender assignedAgent");

    res.send({ message: "Parcels fetched successfully", parcels });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch parcels" });
  }
};

// Updating parcel status in db by agent
exports.updateParcelStatus = async (req, res) => {
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    req.app
      .get("io")
      .to(req.params.id)
      .emit("parcelStatusUpdated", updatedParcel);

    res.send({
      message: "Parcel status updated successfully",
      updatedParcel,
    });
  } catch (err) {
    res.status(500).send({ message: "Failed to update status" });
  }
};

// (Assign agent for parcel) Updating parcel assignAgent in db
exports.assignAgent = async (req, res) => {
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: req.body.agentId },
      { new: true }
    );

    req.app
      .get("io")
      .to(req.params.id)
      .emit("parcelAgentAssigned", updatedParcel);

    res.send({ message: "Agent assigned successfully", updatedParcel });
  } catch (err) {
    res.status(500).send({ message: "Failed to assign agent" });
  }
};

exports.trackParcel = async (req, res) => {
  try {
    const updated = await Parcel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          trackingCoordinates: {
            lat: req.body.lat,
            lng: req.body.lng,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    req.app.get("io").to(req.params.id).emit("parcelLocationUpdated", updated);

    res.send({ message: "Location updated", updated });
  } catch (err) {
    res.status(500).send({ message: "Failed to update location" });
  }
};
