import 'package:Axon/core/routes/base_routes.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor%20registration/doctor_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_registration/patient_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/doctor/doctor_registration_view.dart';
import 'package:Axon/features/auth/Presentation/views/forget%20password/forgot_password_email_view.dart';
import 'package:Axon/features/auth/Presentation/views/forget%20password/forgot_password_otp_view.dart';
import 'package:Axon/features/auth/Presentation/views/forget%20password/reset_password_view.dart';
import 'package:Axon/features/auth/Presentation/views/login_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/account_created_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/patient_allergies_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/patient_health_conditions_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/patient_lab_tests_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/patient_medical_profile_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/patient_radiology_view.dart';
import 'package:Axon/features/auth/Presentation/views/registration_view.dart';
import 'package:Axon/features/auth/Presentation/views/select_role_view.dart';
import 'package:Axon/features/onboarding/presentation/views/onboarding_view.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/home_view.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_edit_profile_cubit.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/patient_edit_allergies_view.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/patient_edit_basic_info_view.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/patient_edit_health_conditions_view.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/patient_edit_lab_tests_view.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/patient_edit_medical_profile_view.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/patient_edit_radiology_view.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/patient_profile_view.dart';
import 'package:Axon/features/splash/Presentation/views/splash_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AppRoutes {
  // Splash & Onboarding
  static const splash = '/';
  static const onBoarding = 'onBoarding';

  // Auth
  static const login = 'login';
  static const registration = 'registration';
  static const selectRole = 'selectRole';

  // Doctor Registration
  static const registrationDoctor = 'registrationDoctor';

  // Patient Registration
  static const patientMedicalProfile = "patientMedicalProfile";
  static const patientHealthConditions = "patientHealthConditions";
  static const patientAllergies = "patientAllergies";

  // Forgot Password
  static const forgotPasswordEmail = "forgotPasswordEmail";
  static const forgotPasswordOtp = "forgotPasswordOtp";
  static const resetPassword = "resetPassword";

  // Patient Documents
  static const patientLabTests = "patientLabTests";
  static const patientRadiology = "patientRadiology";

  // Auth Success
  static const accountCreated = 'accountCreated';

  // Home
  static const home = 'home';

  // Patient Profile
  static const patientProfile = 'patientProfile';
  
  // Patient Edit Pages
static const patientEditBasicInfo = 'patientEditBasicInfo';
static const patientEditMedicalProfile = 'patientEditMedicalProfile';
static const patientEditHealthConditions = 'patientEditHealthConditions';
static const patientEditAllergies = 'patientEditAllergies';
static const patientEditRadiology = 'patientEditRadiology';
static const patientEditLabTests = 'patientEditLabTests';


  static Route<void> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {

      // Splash & Onboarding
      case splash:
        return BaseRoute(page: const SplashView());

      case onBoarding:
        return BaseRoute(page: const OnBoardingView());

      // Auth
      case selectRole:
        return BaseRoute(page: const SelectRoleView());

      case login:
        return BaseRoute(page: const LoginView());

      case registration:
        return BaseRoute(page: const RegistrationView());

      // Doctor Registration
      case registrationDoctor:
        return BaseRoute(
          page: BlocProvider(
            create: (_) => DoctorRegistrationCubit(),
            child: DoctorRegistrationView(),
          ),
        );

      // Patient Registration
      case patientMedicalProfile:
        return BaseRoute(
          page: BlocProvider(
            create: (_) => PatientRegistrationCubit(),
            child: PatientMedicalProfileView(),
          ),
        );

      
case AppRoutes.patientAllergies:
  return BaseRoute(
    page: const PatientAllergiesView(),
  );

case AppRoutes.patientHealthConditions:
  return BaseRoute(
    page: const PatientHealthConditionsView(),
  );



      // Forgot Password
      case forgotPasswordEmail:
        return BaseRoute(page: const ForgotPasswordEmailView());

      case forgotPasswordOtp:
        return BaseRoute(page: const ForgotPasswordOtpView());

      case resetPassword:
        return BaseRoute(page: const ResetPasswordView());

      // Patient Documents
      case patientLabTests:
        return BaseRoute(page: const PatientLabTestsView());

      case patientRadiology:
        return BaseRoute(page: const PatientRadiologyView());

      // Auth Success
      case accountCreated:
        return BaseRoute(page: const AccountCreatedView());

      // Home
      case home:
        return BaseRoute(page: const HomeView());

      // Patient Profile
      case patientProfile:
        return BaseRoute(page: const PatientProfileView());

  case AppRoutes.patientEditBasicInfo:
  return BaseRoute(
    page: BlocProvider(
      create: (_) => PatientEditProfileCubit(),
      child: const PatientEditBasicInfoView(),
    ),
  );

case AppRoutes.patientEditMedicalProfile:
  return BaseRoute(
    page: BlocProvider(
      create: (_) => PatientEditProfileCubit(),
      child: const PatientEditMedicalProfileView(),
    ),
  );

case AppRoutes.patientEditHealthConditions:
  return BaseRoute(
    page: BlocProvider(
      create: (_) => PatientEditProfileCubit(),
      child: const PatientEditHealthConditionsView(),
    ),
  );

case AppRoutes.patientEditAllergies:
  return BaseRoute(
    page: BlocProvider(
      create: (_) => PatientEditProfileCubit(),
      child: const PatientEditAllergiesView(),
    ),
  );

case AppRoutes.patientEditRadiology:
  return BaseRoute(
    page: BlocProvider(
      create: (_) => PatientEditProfileCubit(),
      child: const PatientEditRadiologyView(),
    ),
  );

case AppRoutes.patientEditLabTests:
  return BaseRoute(
    page: BlocProvider(
      create: (_) => PatientEditProfileCubit(),
      child: const PatientEditLabTestsView(),
    ),
  );



      

      default:
        return BaseRoute(
          page: const Scaffold(
            body: Center(child: Text('Route not found')),
          ),
        );
    }
  }
}
