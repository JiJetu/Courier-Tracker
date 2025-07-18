const moment = require("moment");
const Parcel = require("../model/Parcel.model");
const User = require("../model/User.model");
const userRole = require("../constant");
const mongoose = require("mongoose");

exports.getDashboardMetrics = async (req, res) => {
  try {
    const totalBookings = await Parcel.countDocuments();
    const deliveredBookings = await Parcel.countDocuments({
      status: "Delivered",
    });
    const failedBookings = await Parcel.countDocuments({ status: "Failed" });

    const totalCustomers = await User.countDocuments({
      role: userRole.Customer,
    });
    const totalAgents = await User.countDocuments({ role: userRole.Agent });

    const totalCODAmount = await Parcel.aggregate([
      { $match: { isCOD: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    console.log(totalCODAmount);
    const totalBookingAmount = await Parcel.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    const todayBookings = await Parcel.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const last10DaysStats = await Parcel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment().subtract(9, "days").startOf("day").toDate(),
            $lte: moment().endOf("day").toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.send({
      message: "Dashboard metrics fetched successfully",
      data: {
        totalBookings,
        deliveredBookings,
        failedBookings,
        totalCODAmount: totalCODAmount[0]?.total || 0,
        totalBookingAmount: totalBookingAmount[0]?.total || 0,
        todayBookings,
        last10DaysStats,
        totalCustomers,
        totalAgents,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch dashboard metrics" });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: userRole.Agent });
    res.send({ message: "Agents fetched successfully", agents });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch agents" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password"
    );
    res.send({ message: "Users fetched successfully", users });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users" });
  }
};

//  Block or unblock user
exports.toggleBlockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.send({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to toggle user status" });
  }
};

// customer metrics
exports.getCustomerDashboardMetrics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const totalBookings = await Parcel.countDocuments({ sender: userId });
    const deliveredBookings = await Parcel.countDocuments({
      sender: userId,
      status: "Delivered",
    });
    const failedBookings = await Parcel.countDocuments({
      sender: userId,
      status: "Failed",
    });

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    const todayBookings = await Parcel.countDocuments({
      sender: userId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const last10DaysStats = await Parcel.aggregate([
      {
        $match: {
          sender: userId,
          createdAt: {
            $gte: moment().subtract(9, "days").startOf("day").toDate(),
            $lte: moment().endOf("day").toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.send({
      message: "Customer dashboard metrics fetched successfully",
      data: {
        totalBookings,
        deliveredBookings,
        failedBookings,
        todayBookings,
        last10DaysStats,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to fetch metrics" });
  }
};

// customer metrics
exports.getAgentDashboardMetrics = async (req, res) => {
  try {
    const agentId = new mongoose.Types.ObjectId(req.user.userId);

    const totalAssigned = await Parcel.countDocuments({
      assignedAgent: agentId,
    });
    const delivered = await Parcel.countDocuments({
      assignedAgent: agentId,
      status: "Delivered",
    });
    const failed = await Parcel.countDocuments({
      assignedAgent: agentId,
      status: "Failed",
    });

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    const todayAssigned = await Parcel.countDocuments({
      assignedAgent: agentId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const last10DaysStats = await Parcel.aggregate([
      {
        $match: {
          assignedAgent: agentId,
          createdAt: {
            $gte: moment().subtract(9, "days").startOf("day").toDate(),
            $lte: moment().endOf("day").toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.send({
      message: "Agent dashboard metrics fetched successfully",
      data: {
        totalAssigned,
        delivered,
        failed,
        todayAssigned,
        last10DaysStats,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch agent metrics" });
  }
};

// Update profile (name & image)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const { name, image } = req.body;
    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

    res.send({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).send({ message: "Failed to update profile" });
  }
};

// Get my profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send({ message: "Profile fetched", user });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch profile" });
  }
};
