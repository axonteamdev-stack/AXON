import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_edit_profile_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';

class PatientEditBasicInfoView extends StatelessWidget {
  const PatientEditBasicInfoView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientEditProfileCubit(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        appBar: AppBar(title: const Text('Basic Information')),
        body: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              CustomTextField(
                hintText: 'Full Name',
                controller:
                    context.read<PatientEditProfileCubit>().nameCtrl,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                hintText: 'Phone Number',
                controller:
                    context.read<PatientEditProfileCubit>().phoneCtrl,
              ),
              const Spacer(),
              CustomButton(text: 'Save', onPressed: () {}),
            ],
          ),
        ),
      ),
    );
  }
}
