const express = require("express");
const {
  bookParcel,
  getParcels,
  updateParcelStatus,
  assignAgent,
  trackParcel,
  getParcelById,
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
router.get(
  "/:id",
  auth(userRole.Customer, userRole.Agent, userRole.Admin),
  getParcelById
);
router.patch("/status/:id", auth(userRole.Agent), updateParcelStatus);
router.patch("/assign/:id", auth(userRole.Admin), assignAgent);
router.patch("/track/:id", auth(userRole.Agent), trackParcel);

module.exports = router;
