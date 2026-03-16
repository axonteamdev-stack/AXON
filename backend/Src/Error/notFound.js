import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./CustomErrorHandeler.js";

class notFound extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export default notFound;
