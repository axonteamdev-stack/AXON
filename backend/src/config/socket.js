import { Server } from "socket.io";
import { socketAuth } from "../middlewares/socketAuth.js";

let io;

export const getIO = () => {
    if (!io)
        throw new Error("Socket.io not initialized. Call initSocket first.");
    return io;
};

export const initSocket = (server) => {  // <-- ADD export HERE
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:3000",
    ];

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
        console.log("📡 User connected:", socket.id);

        socket.on("joinConversation", (conversationId) => {
            if (!conversationId || typeof conversationId !== "string") {
                socket.emit("error", { message: "Invalid conversation ID" });
                return;
            }
            socket.join(conversationId);
            console.log(`User ${socket.id} joined room: ${conversationId}`);
        });

        socket.on("disconnect", (reason) => {
            console.log("📡 User disconnected:", socket.id, reason);
        });
    });

    return io;
};

export const emitToRoom = (room, event, data) => {
    const ioInstance = getIO();
    ioInstance.to(room).emit(event, data);
};