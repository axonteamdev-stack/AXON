// // This is the clean Base Class that AppError will extend
// class CustomAPIError extends Error {
//   constructor(message, statusCode = 500) {
//     super(message);
//     this.statusCode = statusCode;
//     this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
//     this.isOperational = true;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// export default CustomAPIError;
