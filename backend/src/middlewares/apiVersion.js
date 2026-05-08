import AppError from "../Errors/appError.js";
import statusCodes from "http-status-codes";
import { msg } from "../I18n/index.js";

const SUPPORTED_VERSIONS = ["1", "2"];
const DEFAULT_VERSION = "2";

export const validateApiVersion = (req, res, next) => {
  const version = req.get("X-API-Version") || DEFAULT_VERSION;

  if (!SUPPORTED_VERSIONS.includes(version)) {
    return next(
      new AppError(
        msg(
          `إصدار API غير مدعوم: ${version}. الإصدارات المدعومة: ${SUPPORTED_VERSIONS.join(", ")}`,
          `Unsupported API version: ${version}. Supported: ${SUPPORTED_VERSIONS.join(", ")}`,
        ),
        statusCodes.BAD_REQUEST,
      ),
    );
  }

  req.apiVersion = version;
  res.setHeader("X-API-Version", version);
  next();
};
