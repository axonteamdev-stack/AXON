import 'package:Axon/core/di/di.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/basc_info/profile_cubit.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/basc_info/profile_states.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/patient_profile_body.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/style/colors.dart';

class PatientProfileView extends StatelessWidget {
  const PatientProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<ProfileCubit>()..getProfile(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        body: BlocBuilder<ProfileCubit, ProfileState>(
          builder: (context, state) {
            return PatientProfileBody(state: state);
          },
        ),
      ),
    );
  }
}
