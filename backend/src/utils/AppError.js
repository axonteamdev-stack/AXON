class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // --- التعديل هنا ---
    // إذا كنت لا تريد ظهور مسارات الملفات إطلاقاً، قم بحذف هذا السطر:
    // Error.captureStackTrace(this, this.constructor);
    
    // الحل الأفضل: اجعل الـ stack يظهر فقط في مرحلة البرمجة (Development)
    if (process.env.NODE_ENV === 'development') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      // في وضع الـ Production، نقوم بإخفاء الـ stack تماماً
      this.stack = ''; 
    }
  }
}

export const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export default AppError;
