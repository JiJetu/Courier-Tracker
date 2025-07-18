const userRole = require("../constant");
const Parcel = require("../model/Parcel.model");
const User = require("../model/User.model");
const { sendMail } = require("../utils/sendMail");

// Create a booking as parcel in db
exports.bookParcel = async (req, res) => {
  try {
    const newParcel = await Parcel.create({
      ...req.body,
      sender: req.user.userId,
    });

    // sending mail to admin
    try {
      const admin = await User.findOne({ role: userRole.Admin });
      if (admin) {
        await sendMail({
          to: admin?.email,
          subject: "📦 New parcel has been booked",
          html: `<p>New parcel booked by ${req?.user?.email}</p>
                 <p>Pickup Address: ${newParcel.pickupAddress}</p>`,
        });
      }
    } catch (err) {
      console.error("❌ Error sending booking email to admin:", err);
    }

    res.status(201).send({ message: "Parcel booked successfully", newParcel });
  } catch (err) {
    res.status(500).send({ message: "Failed to book parcel" });
  }
};

// Fetching parcel data from db (customer will their created parcel, agent can see their assign parcel and admin can see all parcel data)
exports.getParcels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req?.user?.role === userRole.Customer)
      filter.sender = req?.user?.userId;
    if (req?.user?.role === userRole.Agent)
      filter.assignedAgent = req?.user?.userId;

    const total = await Parcel.countDocuments(filter);

    const parcels = await Parcel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("sender assignedAgent");

    res.send({
      message: "Parcels fetched successfully",
      data: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        parcels,
      },
    });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch parcels" });
  }
};

exports.getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id).populate(
      "sender assignedAgent"
    );

    if (!parcel) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    res.send({ message: "Parcel fetched", parcel });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch parcel" });
  }
};

// Updating parcel status in db by agent and also update parcel status in realtime by socket.io
exports.updateParcelStatus = async (req, res) => {
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    // socket.io event
    req.app
      .get("io")
      .to(req.params.id)
      .emit("parcelStatusUpdated", updatedParcel);

    // send mail to customer
    try {
      const customer = await User.findById(updatedParcel.sender);
      if (customer) {
        await sendMail({
          to: customer?.email,
          subject: "🚚 Parcel status updated",
          html: `<p>Your parcel status has been updated to: <b>${updatedParcel?.status}</b></p>`,
        });
      }
    } catch (err) {
      console.error("❌ Error sending status update email:", err);
    }

    res.send({
      message: "Parcel status updated successfully",
      updatedParcel,
    });
  } catch (err) {
    res.status(500).send({ message: "Failed to update status" });
  }
};

// (Assign agent for parcel) Updating parcel assignAgent in db and also update parcel assignAgent in realtime by socket.io
exports.assignAgent = async (req, res) => {
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: req.body.agentId, status: "Booked" },
      { new: true }
    );

    // socket.io event
    req.app
      .get("io")
      .to(req.params.id)
      .emit("parcelAgentAssigned", updatedParcel);

    // send mail to agent
    try {
      const agent = await User.findById(req.body.agentId);
      if (agent) {
        await sendMail({
          to: agent?.email,
          subject: "🚚 New parcel assignment",
          html: `<p>A new parcel has been assigned to you.</p>
                 <p>Delivery Address: ${updatedParcel?.deliveryAddress}</p>`,
        });
      }
    } catch (err) {
      console.error("❌ Error sending assignment email to agent:", err);
    }

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
