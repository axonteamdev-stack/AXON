class AppError extends Error {
  constructor(messages, statusCode) {
    // messages هنا هتكون عبارة عن { ar: 'رسالة بالعربي', en: 'English message' }
    super(messages.en); // الافتراضي للـ Error الأصلي هو الإنجليزي

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    // بنخزن اللغتين عشان الـ Global Handler يختار منهم
    this.messages = messages; 

    if (process.env.NODE_ENV === 'development') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}




// دالة موحدة للردود الناجحة تدعم اللغتين
export const sendResponse = (res, statusCode, messages, data = null) => {
    // جلب اللغة التي تم تحديدها بواسطة الـ Middleware (setLanguage)
    const lang = res.req.lang || 'ar'; 

    res.status(statusCode).json({
        status: 'success',
        // اختيار الرسالة بناءً على اللغة
        message: messages[lang] || messages['ar'], 
        // إذا كان هناك بيانات أرسلها، وإذا لم يوجد لا ترسل الحقل
        ...(data && { data })
    });
};




export const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export default AppError;
