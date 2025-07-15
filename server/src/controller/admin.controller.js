const moment = require("moment");
const Parcel = require("../model/Parcel.model");
const User = require("../model/User.model");
const userRole = require("../constant");

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
