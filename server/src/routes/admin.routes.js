const express = require("express");
const userRole = require("../constant");
const { getDashboardMetrics } = require("../controller/admin.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/dashboard-metrics", auth(userRole.Admin), getDashboardMetrics);

module.exports = router;
