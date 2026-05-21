import { Server } from "socket.io";
import { socketAuth } from "../middlewares/socketAuth.js";
import { logger } from "./logger.js";

let io;

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized. Call initSocket first.");
  return io;
};

export const initSocket = (server) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:3000"];

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Origin not allowed"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    logger.info(
      { socketId: socket.id, userId: socket.user?.id },
      "User connected",
    );

    if (socket.user?.id) {
      socket.join(socket.user.id.toString());
    }

    socket.on("joinConversation", (conversationId) => {
      if (!conversationId || typeof conversationId !== "string") {
        socket.emit("error", { message: "Invalid conversation ID" });
        return;
      }
      socket.join(conversationId);
      logger.info({ socketId: socket.id, conversationId }, "User joined room");
    });

    socket.on("disconnect", (reason) => {
      logger.info({ socketId: socket.id, reason }, "User disconnected");
    });
  });

  return io;
};

// DEAD CODE FLAG
/*
export const emitToRoom = (room, event, data) => {
  const ioInstance = getIO();
  ioInstance.to(room).emit(event, data);
};
*/
