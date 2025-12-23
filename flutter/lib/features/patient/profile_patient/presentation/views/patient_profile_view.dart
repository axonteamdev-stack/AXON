import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_state.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/patient_profile_body.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_cubit.dart';

class PatientProfileView extends StatelessWidget {
  const PatientProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => PatientProfileCubit(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        body: BlocBuilder<PatientProfileCubit, PatientProfileState>(
          builder: (context, state) {
            return PatientProfileBody(state: state);
          },
        ),
      ),
    );
  }
}
