import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_cubit.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dartdoctor_profile_state.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/widgets/doctor_profile_body.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:Axon/core/style/colors.dart';
class DoctorProfileView extends StatelessWidget {
  const DoctorProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => DoctorProfileCubit(),
      child: BlocBuilder<DoctorProfileCubit, DoctorProfileState>(
        builder: (context, state) {
          return Scaffold(
            backgroundColor: AppColors.white,
            body: DoctorProfileBody(state: state),
          );
        },
      ),
    );
  }
}
