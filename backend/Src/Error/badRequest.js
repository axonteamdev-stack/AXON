import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./CustomErrorHandeler.js";

class badRequestError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export default badRequestError;
