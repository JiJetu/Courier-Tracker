const express = require("express");
const {
  bookParcel,
  getParcels,
  updateParcelStatus,
  assignAgent,
  trackParcel,
} = require("../controller/parcel.controller");
const { auth } = require("../middlewares/auth.middleware");
const userRole = require("../constant");

const router = express.Router();

router.post("/", auth(userRole.Customer), bookParcel);
router.get(
  "/",
  auth(userRole.Customer, userRole.Admin, userRole.Agent),
  getParcels
);
router.patch("/:id/status", auth(userRole.Agent), updateParcelStatus);
router.patch("/:id/assign", auth(userRole.Admin), assignAgent);
router.patch("/:id/track", auth(userRole.Agent), trackParcel);

module.exports = router;
