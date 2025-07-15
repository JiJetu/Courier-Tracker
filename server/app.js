const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const authRoutes = require("./src/routes/auth.routes");
const parcelRoutes = require("./src/routes/parcel.routes");
const adminRoutes = require("./src/routes/admin.routes");
const {
  notFound,
  errorHandler,
} = require("./src/middlewares/error.middleware");

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);
app.use("/api/parcel", parcelRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Flight Booking System API is running");
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
