const userRole = require("../constant");
const Parcel = require("../model/Parcel.model");
const User = require("../model/User.model");
const { sendMail } = require("../utils/sendMail");
const converter = require("json-2-csv");
const PDFDocument = require("pdfkit");

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

    const role = req.user.role;
    const userId = req.user.userId;

    // Customer can only see their own parcels
    if (role === userRole.Customer && parcel.sender._id.toString() !== userId) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    // Agent can only see assigned parcels
    if (
      role === userRole.Agent &&
      (!parcel.assignedAgent || parcel.assignedAgent._id.toString() !== userId)
    ) {
      return res.status(403).send({ message: "Forbidden access" });
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
    req.app.get("io").emit("parcelStatusUpdated", updatedParcel);

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
    req.app.get("io").emit("parcelAgentAssigned", updatedParcel);
    req.app.get("io").emit("parcelStatusUpdated", updatedParcel);

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

// Agent active assign parcel without pagination
exports.getActiveAssignedParcels = async (req, res) => {
  try {
    const filter = {
      assignedAgent: req?.user?.userId,
      status: { $in: ["Picked Up", "In Transit"] },
    };
    const parcels = await Parcel.find(filter).populate("sender assignedAgent");
    res.send({ message: "Active parcels fetched", parcels });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch active parcels" });
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

// Delete parcel (Admin only)
exports.deleteParcel = async (req, res) => {
  try {
    const deletedParcel = await Parcel.findByIdAndDelete(req.params.id);

    if (!deletedParcel) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    res.send({ message: "Parcel deleted successfully", deletedParcel });
  } catch (err) {
    console.error("Delete Parcel Error:", err);
    res.status(500).send({ message: "Failed to delete parcel" });
  }
};

//  Export CSV
exports.exportParcelsCSV = async (req, res) => {
  try {
    const parcels = await Parcel.find().populate("sender assignedAgent");

    const formatted = parcels.map((p) => ({
      ParcelType: p.parcelType,
      Status: p.status,
      PickupAddress: p.pickupAddress,
      DeliveryAddress: p.deliveryAddress,
      Amount: p.amount,
      COD: p.isCOD ? "Yes" : "No",
    }));

    const csv = await converter.json2csv(formatted);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=parcels.csv");

    res.status(200).send(csv);
  } catch (err) {
    console.error("CSV Export Error", err);
    res.status(500).json({ message: "Failed to export CSV" });
  }
};

// Export PDF
exports.exportParcelsPDF = async (req, res) => {
  try {
    const parcels = await Parcel.find().populate("sender assignedAgent");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=parcels.pdf");
    doc.pipe(res);

    doc.fontSize(20).text("CourierTracker Parcel Report", { align: "center" });
    doc.moveDown();

    parcels.forEach((p, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}) ${p.parcelType} (${p.status})\nPickup: ${
            p.pickupAddress
          }\nDelivery: ${p.deliveryAddress}\nAmount: ${p.amount}, COD: ${
            p.isCOD ? "Yes" : "No"
          }`
        );

      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error("PDF Export Error", err);
    res.status(500).json({ message: "Failed to export PDF" });
  }
};
