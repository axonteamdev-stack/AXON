import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/widget_patient/account_created_view.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/widget_patient/patient_allergies_view.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/widget_patient/patient_health_conditions_view.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/widget_patient/patient_lab_tests_view.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/widget_patient/patient_radiology_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/di/di.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_registration/patient_registration_cubit.dart';
import 'patient_medical_profile_view.dart';

class PatientRegistrationFlow extends StatelessWidget {
  const PatientRegistrationFlow({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<PatientRegistrationCubit>(),
      child: Navigator(
        initialRoute: '/',
        onGenerateRoute: (settings) {
          switch (settings.name) {
            case '/':
              return MaterialPageRoute(
                builder: (_) => PatientMedicalProfileView(),
              );

            case AppRoutes.patientHealthConditions:
              return MaterialPageRoute(
                builder: (_) => const PatientHealthConditionsView(),
              );

            case AppRoutes.patientAllergies:
              return MaterialPageRoute(
                builder: (_) => const PatientAllergiesView(),
              );

            case AppRoutes.patientRadiology:
              return MaterialPageRoute(
                builder: (_) => const PatientRadiologyView(),
              );

            case AppRoutes.patientLabTests:
              return MaterialPageRoute(
                builder: (_) => const PatientLabTestsView(),
              );
          }
        },
      ),
    );
  }
}
