import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

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
  console.log("User Connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  }
);
});
const PORT = 4000; 
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
