const express = require("express");
const userRole = require("../constant");
const {
  getDashboardMetrics,
  getAllAgents,
  getAllUsers,
  toggleBlockUser,
  getCustomerDashboardMetrics,
  getAgentDashboardMetrics,
  updateProfile,
  getMyProfile,
} = require("../controller/user.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/customer/dashboard-metrics",
  auth(userRole.Customer),
  getCustomerDashboardMetrics
);
router.get(
  "/agent/dashboard-metrics",
  auth(userRole.Agent),
  getAgentDashboardMetrics
);
router.patch(
  "/profile",
  auth(userRole.Customer, userRole.Agent, userRole.Admin),
  updateProfile
);

router.get(
  "/profile",
  auth(userRole.Customer, userRole.Agent, userRole.Admin),
  getMyProfile
);

router.get(
  "/admin/dashboard-metrics",
  auth(userRole.Admin),
  getDashboardMetrics
);
router.get("/admin/agents", auth(userRole.Admin), getAllAgents);
router.get("/admin/users", auth(userRole.Admin), getAllUsers);
router.patch("/admin/users/:id", auth(userRole.Admin), toggleBlockUser);

module.exports = router;
