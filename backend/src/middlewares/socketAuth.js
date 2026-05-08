import { verifyAccessToken } from "../services/tokenService.js";
import { RateLimiterMongo } from "rate-limiter-flexible";
import mongoose from "mongoose";

const socketConnectionLimiter = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: "socket_conn",
  points: 10,
  duration: 60,
  blockDuration: 300,
});

export const socketAuth = async (socket, next) => {
  try {
    const clientIp = socket.handshake.address || socket.conn.remoteAddress;
    await socketConnectionLimiter.consume(clientIp);

    const token = socket.handshake.auth.token;
    if (!token) throw new Error("Authentication required");
    const decoded = verifyAccessToken(token);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    if (err.msBeforeNext) {
      return next(new Error("Too many connection attempts. Please try again later."));
    }
    next(new Error("Invalid token"));
  }
};
