import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_edit_profile_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';

class PatientEditMedicalProfileView extends StatelessWidget {
  const PatientEditMedicalProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientEditProfileCubit(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        appBar: AppBar(title: const Text('Medical Profile')),
        body: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              CustomTextField(
                hintText: 'Height (cm)',
                controller:
                    context.read<PatientEditProfileCubit>().heightCtrl,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                hintText: 'Weight (kg)',
                controller:
                    context.read<PatientEditProfileCubit>().weightCtrl,
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
