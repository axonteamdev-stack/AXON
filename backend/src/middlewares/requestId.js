import { v4 as uuidv4 } from "uuid";

export const requestId = (req, res, next) => {
  req.requestId = req.get("X-Request-ID") || uuidv4();
  res.setHeader("X-Request-ID", req.requestId);
  next();
};
