class Endpoints {
  static const String baseUrl =

  "https://tender-morna-axon-fp-b76b6646.koyeb.app/";
      // "https://tender-morna-axon-fp-b76b6646.koyeb.app/api/v1";


  static const String baseUrlImage =
      "https://tender-morna-axon-fp-b76b6646.koyeb.app/";

  // ================== AUTH ==================
  static const String login =
      "/auth/login";

  static const String registerDoctor =
      "/auth/signup/doctor";

      // static const String registerDoctor =
      // "/auth/signup-doctor";

  static const String registerPatient =
  "/auth/signup/patient";

  // "/auth/signup-patient";
      

  static const String forgotPassword =
      "/auth/forgot-password";

  static const String resetPassword =
      "/auth/reset-password";

      static const String refreshToken =
    "/auth/refresh-token";

  // ================== ARTICLES ==================
  static const String getAllArticales =
      "/articles";

  static const String createArticle =
      "/articles/create";

  // ================== MEDICINE ==================
  static const String addMedicine =
      "/medications";

  static const String getMedicine =
      "/medications";

  static const String updateMedicine =
      "/medications";

  static const String deleteMedicine =
      "/medications";



      static const String updateMe = "/auth/updateMe";



      // endpoints.dart



  static const String getAllDoctors = "/auth/all-doctors";
  static const String getDoctorById = "/auth/doctor";
  static const String searchDoctors = "/auth/search-doctors";

}