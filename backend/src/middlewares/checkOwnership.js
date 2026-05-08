import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import { catchAsync } from "../utils/catchAsync.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isOwnerOrAdmin = (resourceOwnerId, userId, userRole) => {
  return resourceOwnerId?.toString() === userId || userRole === "admin";
};

export const createOwnershipMiddleware = (Model, ownerField, resourceName) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw new AppError(
        msg(`معرف ${resourceName} غير صالح`, `Invalid ${resourceName} ID`),
        400
      );
    }

    const resource = await Model.findById(id);
    if (!resource) {
      throw new AppError(
        msg(`${resourceName} غير موجود`, `${resourceName} not found`),
        404
      );
    }

    if (!isOwnerOrAdmin(resource[ownerField], req.user.id, req.user.role)) {
      throw new AppError(
        msg(`ليس لديك صلاحية تعديل أو حذف هذا ${resourceName}`, `You do not have permission to edit or delete this ${resourceName}`),
        403
      );
    }

    req[resourceName] = resource;
    next();
  });
};
