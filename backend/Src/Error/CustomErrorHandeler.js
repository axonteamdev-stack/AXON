export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    const lang = req.lang || "ar";

    // ✅ This is the magic part:
    // It checks if AppError found a translation key in your Messages Index
    const message = err.messages 
        ? (err.messages[lang] || err.messages["ar"]) 
        : err.message;

    res.status(err.statusCode).json({
        status: err.status || "error",
        message,
        data: null,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
