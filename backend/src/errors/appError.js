class AppError extends Error {
  constructor(message, statusCode) {
    super(typeof message === "string" ? message : message.en || "Error");
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.messages = typeof message === "object" ? message : { ar: message, en: message };
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
