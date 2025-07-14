const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://flight-booking-system-client-lemon.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
// app.use("/api", authRoutes);
// app.use("/api/flights", flightRoutes);
// app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Flight Booking System API is running");
});

// Error handlers
// app.use(notFound);
// app.use(errorHandler);

module.exports = app;
