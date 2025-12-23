import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_state.dart';
import 'package:flutter/material.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_cubit.dart';

class PatientProfileHeader extends StatelessWidget {
  final PatientProfileState state;

  const PatientProfileHeader({
    super.key,
    required this.state,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(
        top: 28,
        bottom: 16,
        left: 20,
        right: 20,
      ),
      width: double.infinity,
      decoration: const BoxDecoration(
        color: AppColors.primaryColor,
        borderRadius: BorderRadius.vertical(
          bottom: Radius.circular(24),
        ),
      ),
      child: Center(
        child: Column(
          children: [
            const CircleAvatar(
              radius: 40,
              backgroundImage: AssetImage(
                AppImages.medicalProfile,
              ),
            ),
            const SizedBox(height: 8),
            TextApp(
              text: state.name,
              fontSize: 16,
              weight: AppTextWeight.bold,
              color: AppColors.white,
            ),
            const SizedBox(height: 2),
            TextApp(
              text: state.email,
              fontSize: 12,
              color: AppColors.white,
            ),
          ],
        ),
      ),
    );
  }
}
