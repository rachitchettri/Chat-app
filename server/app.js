import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // Generate a unique ID for each socket connection
  const userId = uuidv4();
  console.log("User Connected:", socket.id, "User ID:", userId);

  // Send the unique user ID to the client
  socket.emit("userId", userId);

  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    io.emit("message", { ...msg, userId });  // Include userId with the message
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = 4000; 
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
