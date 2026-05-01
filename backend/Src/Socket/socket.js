import { Server } from "socket.io";

let io;

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // دخول روم المحادثة
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined room: ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

export default initSocket;
