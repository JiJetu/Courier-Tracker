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
  console.log("connected to socket.io");

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});
app.set("io", io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
