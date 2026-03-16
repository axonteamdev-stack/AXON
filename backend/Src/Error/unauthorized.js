import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./CustomErrorHandeler.js";

class unauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export default unauthorizedError;
