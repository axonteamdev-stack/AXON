import 'package:Axon/core/routes/base_routes.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor%20registration/doctor_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_registration/patient_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/doctor_registration_view.dart';
import 'package:Axon/features/auth/Presentation/views/login_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/patient_allergies_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/patient_health_conditions_view.dart';
import 'package:Axon/features/auth/Presentation/views/patient/patient_medical_profile_view.dart';
import 'package:Axon/features/auth/Presentation/views/registration_view.dart';
import 'package:Axon/features/auth/Presentation/views/select_role_view.dart';
import 'package:Axon/features/onboarding/presentation/views/onboarding_view.dart';
import 'package:Axon/features/splash/Presentation/views/splash_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AppRoutes {
  static const splash = '/';
  static const login = 'login';
  static const registration = 'registration';
  static const selectRole = 'selectRole';
  static const onBoarding = 'onBoarding';
  static const registrationDoctor = 'registrationDoctor';

  static const patientMedicalProfile = "patientMedicalProfile";
  static const patientHealthConditions = "patientHealthConditions";
  static const patientAllergies = "patientAllergies";

  static Route<void> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return BaseRoute(page: const SplashView());

      case onBoarding:
        return BaseRoute(page: const OnBoardingView());

      case selectRole:
        return BaseRoute(page: const SelectRoleView());

      case login:
        return BaseRoute(page: const LoginView());

      case registration:
        return BaseRoute(page: const RegistrationView());

      case registrationDoctor:
        return BaseRoute(
          page: BlocProvider(
            create: (_) => DoctorRegistrationCubit(),
            child: DoctorRegistrationView(),
          ),
        );

      case patientMedicalProfile:
        return BaseRoute(
          page: BlocProvider(
            create: (_) => PatientRegistrationCubit(),
            child: PatientMedicalProfileView(),
          ),
        );

      case patientHealthConditions:
        if (settings.arguments is! PatientRegistrationCubit) {
          return BaseRoute(
            page: const Scaffold(
              body: Center(child: Text("Error: Cubit Missing")),
            ),
          );
        }

        return BaseRoute(
          page: BlocProvider.value(
            value: settings.arguments as PatientRegistrationCubit,
            child: PatientHealthConditionsView(),
          ),
        );

      case patientAllergies:
        if (settings.arguments is! PatientRegistrationCubit) {
          return BaseRoute(
            page: const Scaffold(
              body: Center(child: Text("Error: Cubit Missing")),
            ),
          );
        }

        return BaseRoute(
          page: BlocProvider.value(
            value: settings.arguments as PatientRegistrationCubit,
            child: PatientAllergiesView(),
          ),
        );

      default:
        return BaseRoute(
          page: const Scaffold(body: Center(child: Text('Route not found'))),
        );
    }
  }
}
