class Endpoints {

  static const String baseUrl =
      "https://tender-morna-axon-fp-b76b6646.koyeb.app/";

  static const String baseUrlImage =
      "https://tender-morna-axon-fp-b76b6646.koyeb.app/";

  // ================== AUTH ==================

  static const String login =
      "/auth/login";

  static const String registerDoctor =
      "/auth/signup/doctor";

  static const String registerPatient =
      "/auth/signup/patient";

  static const String forgotPassword =
      "/auth/forgot-password";

  static const String resetPassword =
      "/auth/reset-password";

  static const String refreshToken =
      "/auth/refresh";

  // ================== ARTICLES ==================

  static const String getAllArticales =
      "/posts/articles?page=1&limit=10";

  static const String createArticle =
      "posts/articles";

  // ================== MEDICINE ==================

  static const String addMedicine =
      "/medications";

  static const String getMedicine =
      "/medications";

  static const String updateMedicine =
      "/medications";

  static const String deleteMedicine =
      "/medications";

  static const String updateMe =
      "/auth/updateMe";

  // ================== DOCTORS ==================

  static const String getAllDoctors =
      "/auth/all-doctors";

  static const String getDoctorById =
      "/auth/doctor";

  static const String getDoctorPosts =
      "/posts/doctor";

  static const String searchDoctors =
      "/auth/search-doctors";

  static const String updateProfile =
      "/users/me";

  // ================== APPOINTMENTS ==================

  static const pendingRequests =
      "/appointments/pending";

  static String updateAppointmentStatus(
    String appointmentId,
  ) =>
      "/appointments/$appointmentId/status";

  static const doctorHistory =
      "/appointments/history";
}