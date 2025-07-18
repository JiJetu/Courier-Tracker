const express = require("express");
const {
  bookParcel,
  getParcels,
  updateParcelStatus,
  assignAgent,
  trackParcel,
  getParcelById,
  getActiveAssignedParcels,
  exportParcelsCSV,
  exportParcelsPDF,
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
router.get("/assigned-active", auth(userRole.Agent), getActiveAssignedParcels);
router.get(
  "/:id",
  auth(userRole.Customer, userRole.Agent, userRole.Admin),
  getParcelById
);
router.patch("/status/:id", auth(userRole.Agent), updateParcelStatus);
router.patch("/assign/:id", auth(userRole.Admin), assignAgent);
router.patch("/track/:id", auth(userRole.Agent), trackParcel);

router.get(
  "/export/csv",
  auth(userRole.Customer, userRole.Agent, userRole.Admin),
  exportParcelsCSV
);
router.get(
  "/export/pdf",
  auth(userRole.Customer, userRole.Agent, userRole.Admin),
  exportParcelsPDF
);

module.exports = router;
