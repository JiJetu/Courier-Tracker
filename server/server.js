const app = require("./app");
const connectDB = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  // pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (parcelId) => {
    socket.join(parcelId);
    console.log(`Client ${socket.id} joined room ${parcelId}`);
  });

  socket.on("leave", (parcelId) => {
    socket.leave(parcelId);
    console.log(`Client ${socket.id} left room ${parcelId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});
app.set("io", io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
