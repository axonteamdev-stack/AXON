export const messages = {
  // User related messages
  USER_NOT_FOUND: {
    en: "User not found",
    ar: "المستخدم غير موجود",
  },
  USER_NOT_FOUND_OR_DELETED: {
    en: "User not found or already deleted",
    ar: "المستخدم غير موجود أو تم حذفه بالفعل",
  },
  USER_ADDED_SUCCESS: {
    en: "User added successfully",
    ar: "تم إضافة المستخدم بنجاح",
  },
  USER_UPDATED_SUCCESS: {
    en: "Updated successfully",
    ar: "تم التحديث بنجاح",
  },
  USER_DELETED_SUCCESS: {
    en: "User and all data deleted successfully",
    ar: "تم حذف المستخدم وجميع بياناته بنجاح",
  },

  // Doctor related messages
  DOCTOR_NOT_FOUND: {
    en: "Doctor not found with this ID",
    ar: "لم يتم العثور على طبيب بهذا المعرف",
  },
  DOCTOR_NOT_FOUND_GENERAL: {
    en: "Doctor not found",
    ar: "هذا الطبيب غير موجود",
  },
  DOCTOR_ACTIVATED_SUCCESS: {
    en: "Doctor account activated successfully",
    ar: "تم تفعيل حساب الطبيب بنجاح",
  },
  DOCTOR_DETAILS_FETCHED: {
    en: "Doctor details fetched successfully",
    ar: "تم جلب بيانات الطبيب بنجاح",
  },
  DOCTORS_FETCHED_SUCCESS: {
    en: "All doctors data merged and fetched successfully",
    ar: "تم جلب جميع بيانات الأطباء مدمجة بنجاح",
  },
  SEARCH_RESULTS_READY: {
    en: "Search results are ready",
    ar: "نتائج البحث جاهزة",
  },

  // Follow/Unfollow messages
  CANNOT_FOLLOW_YOURSELF: {
    en: "You cannot follow yourself!",
    ar: "لا يمكنك متابعة نفسك!",
  },
  UNFOLLOWED_SUCCESS: {
    en: "Unfollowed successfully",
    ar: "تم إلغاء المتابعة",
  },
  FOLLOWED_SUCCESS: {
    en: "Followed successfully",
    ar: "تمت المتابعة بنجاح",
  },

  // Authentication messages
  EMAIL_ALREADY_REGISTERED: {
    en: "Email already registered",
    ar: "البريد الإلكتروني مسجل بالفعل",
  },
  LICENSE_IMAGE_REQUIRED: {
    en: "License image is required for doctor",
    ar: "صورة ترخيص المزاولة مطلوبة للطبيب",
  },
  ENTER_EMAIL_PASSWORD: {
    en: "Please enter email and password",
    ar: "يرجى إدخال البريد وكلمة المرور",
  },
  INVALID_CREDENTIALS: {
    en: "Invalid login credentials",
    ar: "بيانات الدخول غير صحيحة",
  },
  ACCOUNT_PENDING_APPROVAL: {
    en: "Your account is pending admin approval",
    ar: "حسابك في انتظار موافقة الإدارة",
  },
  NO_REFRESH_TOKEN: {
    en: "No refresh token provided",
    ar: "لا يوجد Refresh Token",
  },
  SESSION_EXPIRED: {
    en: "Session expired, please login again",
    ar: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً",
  },
  NO_USER_WITH_EMAIL: {
    en: "No user found with this email",
    ar: "لا يوجد مستخدم بهذا البريد",
  },
  EMAIL_SEND_FAILED: {
    en: "Failed to send email",
    ar: "فشل في إرسال البريد الإلكتروني",
  },
  INVALID_OR_EXPIRED_CODE: {
    en: "Code is invalid or expired",
    ar: "الكود غير صحيح أو انتهت صلاحيته",
  },
  INVALID_RESET_LINK: {
    en: "This link is not for password, permissions, or email change",
    ar: "هذا الرابط ليس لتغيير كلمة المرور أو الصلاحيات أو الإيميل",
  },
  NO_VALID_UPDATE_DATA: {
    en: "No valid data sent for update",
    ar: "لم يتم إرسال بيانات صالحة للتحديث",
  },

  // Article messages
  ARTICLE_NOT_FOUND: {
    en: "This article was not found",
    ar: "هذا المقال غير موجود",
  },
  ARTICLE_PUBLISHED_SUCCESS: {
    en: "Article published successfully",
    ar: "تم نشر المقال بنجاح",
  },
  ALL_ARTICLES_FETCHED_SUCCESS: {
    en: "All articles fetched successfully",
    ar: "تم جلب جميع المقالات بنجاح",
  },
  FOLLOWING_ARTICLES_FETCHED_SUCCESS: {
    en: "Following feed articles fetched successfully",
    ar: "تم جلب مقالات الأطباء المتابعين",
  },
  MY_ARTICLES_FETCHED_SUCCESS: {
    en: "Your articles fetched successfully",
    ar: "تم جلب مقالاتك الخاصة بنجاح",
  },
  NO_DOCTORS_FOLLOWING: {
    en: "You are not following any doctors yet",
    ar: "أنت لا تتابع أي أطباء حالياً",
  },
  ARTICLE_FETCHED_SUCCESS: {
    en: "Article fetched successfully",
    ar: "تم جلب بيانات المقال بنجاح",
  },

  // Medication messages
  START_DATE_IN_PAST: {
    en: "Start date cannot be in the past",
    ar: "تاريخ البداية لا يمكن أن يكون في الماضي",
  },
  END_DATE_IN_PAST: {
    en: "End date cannot be in the past",
    ar: "تاريخ النهاية لا يمكن أن يكون في الماضي",
  },
  MEDICATION_ALREADY_ACTIVE: {
    en: "This medication is already added and still active",
    ar: "هذا الدواء مضاف بالفعل وما زال سارياً",
  },
  MEDICATION_ADDED_SUCCESS: {
    en: "Medication added successfully",
    ar: "تمت إضافة الدواء بنجاح",
  },
  MEDICATION_NOT_FOUND: {
    en: "Medication not found",
    ar: "الدواء غير موجود",
  },
  END_DATE_INVALID: {
    en: "End date is not logical compared to start date",
    ar: "تاريخ النهاية غير منطقي مقارنة بالبداية",
  },
  MEDICATION_UPDATED_SUCCESS: {
    en: "Medication updated successfully",
    ar: "تم تحديث بيانات الدواء بنجاح",
  },
  MEDICATION_FETCHED_SUCCESS: {
    en: "Medication details fetched successfully",
    ar: "تم جلب بيانات الدواء بنجاح",
  },
  MEDICATION_DELETED_SUCCESS: {
    en: "Medication deleted successfully",
    ar: "تم حذف الدواء بنجاح",
  },
  MEDICATIONS_LIST_FETCHED_SUCCESS: {
    en: "Medications list fetched successfully",
    ar: "تم جلب قائمة الأدوية بنجاح",
  },

  // Authentication / password messages
  EMAIL_CODE_SENT: {
    en: "Verification code sent to email",
    ar: "تم إرسال الكود للبريد الإلكتروني",
  },
  PASSWORD_RESET_SUCCESS: {
    en: "Password changed successfully",
    ar: "تم تغيير كلمة المرور بنجاح",
  },

  PATIENT_SIGNUP_SUCCESS: {
    en: "Patient registration submitted successfully",
    ar: "تم إرسال طلب التسجيل بنجاح",
  },
  DOCTOR_SIGNUP_SUCCESS: {
    en: "Doctor registration submitted successfully",
    ar: "تم إرسال طلب التسجيل بنجاح",
  },
  LOGIN_SUCCESS: {
    en: "Logged in successfully",
    ar: "تم تسجيل الدخول بنجاح",
  },
  REFRESH_TOKEN_SUCCESS: {
    en: "Token refreshed successfully",
    ar: "تم تحديث التوكن بنجاح",
  },
  LOGOUT_SUCCESS: {
    en: "Logged out successfully",
    ar: "تم تسجيل الخروج بنجاح",
  },
  UPDATE_SUCCESS: {
    en: "Data updated successfully",
    ar: "تم تحديث البيانات بنجاح",
  },
  NOT_LOGGED_IN: {
    en: "You are not logged in, please log in to access",
    ar: "أنت غير مسجل دخول، يرجى تسجيل الدخول للوصول",
  },
  TOKEN_OWNER_NOT_FOUND: {
    en: "The token owner no longer exists",
    ar: "المستخدم صاحب هذا التوكن لم يعد موجوداً",
  },
  INVALID_OR_EXPIRED_TOKEN: {
    en: "The token is invalid or expired",
    ar: "التوكن غير صالح أو انتهت صلاحيته",
  },
  NO_PERMISSION: {
    en: "You do not have permission to access this feature",
    ar: "ليس لديك صلاحية الوصول لهذه الميزة",
  },

  // General messages
  PATH_NOT_FOUND: {
    en: "The requested path was not found",
    ar: "العنوان المطلوب غير موجود",
  },
  SERVER_RUNNING: {
    en: "Welcome to MeddioDoc API - Server is live and running!",
    ar: "مرحباً بك في MeddioDoc API - الخادم يعمل بنجاح!",
  },

  // Validation error messages
  VALIDATION_FAILED: {
    en: "Data validation failed. Please check your input.",
    ar: "فشل التحقق من البيانات. يرجى التحقق من المدخلات.",
  },
  FIELD_REQUIRED: {
    en: "{field} is required",
    ar: "{field} مطلوب",
  },
  INVALID_FORMAT: {
    en: "{field} has invalid format",
    ar: "{field} صيغة غير صحيحة",
  },
  INVALID_EMAIL: {
    en: "Invalid email format",
    ar: "صيغة البريد الإلكتروني غير صحيحة",
  },
  PASSWORD_TOO_SHORT: {
    en: "Password must be at least 6 characters",
    ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
  },
};

// Helper function to get translated message
export const getMessage = (key, lang = "ar") => {
  const message = messages[key];
  if (!message) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  return message[lang] || message["ar"];
};
